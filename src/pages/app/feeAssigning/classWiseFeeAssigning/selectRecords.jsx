import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import { Spin } from "antd";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import {
  listAcademicYears,
  listBatches,
} from "../../../../models/academicYears";
import {
  customSorting,
  formToObject,
  groupByMultiple,
  upperCase,
  yearByBatch,
} from "../../../../utils";
import { listAllCourses } from "../../../../models/courses";
import { COURSE_TYPE_SORT_ORDER } from "../../../../utils/data";
import { listFeeGroups } from "../../../../models/fees";

const SelectRecords = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showAllSem, setShowAllSem] = useState(false);

  const [academics, setAcademics] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedAcademic, setSelectedAcademic] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourseInfo, setSelectedCourseInfo] = useState([]);

  const [feeGroups, setFeeGroups] = useState([]);
  const [selectedFeeGroupId, setSelectedFeeGroupId] = useState("");

  useEffect(() => {
    loadAcademics();
    if (props.feeGroup) loadFeeGroups();
  }, []);

  const loadFeeGroups = () => {
    setLoader(true);
    listFeeGroups("1").then((res) => {
      if (res) {
        setSelectedFeeGroupId(res[0].id);
        setFeeGroups(res);
      }
      setLoader(false);
    });
  };

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    let v = formToObject(form);

    if (props.onSuccess) props.onSuccess(v);
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
        rv.push(<option value={i + 1}>{i + 1}</option>);
      });
    } else if (upperCase(yearValue) == "II-YEAR") {
      if (showAllSem) {
        rv.push(<option value={1}>1</option>);
        rv.push(<option value={2}>2</option>);
      }
      rv.push(<option value={3}>3</option>);
      rv.push(<option value={4}>4</option>);
    } else if (upperCase(yearValue) == "III-YEAR") {
      if (showAllSem) {
        rv.push(<option value={1}>1</option>);
        rv.push(<option value={2}>2</option>);
        rv.push(<option value={3}>3</option>);
        rv.push(<option value={4}>4</option>);
      }
      rv.push(<option value={5}>5</option>);
      rv.push(<option value={6}>6</option>);
    } else {
      Array.from({ length: m.no_of_semesters }, (v, i) => {
        rv.push(<option value={i + 1}>{i + 1}</option>);
      });
    }
    return rv;
  };

  const loadPrograms = (rawData = false) => {
    let m = courses.filter(
      (item) => upperCase(item.academic_dept_type) == upperCase(selectedType)
    );

    if (rawData) return m;

    m = customSorting(m, ["aided", "unaided"], "dept_type");
    m = groupByMultiple(m, function (obj) {
      return [obj.coursetype];
    });
    return m.map((items) => (
      <optgroup label={upperCase(items[0].coursetype)}>
        {courseItem(items)}
      </optgroup>
    ));
  };

  const loadCourseType = () => {
    let m = courses.filter(
      (item) => upperCase(item.academic_dept_type) == upperCase(selectedType)
    );

    m = customSorting(m, ["aided", "unaided"], "dept_type");
    m = groupByMultiple(m, function (obj) {
      return [obj.dept_type];
    });

    return m.map((item) => (
      <option value={item[0].dept_type}>{upperCase(item[0].dept_type)}</option>
    ));
  };

  const courseItem = (items) => {
    return items.map((item) => {
      return (
        <option value={item.id}>
          {item.degreename} - {item.name} (
          {upperCase(item.dept_type) == "UNAIDED" ? "SF" : "R"})
        </option>
      );
    });
  };

  const gtCourseName = () => {
    let m = courses.find((item) => item.id == selectedCourse);
    if (m) {
      let t = upperCase(m.dept_type) == "UNAIDED" ? "SF" : "R";
      return m.degreename + " - " + m.name + " (" + t + ")";
    }
  };

  const getAcademicDepartment = () => {
    let m = courses.find((item) => item.id == selectedCourse);
    if (m) {
      return m.academic_department;
    }
  };

  const feeGroupField = (fieldName) => {
    let s = feeGroups.find((item) => item.id == selectedFeeGroupId);
    if (s && s[fieldName]) return s[fieldName];
  };

  const handleCourseChange = (e) => {
    let cId = e.target.value;
    setSelectedCourse(cId);

    let m = courses.find((item) => item.id == cId);

    if (m) setSelectedCourseInfo(m);
  };

  return (
    <>
      <Spin spinning={loader}>
        <Card>
          <Card.Header className="fw-bold">Select Course</Card.Header>
          <Card.Body>
            <Form
              noValidate
              validated={validated}
              action=""
              method="post"
              id="frm_SearchCourse"
              onSubmit={handleFormSubmit}
            >
              <input type="hidden" name="course_name" value={gtCourseName()} />
              <input
                type="hidden"
                name="course_details"
                value={JSON.stringify(selectedCourseInfo)}
              />
              <input
                type="hidden"
                name="academic_department"
                value={getAcademicDepartment()}
              />
              <input
                type="hidden"
                name="fee_group_name"
                value={feeGroupField("fee_group_name")}
              />
              <input
                type="hidden"
                name="fee_category_id_list"
                value={feeGroupField("fee_category_id_list")}
              />

              <Row className="mt-3">
                <Col md={4}>
                  <label>
                    Course Type <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={8}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-md"
                    onChange={(e) => courseTypeChange(e)}
                    name="course_type"
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
              </Row>

              {props.withProgramType && (
                <Row className="mt-3">
                  <Col md={4}>
                    <label>
                      Program Type <span className="text-danger">*</span>
                    </label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      as="select"
                      className="fw-bold form-select form-select-md"
                      name="program_type"
                      required
                    >
                      {loadCourseType()}
                    </Form.Control>
                  </Col>
                </Row>
              )}

              {!props.wihtOutBatch && (
                <Row className="mt-3">
                  <Col md={4}>
                    <label>
                      Academic Year <span className="text-danger">*</span>
                    </label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      as="select"
                      className="fw-bold form-select form-select-md"
                      onChange={(e) => setSelectedAcademic(e.target.value)}
                      name="academic_year"
                      required
                    >
                      <option value="">-Select-</option>
                      {academicYear.map((item) => (
                        <option value={item.batch}>
                          {yearByBatch(item.batch, item.no_of_semesters)}{" "}
                          {item.batch}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
              )}

              {props.withSemester != false && (
                <Row className="mt-3">
                  <Col md={4}>
                    <label>
                      Semester <span className="text-danger">*</span>
                    </label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      as="select"
                      className="fw-bold form-select form-select-md"
                      name="semester"
                      required
                    >
                      {loadSemester()}
                    </Form.Control>
                    {props.withAllSem && (
                      <Form.Check
                        type="checkbox"
                        label="Show All Semester"
                        checked={showAllSem}
                        onChange={(e) => setShowAllSem(!showAllSem)}
                      />
                    )}
                  </Col>
                </Row>
              )}

              {!props.wihtOutProgram && (
                <Row className="mt-3">
                  <Col md={4}>
                    <label>
                      Program <span className="text-danger">*</span>
                    </label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      as="select"
                      className="fw-bold form-select form-select-md"
                      name="course_id"
                      onChange={(e) => handleCourseChange(e)}
                      required
                    >
                      <option value="">-Select-</option>
                      {loadPrograms()}
                    </Form.Control>
                  </Col>
                </Row>
              )}

              <input
                type="hidden"
                name="courses"
                value={JSON.stringify(loadPrograms(true))}
              />

              {props.withSection && (
                <Row className="mt-3">
                  <Col md={4}>
                    <label>
                      Section <span className="text-danger">*</span>
                    </label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      as="select"
                      className="fw-bold form-select form-select-md"
                      name="section"
                      required
                    >
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="c">C</option>
                    </Form.Control>
                  </Col>
                </Row>
              )}

              {props.feeGroup && (
                <Row className="mt-3">
                  <Col md={4}>
                    <label>
                      Fee Group <span className="text-danger">*</span>
                    </label>
                  </Col>
                  <Col md={8}>
                    <Form.Control
                      as="select"
                      className="fw-bold form-select form-select-md"
                      name="fee_group_id"
                      onChange={(e) => setSelectedFeeGroupId(e.target.value)}
                      required
                    >
                      {feeGroups.map((item) => (
                        <option value={item.id}>{item.fee_group_name}</option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
              )}

              <Row className="mt-3">
                <Col md={12}>
                  <div className="text-end">
                    <LoaderSubmitButton
                      text={
                        <>
                          <i className="fa-sharp fa-solid fa-magnifying-glass me-2"></i>{" "}
                          Search
                        </>
                      }
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Spin>
    </>
  );
};

export default SelectRecords;
