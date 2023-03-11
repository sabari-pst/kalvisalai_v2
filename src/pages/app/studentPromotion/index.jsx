import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  Alert,
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  momentDate,
  upperCase,
} from "../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../utils/serviceUrl";
import PsModalWindow from "../../../utils/PsModalWindow";
import { NoDataFound } from "../components";
import { COURSE_TYPE_SORT_ORDER, DegreeType } from "../../../utils/data";
import useItems from "antd/lib/menu/hooks/useItems";
import LoaderSubmitButton from "../../../utils/LoaderSubmitButton";

const StudentPromotion = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [degreeType, setDegreeType] = useState("");
  const [promotedStudents, setPromotedStudents] = useState([]);
  const [promotionDate, setPromotionDate] = useState("");

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  const loadStudents = () => {
    if (!degreeType || degreeType.length < 1) {
      toast.error("Select Degree Type");
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("studentstatus", "promoted");
    form.append("dept_type", degreeType);
    form.append("for", "promotion");

    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        setDataView(res["data"].data);
      }
      setLoader(false);
    });
  };

  const resetClick = () => {
    setDataList([]);
    setDataView([]);
    setDegreeType("");
    setPromotedStudents([]);
  };

  const handleSelectAll = () => {
    if (promotedStudents.length > 0) setPromotedStudents([]);
    else setPromotedStudents(dataList);
  };

  const checkStudentExistInPromotionList = (student) => {
    let index = promotedStudents.findIndex((item) => item.uuid == student.uuid);
    return index > -1 ? true : false;
  };

  const rowCheckBoxClick = (student) => {
    let ps = [...promotedStudents];
    let index = ps.findIndex((item) => item.uuid == student.uuid);
    if (index > -1) {
      ps = ps.filter((item) => item.uuid != student.uuid);
    } else {
      ps.push(student);
    }
    setPromotedStudents(ps);
  };

  const saveButotnClick = () => {
    if (promotionDate.length < 1) {
      toast.error("Please select promotion date");
      return;
    }
    if (promotedStudents.length < 1) {
      toast.error("Please select students for promotion");
      return;
    }
    if (!window.confirm("Do you want to save?")) return;
    setLoader(true);

    const form = new FormData();
    form.append("students", JSON.stringify(promotedStudents));
    axios.post(ServiceUrl.STUDENTS.SAVE_PROMOTION, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        resetClick();
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  return (
    <>
      <CardFixedTop title="Student Promotion">
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              disabled={dataList.length < 1}
              onClick={(e) => resetClick()}
            >
              <i className="fa fa-xmark fs-5 px-1"></i> Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container py-3">
        <Spin spinning={loader}>
          {dataList.length < 1 && (
            <Row className="mt-3">
              <Col md={3}>
                <InputGroup size="sm">
                  <InputGroup.Text>Type</InputGroup.Text>
                  <Form.Control
                    as="select"
                    name="type"
                    size="sm"
                    className="fw-bold form-select form-select-sm"
                    required
                    onChange={(e) => setDegreeType(e.target.value)}
                  >
                    <option value="">-Select-</option>
                    {COURSE_TYPE_SORT_ORDER.map((item) => (
                      <option value={item}>{upperCase(item)}</option>
                    ))}
                  </Form.Control>
                  <InputGroup.Text className="px-0 py-0">
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => loadStudents()}
                    >
                      VIEW
                    </Button>
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
          )}

          {dataList.length > 0 && (
            <>
              <Row>
                <Col md={3}>
                  <InputGroup size="sm">
                    <InputGroup.Text>Promotion Date</InputGroup.Text>
                    <Form.Control
                      type="date"
                      className="fw-bold"
                      name="promotion_date"
                      onChange={(e) => setPromotionDate(e.target.value)}
                      value={promotionDate}
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
              <div
                className="tableFixHead ps-table mt-2"
                style={{ maxHeight: "calc(100vh - 150px)" }}
              >
                <table>
                  <thead>
                    <tr>
                      <th align="center" className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={
                            dataList.length > 0 &&
                            dataList.length == promotedStudents.length
                          }
                          onClick={handleSelectAll}
                        />
                      </th>
                      <th>S.No</th>
                      <th>Reg.No</th>
                      <th>Student Name</th>
                      <th>Course</th>
                      <th>Batch</th>
                      <th>Section</th>
                      <th>Sem.From</th>
                      <th>Sem.To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataView.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td align="center">
                            <Form.Check
                              type="checkbox"
                              checked={checkStudentExistInPromotionList(item)}
                              onClick={(e) => rowCheckBoxClick(item)}
                            />
                          </td>
                          <td>{i + 1}</td>
                          <td>{item.registerno || item.admissionno}</td>
                          <td>{upperCase(item.name)}</td>
                          <td>
                            {item.degree_name} - {item.course_name} (
                            {item.dept_type == "aided" ? "R" : "SF"})
                          </td>
                          <td>{item.batch}</td>
                          <td>{item.section}</td>
                          <td>{item.semester}</td>
                          <td>{parseInt(item.semester) + 1}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Row className="mt-3">
                <Col md={3}>
                  <InputGroup size="sm">
                    <InputGroup.Text>Total Students</InputGroup.Text>
                    <Form.Control
                      text="text"
                      className="fw-bold"
                      value={dataList.length}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <InputGroup size="sm">
                    <InputGroup.Text>Selected Students</InputGroup.Text>
                    <Form.Control
                      text="text"
                      className="fw-bold"
                      value={promotedStudents.length}
                    />
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <div className="text-end">
                    <a
                      href="javascript:;"
                      className="pe-3 me-3 border-end"
                      onClick={resetClick}
                    >
                      Cancel
                    </a>
                    <LoaderSubmitButton
                      loading={loader}
                      type="button"
                      text="Save Promotion"
                      onClick={(e) => saveButotnClick()}
                    />
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Spin>
      </div>
    </>
  );
};

export default withRouter(StudentPromotion);
