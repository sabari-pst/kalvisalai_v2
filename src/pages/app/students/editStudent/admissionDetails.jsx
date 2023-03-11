import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import { Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { listBatches } from "../../../../models/academicYears";
import {
  customSorting,
  groupByMultiple,
  lowerCase,
  momentDate,
  upperCase,
  yearByBatch,
} from "../../../../utils";
import { COURSE_TYPE_SORT_ORDER } from "../../../../utils/data";
import { listAllCourses } from "../../../../models/courses";
import { Spin } from "antd";

const AdmissionDetails = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [academics, setAcademics] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [courses, setCourses] = useState([]);

  const [courseModified, setCourseModified] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const [selectedAcademic, setSelectedAcademic] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    loadAcademics();
  }, []);

  const loadAcademics = () => {
    setLoader(true);

    listBatches("1").then((res) => {
      if (res) {
        res = customSorting(res, COURSE_TYPE_SORT_ORDER, "type");

        let d = groupByMultiple(res, function (obj) {
          return [obj.type];
        });
        setAcademics(res);
        setCourseTypes(d);
        setSelectedType(field("coursetype"));
        courseTypeChange(field("coursetype"));
        setSelectedAcademic(field("batch"));
      }
      setLoader(false);
    });

    setLoader(true);
    listAllCourses().then((res) => {
      if (res) {
        setCourses(res);
      }
      setLoader(false);
    });
  };

  const courseTypeChange = (v) => {
    let m = academics.filter((item) => upperCase(item.type) == upperCase(v));
    setAcademicYear(m);
    setSelectedType(v);
  };

  const loadSemester = (selectedSem = false) => {
    let rv = [];
    let m = academics.find((item) => item.batch == selectedAcademic);
    if (!m) return;
    let no_of_semesters = m.no_of_semesters;
    let yearValue = yearByBatch(m.batch);

    if (upperCase(yearValue) == "I-YEAR") {
      Array.from({ length: 2 }, (v, i) => {
        rv.push(
          <option
            value={i + 1}
            selected={i + 1 == selectedSem ? "selected" : ""}
          >
            {i + 1} - SEM
          </option>
        );
      });
    } else if (upperCase(yearValue) == "II-YEAR") {
      rv.push(
        <option value={3} selected={3 == selectedSem ? "selected" : ""}>
          3 - SEM
        </option>
      );
      rv.push(
        <option value={4} selected={4 == selectedSem ? "selected" : ""}>
          4 - SEM
        </option>
      );
    } else if (upperCase(yearValue) == "III-YEAR") {
      rv.push(
        <option value={5} selected={5 == selectedSem ? "selected" : ""}>
          5 - SEM
        </option>
      );
      rv.push(
        <option value={6} selected={6 == selectedSem ? "selected" : ""}>
          6 - SEM
        </option>
      );
    } else {
      Array.from({ length: m.no_of_semesters }, (v, i) => {
        rv.push(
          <option
            value={i + 1}
            selected={i + 1 == selectedSem ? "selected" : ""}
          >
            {i + 1}
          </option>
        );
      });
    }
    return rv;
  };

  const loadPrograms = (courseId = false) => {
    let m = courses.filter(
      (item) => upperCase(item.academic_dept_type) == upperCase(selectedType)
    );

    return m.map((item) => (
      <option value={item.id} selected={item.id == courseId ? "selected" : ""}>
        {item.degreename} - {item.name} (
        {upperCase(item.coursetype) == "SELF" ? "SF" : "R"})
      </option>
    ));
  };

  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
  };

  return (
    <Spin spinning={loader}>
      <input
        type="hidden"
        name="edit_course_info"
        value={
          context.allowedAccess("stu_edit_course_informations", "action_update")
            ? "1"
            : "0"
        }
      />
      <input
        type="hidden"
        name="course_modified"
        value={courseModified ? "1" : "0"}
      />
      <input type="hidden" name="college_year" value={field("college_year")} />
      <Card>
        <Card.Header className="fw-bold">Admission Details</Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <label>
                Admission Type <span className="text-danger">*</span>
              </label>
            </Col>
            <Col md={5}>
              <Form.Control
                as="select"
                size="sm"
                className="fw-bold text-uppercase form-select form-select-sm"
                name="quota"
                defaultValue={field("quota")}
                required
              >
                <option value="gq">Government Quota</option>
                <option value="mq">Management Quota</option>
              </Form.Control>
            </Col>
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroup.Text>Medium of Inst.</InputGroup.Text>
                <Form.Control
                  as="select"
                  size="sm"
                  className="fw-bold text-uppercase form-select form-select-sm"
                  name="medium_of_instruction"
                  defaultValue={field("medium_of_instruction")}
                  required
                >
                  <option value="english">English</option>
                  <option value="tamil">Tamil</option>
                </Form.Control>
              </InputGroup>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Application No & Date <span className="text-danger"></span>
              </label>
            </Col>
            <Col md={5}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold text-uppercase"
                name="application_no"
                placeholder="Application No"
                defaultValue={field("application_no")}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="date"
                size="sm"
                className="fw-bold text-uppercase"
                name="application_date"
                placeholder="Application Date"
                defaultValue={field("application_date")}
                max={momentDate(new Date(), "YYYY-MM-DD")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Admission No & Date <span className="text-danger">*</span>
              </label>
            </Col>
            <Col md={5}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold text-uppercase"
                name="admissionno"
                defaultValue={field("admissionno")}
                placeholder="Admission No"
                required
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="date"
                size="sm"
                className="fw-bold text-uppercase"
                name="admissiondate"
                defaultValue={field("admissiondate")}
                placeholder="Admission Date"
                required
              />
            </Col>
          </Row>

          {context.allowedAccess(
            "stu_edit_course_informations",
            "action_update"
          ) && (
            <Row className="mt-2">
              <Col md={3}></Col>
              <Col md={2}>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={(e) => {
                    setCourseModified(!courseModified);
                    courseTypeChange(field("coursetype"));
                  }}
                >
                  <i className="fa-regular fa-pen-to-square me-1"></i> Edit
                  Course Details
                </Button>
              </Col>
            </Row>
          )}

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Batch & Semester <span className="text-danger">*</span>
              </label>
            </Col>
            <Col md={2}>
              {courseModified ? (
                <Form.Control
                  as="select"
                  className="fw-bold form-select form-select-sm"
                  onChange={(e) => courseTypeChange(e)}
                  name="coursetype"
                  required
                >
                  <option value="">-Select-</option>
                  {courseTypes.map((item) => (
                    <option
                      value={item[0].type}
                      selected={
                        item[0].type == lowerCase(field("coursetype"))
                          ? "selected"
                          : ""
                      }
                    >
                      {upperCase(item[0].type)}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                <Form.Control
                  type="text"
                  className="fw-bold bg-silver-100"
                  name="coursetype"
                  size="sm"
                  value={upperCase(field("coursetype"))}
                  readOnly
                />
              )}
            </Col>
            <Col md={3}>
              {courseModified ? (
                <Form.Control
                  as="select"
                  className="fw-bold form-select form-select-sm"
                  onChange={(e) => setSelectedAcademic(e.target.value)}
                  name="batch"
                  required
                >
                  <option value="">-Select-</option>
                  {academicYear.map((item) => (
                    <option
                      value={item.batch}
                      selected={item.batch == field("batch") ? "selected" : ""}
                    >
                      {yearByBatch(item.batch, item.no_of_semesters)}{" "}
                      {item.batch}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                <Form.Control
                  type="text"
                  className="fw-bold bg-silver-100"
                  name="batch"
                  size="sm"
                  readOnly
                  value={upperCase(field("batch"))}
                />
              )}
            </Col>
            <Col md={4}>
              {courseModified ? (
                <Form.Control
                  as="select"
                  className="fw-bold form-select form-select-sm"
                  name="semester"
                  required
                >
                  {loadSemester(field("semester"))}
                </Form.Control>
              ) : (
                <Form.Control
                  type="text"
                  className="fw-bold bg-silver-100"
                  name="semester"
                  size="sm"
                  value={upperCase(field("semester"))}
                  readOnly
                />
              )}
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Course & Section<span className="text-danger">*</span>
              </label>
            </Col>
            <Col md={5}>
              {courseModified ? (
                <Form.Control
                  as="select"
                  className="fw-bold form-select form-select-sm"
                  name="course"
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                >
                  <option value="">-Select-</option>
                  {loadPrograms(field("course"))}
                </Form.Control>
              ) : (
                <Form.Control
                  type="text"
                  className="fw-bold bg-silver-100"
                  name="course"
                  size="sm"
                  value={
                    upperCase(field("degree_name")) +
                    "-" +
                    upperCase(field("course_name"))
                  }
                  readOnly
                />
              )}
            </Col>
            <Col md={4}>
              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                name="section"
                required
              >
                <option
                  value="a"
                  selected={
                    upperCase("a") == upperCase(field("section"))
                      ? "selected"
                      : ""
                  }
                >
                  A
                </option>
                <option
                  value="b"
                  selected={
                    upperCase("b") == upperCase(field("section"))
                      ? "selected"
                      : ""
                  }
                >
                  B
                </option>
                <option
                  value="c"
                  selected={
                    upperCase("c") == upperCase(field("section"))
                      ? "selected"
                      : ""
                  }
                >
                  C
                </option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Register No & Roll No <span className="text-danger"></span>
              </label>
            </Col>
            <Col md={5}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold text-uppercase"
                name="registerno"
                placeholder="Register No"
                defaultValue={field("registerno")}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold text-uppercase"
                name="rollno"
                placeholder="Roll No"
                defaultValue={field("rollno")}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Spin>
  );
};

export default withRouter(AdmissionDetails);
