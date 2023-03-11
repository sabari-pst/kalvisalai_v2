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
import SelectRecords from "../feeAssigning/classWiseFeeAssigning/selectRecords";
import { listCollegeYears } from "../../../models/academicYears";

const ClassWisePromotion = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [selectedRecords, setSelectedRecords] = useState([]);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [degreeType, setDegreeType] = useState("");
  const [promotedStudents, setPromotedStudents] = useState([]);

  const [collegeYears, setCollegeYears] = useState([]);
  const [collegeYear, setCollegeYear] = useState([]);

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  useEffect(() => {
    setLoader(true);
    listCollegeYears("1").then((res) => {
      if (res) setCollegeYears(res);
      setLoader(false);
    });
  }, []);

  const loadStudents = () => {
    /*if (!degreeType || degreeType.length < 1) {
      toast.error("Select Degree Type");
      return;
    }*/
    setLoader(true);
    const form = new FormData();
    form.append("studentstatus", "promoted");
    form.append("dept_type", degreeType);
    form.append("for", "promotion");
    form.append("batch", selectedRecords.academic_year);
    form.append("course", selectedRecords.course_id);
    form.append("semester", selectedRecords.semester);
    form.append("dept_type", selectedRecords.course_type);

    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        setDataView(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  useEffect(() => {
    if (selectedRecords.course_id) loadStudents();
  }, [selectedRecords]);

  const resetClick = () => {
    setSelectedRecords([]);
    setDataList([]);
    setDataView([]);
    setDegreeType("");
    setPromotedStudents([]);
  };

  const handleSelectAll = () => {
    if (promotedStudents.length > 0) setPromotedStudents([]);
    else {
      let x = [];
      dataList.map((student) => {
        x.push({
          uuid: student.uuid,
          batch: student.batch,
          course: student.course,
          semester: student.semester,
        });
      });
      setPromotedStudents(x);
    }
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
      ps.push({
        uuid: student.uuid,
        batch: student.batch,
        course: student.course,
        semester: student.semester,
      });
    }
    setPromotedStudents(ps);
  };

  const saveButotnClick = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (promotedStudents.length < 1) {
      toast.error("Please select students for promotion");
      return;
    }
    if (!window.confirm("Do you want to save?")) return;
    setLoader(true);

    axios
      .post(ServiceUrl.STUDENTS.SAVE_PROMOTION, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          resetClick();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  useEffect(() => {
    if (dataList.length < 1) return;
    let oldCollegeYear = dataList[0].college_year;
    let oldSem = dataList[0].semester;
    oldCollegeYear = oldCollegeYear.split("-");

    if (oldSem % 2 == 0) {
      let c = collegeYears.filter(
        (item) => item.start_year == oldCollegeYear[1]
      );
      setCollegeYear(c);
    } else {
      let c = collegeYears.filter(
        (item) => item.start_year == oldCollegeYear[0]
      );
      setCollegeYear(c);
    }
  }, [JSON.stringify(dataList)]);
  return (
    <>
      <CardFixedTop title="Class Wise Promotion">
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              disabled={!selectedRecords.course_id}
              onClick={(e) => resetClick()}
            >
              <i className="fa fa-xmark fs-5 px-1"></i> Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container py-3">
        <Spin spinning={loader}>
          {!selectedRecords.course_id && (
            <Row className="mt-2">
              <Col md={6}>
                <SelectRecords onSuccess={(d) => setSelectedRecords(d)} />
              </Col>
            </Row>
          )}

          {dataList.length > 0 && (
            <>
              <Form
                action=""
                noValidate
                validated={validated}
                onSubmit={saveButotnClick}
              >
                <input
                  type="hidden"
                  name="students"
                  value={JSON.stringify(promotedStudents)}
                />
                <Row className="">
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Status</InputGroup.Text>
                      <Form.Control
                        as="select"
                        className="fw-bold form-select"
                        name="promotion_status"
                        required
                      >
                        <option value="promoted">Promoted</option>
                      </Form.Control>
                    </InputGroup>
                  </Col>
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Promotion Date</InputGroup.Text>
                      <Form.Control
                        type="date"
                        className="fw-bold"
                        name="promotion_date"
                        required
                      />
                    </InputGroup>
                  </Col>
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Academic Year</InputGroup.Text>
                      <Form.Control
                        as="select"
                        className="fw-bold form-control"
                        name="college_year"
                        required
                      >
                        <option value="">-Select-</option>
                        {collegeYear.map((item) => (
                          <option value={item.college_year}>
                            {item.college_year}
                          </option>
                        ))}
                      </Form.Control>
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
                        <th width="60">S.No</th>
                        <th>Reg.No</th>
                        <th>Student Name</th>
                        <th>Course</th>
                        <th>Batch</th>
                        <th width="60">Sec.</th>
                        <th width="80">Ac.Year</th>
                        <th width="70">Sem.From</th>
                        <th width="70">Sem.To</th>
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
                              {item.degree_name} - {item.course_name}
                            </td>
                            <td>{item.batch}</td>
                            <td>{item.section}</td>
                            <td>{item.college_year}</td>
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
                        type="submit"
                        text="Save Promotion"
                      />
                    </div>
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </Spin>
      </div>
    </>
  );
};

export default withRouter(ClassWisePromotion);
