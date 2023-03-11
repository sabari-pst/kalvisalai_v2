import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Dropdown,
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { CardFixedTop, printDocument, upperCase } from "../../../../utils";
import { DegreeType, TABLE_STYLES } from "../../../../utils/data";
import ModuleAccess from "../../../../context/moduleAccess";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";

const ClassWise = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [studentsCount, setStudentsCount] = useState("");

  const [selectedCourse, setSelectedCourse] = useState([]);

  const selectCourseSuccess = (co) => {
    setSelectedCourse(co);
  };

  useEffect(() => {
    if (selectedCourse.course_id) loadData();
  }, [selectedCourse]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    const form = new FormData();
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);

    axios
      .post(ServiceUrl.STUDENTS.ALLOCATED_CLASS_WISE_SUBJECTS, form)
      .then((res) => {
        if (res["data"].status == "1") {
          setDataList(res["data"].data);
          setDataView(res["data"].data);
          setStudentsCount(res["data"].count);
        }
        setLoader(false);
      });
  };

  const getTitle = () => {
    if (selectedCourse && selectedCourse.course_id) {
      return `Class Wise Subject Allocation > ${
        selectedCourse.academic_year
      } > ${selectedCourse.course_name} > ${
        selectedCourse.semester
      } Sem > ${upperCase(selectedCourse.section)}`;
    }
    return "Class Wise Subject Allocation";
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to remove?")) return;
    let dv = [...dataView];
    dv = dv.filter((obj) => obj !== item);
    setDataView(dv);
  };

  const handleSaveClick = () => {
    if (!window.confirm("Do you want to update subject for all students?"))
      return;
    setLoader(true);

    const form = new FormData();
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    form.append("subjects", JSON.stringify(dataView));
    axios
      .post(ServiceUrl.STUDENTS.ALLOCATE_CLASS_WISE_SUBJECTS, form)
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          resetAll();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const resetAll = () => {
    setDataList([]);
    setDataView([]);
    setStudentsCount("");
    setSelectedCourse([]);
  };

  return (
    <>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          <ModuleAccess
            module={"student_sub_alloc_byclass"}
            action={"action_list"}
          >
            <li className="list-inline-item">
              <Link
                to="/app/stu-subjects/classwise-allocation"
                className="btn btn-white border-start ms-2"
              >
                <i className="fa fa-arrow-left fs-5 px-1"></i> Back
              </Link>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={(e) => resetAll()}
              disabled={!selectedCourse.course_id}
            >
              <i className="fa fa-xmark fs-5 px-1"></i> Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container">
        {(!selectedCourse || !selectedCourse.course_id) && (
          <Row className="mt-2">
            <ModuleAccess
              module={"student_sub_alloc_byclass"}
              action={"action_list"}
            >
              <Col md={6}>
                <SelectRecords onSuccess={selectCourseSuccess} withSection />
              </Col>
            </ModuleAccess>
          </Row>
        )}

        {selectedCourse && selectedCourse.course_id && (
          <div className="mt-3">
            <Spin spinning={loader}>
              <Card>
                <Card.Body>
                  <div
                    className="tableFixHead ps-table"
                    style={{ minHeight: "calc(100vh - 250px)" }}
                  >
                    <table width="100%">
                      <thead>
                        <tr>
                          <th width="60">S.No</th>
                          <th width="120">Type</th>
                          <th>Subject Code</th>
                          <th>Subject Name</th>
                          <th width="90">Type</th>
                          <th width="60">Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataView.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item.subject_type}</td>
                              <td>{upperCase(item.subject_code)}</td>
                              <td>{upperCase(item.subject_name)}</td>
                              <td>Part-{item.part}</td>
                              <td align="center">
                                <Button
                                  size="sm"
                                  variant="transparent"
                                  onClick={(e) => handleDelete(item)}
                                >
                                  <i className="fa-solid fa-trash-can fs-6"></i>
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
              <Row className="mt-3">
                <Col md={2}>
                  <InputGroup size="sm">
                    <InputGroup.Text>Total Students</InputGroup.Text>
                    <Form.Control
                      type="text"
                      className="fw-bold"
                      value={studentsCount}
                    />
                  </InputGroup>
                </Col>
                <Col md={10}>
                  <div className="text-end">
                    <LoaderSubmitButton
                      text="Save for all Students"
                      loading={loader}
                      onClick={(e) => handleSaveClick()}
                    />
                  </div>
                </Col>
              </Row>
            </Spin>
          </div>
        )}
      </div>
    </>
  );
};

export default withRouter(ClassWise);
