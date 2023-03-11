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
  ButtonGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  momentDate,
  upperCase,
} from "../../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";

import { NoDataFound } from "../../components";
import ModuleAccess from "../../../../context/moduleAccess";
import { listAllCoursesV2 } from "../../../../models/courses";
import EditCourse from "./editCourse";
import AddCourse from "./addCourse";

const AcademicCourses = (props) => {
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showCourseLink, setShowCourseLink] = useState(false);

  const [activeId, setActiveId] = useState("");

  const [activeDeptType, setActiveDeptType] = useState("");

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  useEffect(() => {
    getReport();
  }, []);

  const resetAll = () => {
    setDataView([]);
    setDataList([]);
    setViewData([]);
  };

  const getReport = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    listAllCoursesV2().then((res) => {
      if (res) {
        setDataList(res);
        setDataView(res);
      }
      setLoader(false);
    });
  };

  const handleDeleteClick = (item) => {
    if (!window.confirm("Do you want to delete?")) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    axios.post(ServiceUrl.ACADEMIC.REMOVE_COURSES, form).then((res) => {
      if (res["data"].status == "1") {
        let m = dataList.filter((obj) => obj.id != item.id);
        setDataList(m);
        setDataView(m);
        toast.success(res["data"].message || "Success");
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleSearch = (e) => {
    let m = dataList.filter(
      (item) => upperCase(item.name).indexOf(upperCase(e.target.value)) > -1
    );

    setDataView(m);
  };

  const handleEdit = (item) => {
    setViewData(item);
    setShowEdit(true);
  };

  const handleCourseLink = (item) => {
    setViewData(item);
    setShowCourseLink(true);
  };

  useEffect(() => {
    let s = dataList;
    if (activeDeptType != "") {
      s = s.filter(
        (item) => upperCase(item.coursetype) == upperCase(activeDeptType)
      );
    }
    setDataView(s);
  }, [activeDeptType]);

  return (
    <>
      <CardFixedTop title="Academic Courses">
        <ul className="list-inline mb-0">
          <ModuleAccess
            module="academics_course_management"
            action="action_create"
          >
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => setShowAdd(true)}
              >
                <i className="fa fa-plus fs-5 px-1"></i> New
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={getReport}
            >
              <i className="fa fa-rotate fs-5 px-1"></i> Refresh
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container">
        <Spin spinning={loader}>
          <Row className="mt-3">
            <Col md={2}>
              <ButtonGroup size="sm">
                <Button
                  variant={
                    activeDeptType == "" ? "secondary" : "outline-secondary"
                  }
                  onClick={(e) => setActiveDeptType("")}
                >
                  ALL
                </Button>
                <Button
                  variant={
                    activeDeptType == "regular"
                      ? "secondary"
                      : "outline-secondary"
                  }
                  onClick={(e) => setActiveDeptType("regular")}
                >
                  AIDED
                </Button>
                <Button
                  variant={
                    activeDeptType == "self" ? "secondary" : "outline-secondary"
                  }
                  onClick={(e) => setActiveDeptType("self")}
                >
                  UN-AIDED
                </Button>
              </ButtonGroup>
            </Col>
            <Col md={4}>
              <InputGroup size="sm">
                <Form.Control
                  size="sm"
                  placeholder="Search by Course Name"
                  onChange={(e) => handleSearch(e)}
                />
                <InputGroup.Text>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </InputGroup.Text>
              </InputGroup>
            </Col>
            <Col md={6}>
              <div className="text-end fs-sm fw-bold">
                Total no of Courses : {dataView.length}
              </div>
            </Col>
            <Col md={12} className="mt-2">
              <Card>
                <Card.Body className="px-0 py-0">
                  <div
                    className="tableFixHead"
                    style={{ maxHeight: "calc(100vh - 150px)" }}
                  >
                    <table className="">
                      <thead>
                        <tr>
                          <th width="60">S.No</th>
                          <th>Type</th>
                          <th>Degree</th>
                          <th>Course Name</th>
                          <th>Short Name</th>
                          <th width="200">Type</th>
                          <th width="100">Att.Hour</th>
                          <th width="90" className="text-center">
                            #
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataView.map((item, i) => {
                          return (
                            <tr
                              key={i}
                              className={
                                item.active_status == "0" ? "text-danger" : ""
                              }
                            >
                              <td>{i + 1}</td>
                              <td>{upperCase(item.academic_dept_type)}</td>
                              <td>{item.degreename}</td>
                              <td>{item.name}</td>
                              <td>{item.shortname}</td>
                              <td>{upperCase(item.coursetype)}</td>
                              <td align="center">{item.att_hour_per_day}</td>
                              <td align="center">
                                <ModuleAccess
                                  module="academics_course_management"
                                  action="action_update"
                                >
                                  <Button
                                    size="sm"
                                    variant="transparent"
                                    title="Edit Group"
                                    onClick={(e) => handleEdit(item)}
                                  >
                                    <i className="fa-solid fa-pen fs-6"></i>
                                  </Button>
                                </ModuleAccess>
                                <ModuleAccess
                                  module="academics_course_management"
                                  action="action_delete"
                                >
                                  <Button
                                    size="sm"
                                    variant="transparent"
                                    title="Remove Group"
                                    onClick={(e) => handleDeleteClick(item)}
                                  >
                                    <i className="fa-solid fa-trash-can fs-6"></i>
                                  </Button>
                                </ModuleAccess>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {!loader && dataView.length < 1 && (
                      <NoDataFound className="my-4" />
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>

      <PsModalWindow
        title="Add Course"
        onHide={(e) => setShowAdd(false)}
        show={showAdd}
        size="md"
      >
        <AddCourse onSuccess={(e) => getReport()} />
      </PsModalWindow>

      <PsModalWindow
        title="Edit Course"
        onHide={(e) => setShowEdit(false)}
        show={showEdit}
        size="md"
      >
        <EditCourse
          dataSource={viewData}
          onSuccess={(e) => {
            setShowEdit(false);
            setViewData([]);
            getReport();
          }}
        />
      </PsModalWindow>
    </>
  );
};

export default withRouter(AcademicCourses);
