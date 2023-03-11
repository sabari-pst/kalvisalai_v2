import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import { Row, Col, Card, Form, InputGroup } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { listBatches } from "../../../../models/academicYears";
import {
  customSorting,
  groupByMultiple,
  momentDate,
  upperCase,
  yearByBatch,
} from "../../../../utils";
import { COURSE_TYPE_SORT_ORDER } from "../../../../utils/data";
import { listAllCourses } from "../../../../models/courses";

const AdmissionDetails = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [academics, setAcademics] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [courses, setCourses] = useState([]);

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

  const courseTypeChange = (e) => {
    let m = academics.filter(
      (item) => upperCase(item.type) == upperCase(e.target.value)
    );
    setAcademicYear(m);
    setSelectedType(e.target.value);
  };

  const loadSemester = () => {
    let rv = [];
    let m = academics.find((item) => item.batch == selectedAcademic);
    if (!m) return;
    let no_of_semesters = m.no_of_semesters;
    let yearValue = yearByBatch(m.batch);

    if (upperCase(yearValue) == "I-YEAR") {
      Array.from({ length: 2 }, (v, i) => {
        rv.push(<option value={i + 1}>{i + 1} - SEM</option>);
      });
    } else if (upperCase(yearValue) == "II-YEAR") {
      rv.push(<option value={3}>3 - SEM</option>);
      rv.push(<option value={4}>4 - SEM</option>);
    } else if (upperCase(yearValue) == "III-YEAR") {
      rv.push(<option value={5}>5 - SEM</option>);
      rv.push(<option value={6}>6 - SEM</option>);
    } else {
      Array.from({ length: m.no_of_semesters }, (v, i) => {
        rv.push(<option value={i + 1}>{i + 1}</option>);
      });
    }
    return rv;
  };

  const loadPrograms = () => {
    let m = courses.filter(
      (item) => upperCase(item.academic_dept_type) == upperCase(selectedType)
    );
    m = customSorting(m, ["regular", "self"], "coursetype");
    m = groupByMultiple(m, function (obj) {
      return [obj.coursetype];
    });
    return m.map((items) => (
      <optgroup label={upperCase(items[0].coursetype)}>
        {courseItem(items)}
      </optgroup>
    ));
  };

  const courseItem = (items) => {
    return items.map((item) => {
      return (
        <option value={item.id}>
          {item.degreename} - {item.name} (
          {upperCase(item.coursetype) == "SELF" ? "SF" : "R"})
        </option>
      );
    });
  };

  return (
    <>
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
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="date"
                size="sm"
                className="fw-bold text-uppercase"
                name="application_date"
                placeholder="Application Date"
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
                placeholder="Admission Date"
                max={momentDate(new Date(), "YYYY-MM-DD")}
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Batch & Semester <span className="text-danger">*</span>
              </label>
            </Col>
            <Col md={2}>
              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                onChange={(e) => courseTypeChange(e)}
                name="coursetype"
                required
              >
                <option value="">-Select-</option>
                {courseTypes.map((item) => (
                  <option value={item[0].type}>
                    {upperCase(item[0].type)}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={3}>
              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                onChange={(e) => setSelectedAcademic(e.target.value)}
                name="batch"
                required
              >
                <option value="">-Select-</option>
                {academicYear.map((item) => (
                  <option value={item.batch}>
                    {yearByBatch(item.batch, item.no_of_semesters)} {item.batch}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={4}>
              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                name="semester"
                required
              >
                {loadSemester()}
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Course & Section<span className="text-danger">*</span>
              </label>
            </Col>
            <Col md={5}>
              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                name="course"
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">-Select-</option>
                {loadPrograms()}
              </Form.Control>
            </Col>
            <Col md={4}>
              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                name="section"
                required
              >
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
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
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold text-uppercase"
                name="rollno"
                placeholder="Roll No"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default withRouter(AdmissionDetails);
