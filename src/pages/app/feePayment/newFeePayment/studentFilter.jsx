import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import { Spin, Select } from "antd";
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
  lowerCase,
  upperCase,
  yearByBatch,
} from "../../../../utils";
import { listAllCourses } from "../../../../models/courses";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { COURSE_TYPE_SORT_ORDER } from "../../../../utils/data";

const { Option } = Select;

const StudentFilter = (props) => {
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

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!selectedStudent) {
      toast.error("Select a student");
      return;
    }

    let v = formToObject(form);

    let s = dataList.find((item) => item.id == selectedStudent);
    if (!s) {
      toast.error("Error on gettin student infor");
      return;
    }

    if (props.onSuccess) props.onSuccess(s);
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

  const gtCourseName = () => {
    let m = courses.find((item) => item.id == selectedCourse);
    if (m) {
      let t = upperCase(m.coursetype) == "SELF" ? "SF" : "R";
      return m.degreename + " - " + m.name + " (" + t + ")";
    }
  };

  const loadStudents = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    let form = document.getElementById("frm_SearchCourseStudent"); //.serializeArray();
    //let v = formToObject(form);
    form = new FormData(form);
    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        setDataView(res["data"].data);
      } else {
        //toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const goNextBtnClick = () => {
    let form = document.getElementById("frm_SearchCourseStudent"); //.serializeArray();
    let v = formToObject(form);

    if (props.onSuccess) props.onSuccess(v);
  };

  return (
    <>
      <Spin spinning={loader}>
        <Card>
          <Card.Header className="fw-bold">Select Student</Card.Header>
          <Card.Body>
            <Form
              noValidate
              validated={validated}
              action=""
              method="post"
              id="frm_SearchCourseStudent"
              onSubmit={handleFormSubmit}
            >
              <input type="hidden" name="course_name" value={gtCourseName()} />

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
                    onChange={(e) => {
                      courseTypeChange(e);
                      setSelectedCourse("");
                      setSelectedStudent("");
                    }}
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
                    onChange={(e) => {
                      setSelectedAcademic(e.target.value);
                      setSelectedCourse("");
                      setSelectedStudent("");
                    }}
                    name="batch"
                    required
                  >
                    <option value="">-Select-</option>
                    {academicYear.map((item) => (
                      <option value={item.batch}>
                        {yearByBatch(item.batch)} {item.batch}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
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
                    name="course"
                    onChange={(e) => {
                      setSelectedCourse(e.target.value);
                      setSelectedStudent("");
                      loadStudents();
                    }}
                    value={selectedCourse}
                    required
                  >
                    <option value="">-Select-</option>
                    {loadPrograms()}
                  </Form.Control>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={4}>
                  <label>
                    Student <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={8}>
                  <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      lowerCase(option.children).includes(lowerCase(input))
                    }
                    style={{ width: "100%" }}
                    className="fw-bold"
                    value={selectedStudent}
                    onChange={(value) => setSelectedStudent(value)}
                  >
                    {dataView.map((item) => (
                      <Option value={item.id}>{`${
                        item.registerno || item.admissionno
                      }-${upperCase(item.name)}`}</Option>
                    ))}
                  </Select>
                </Col>
              </Row>

              {/*<Row className="mt-3">
							<Col md={12}>
								<div className='text-end'>

									<LoaderSubmitButton
										text="Search"
									/>
								</div>
							</Col>
						</Row>*/}

              <Row className="mt-3">
                <Col md={12}>
                  <div className="text-end">
                    <Button type="submit" size="sm">
                      {props.buttonText || "Go Next"}
                    </Button>
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

export default StudentFilter;
