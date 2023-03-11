import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import {
  listAcademicYears,
  listBatches,
} from "../../../../models/academicYears";
import { listAllCourses, loadCourseOptions } from "../../../../models/courses";
import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";
import moment from "moment";
import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  upperCase,
  groupByMultiple,
  customSorting,
} from "../../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { listsubject } from "../../../../models/hr";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { COURSE_TYPE_SORT_ORDER } from "../../../../utils/data";
import { CustomDropDown } from "../../components";

const EditCourse = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [academics, setAcademics] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedAcademic, setSelectedAcademic] = useState("");
  const [subjectsSource, setsubjectsSource] = useState([]);
  const [subjects, setsubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    props.dataSource.subject_id
  );

  useEffect(() => {
    loadAcademics();
    loadSubjects();
  }, []);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setLoader(true);
    axios
      .post(
        ServiceUrl.SETTINGS.UPDATE_COURSE_SUBJECT,
        $("#frm_Updatesubject").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          if (props.onSuccess) props.onSuccess(res["data"].data);

          toast.success("Course Subject Updated");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };
  const loadPrograms = (ar = false) => {
    let m = courses.filter(
      (item) => upperCase(item.academic_dept_type) == upperCase(selectedType)
    );

    if (ar) return m;

    return m.map((item) => (
      <option value={item.id}>
        {item.degreename} - {item.name} (
        {upperCase(item.coursetype) == "SELF" ? "SF" : "R"})
      </option>
    ));
  };

  const loadsubjectoption = () => {
    return subjects.map((item) => (
      <option value={item.id}>{item.subject_name}</option>
    ));
  };

  const loadSubjects = () => {
    listsubject().then((res) => {
      if (res) {
        setsubjectsSource(res.data);
        setSelectedCourseId(field("course_id"));
      }
      setLoader(false);
    });
  };

  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
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
        let m = res.filter(
          (item) => upperCase(item.type) == upperCase(field("course_type"))
        );

        // setAcademicYear(m);
        setAcademicYear(m);
        setSelectedAcademic(field("academic_year"));
        setSelectedType(field("course_type"));

        //load corresponding courses for the type
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

  const loadSemester = () => {
    let rv = [];
    let m = academics.find((item) => item.batch == selectedAcademic);
    if (!m) return;
    Array.from({ length: m.no_of_semesters }, (v, i) => {
      rv.push(
        <option
          value={i + 1}
          selected={i + 1 == field("semester") ? "selected" : ""}
        >
          {i + 1}
        </option>
      );
    });
    return rv;
  };
  const courseTypeChange = (value) => {
    let m = academics.filter(
      (item) => upperCase(item.type) == upperCase(value)
    );
    setAcademicYear(m);
    setSelectedType(value);
  };

  const getCourses = () => {
    let m = courses.filter(
      (item) => upperCase(item.academic_dept_type) == upperCase(selectedType)
    );
    return m;
  };
  const getSubjects = () => {
    let c = courses.find((item) => item.id == selectedCourseId);

    if (c) {
      let sub = subjectsSource.filter(
        (item) =>
          item.academic_department == c.academic_department ||
          item.academic_department == ""
      );

      return sub;
    }
    return [];
  };

  return (
    <>
      <Spin spinning={loader}>
        <Form
          method="post"
          noValidate
          validated={validated}
          id="frm_Updatesubject"
          onSubmit={handleFormSubmit}
        >
          <input type="hidden" name="id" value={field("id")} />

          <Row className="">
            <Col md={12}>
              <label>
                Course Type <span className="text-danger">*</span>
              </label>

              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                onChange={(e) => courseTypeChange(e.target.value)}
                name="course_type"
                required
              >
                {courseTypes.map((item) => (
                  <option
                    value={item[0].type}
                    selected={
                      item[0].type == field("course_type") ? "selected" : ""
                    }
                  >
                    {upperCase(item[0].type)}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}>
              <label>
                Academic Year <span className="text-danger">*</span>
              </label>

              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                onChange={(e) => setSelectedAcademic(e.target.value)}
                name="academic_year"
                defaultValue={field("academic_year")}
                required
              >
                <option value="">-Select-</option>
                {academicYear &&
                  academicYear.map((item) => (
                    <option
                      value={item.batch}
                      selected={
                        item.batch == field("academic_year") ? "selected" : ""
                      }
                    >
                      {item.batch}
                    </option>
                  ))}
              </Form.Control>
            </Col>

            <Col md={6}>
              <label>
                Semester <span className="text-danger">*</span>
              </label>

              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                name="semester"
                defaultValue={field("semester")}
                required
              >
                {loadSemester()}
              </Form.Control>
            </Col>
          </Row>
          <Row className="mt-3">
            <label>
              Course Name<span className="text-danger">*</span>
            </label>

            <Col md={12}>
              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                defaultValue={field("course_id")}
                name="course_id"
                onChange={(e) => setSelectedCourseId(e.target.value)}
                //    onChange={e => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">-Select-</option>
                {loadCourseOptions(
                  getCourses(),
                  "dept_type",
                  field("course_id")
                )}
                {/*getCourses().map((item) => (
                  <option
                    value={item.id}
                    selected={item.id == field("course_id") ? "selected" : ""}
                  >
                    {item.degreename} - {item.name} (
                    {upperCase(item.coursetype) == "SELF" ? "SF" : "R"}){" "}
                  </option>
                    ))*/}
              </Form.Control>
            </Col>
          </Row>
          <Row className="mt-3">
            <label>
              Subject Name<span className="text-danger">*</span>
            </label>

            <Col md={12}>
              {/*<Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                name="subject_id"
                required
              >
                <option value="">-Select-</option>
                {getSubjects().map((item) => (
                  <option
                    value={item.id}
                    selected={item.id == field("subject_id") ? "selected" : ""}
                  >
                    {" "}
                    {item.subject_name}
                  </option>
                ))}
                </Form.Control>*/}
              <CustomDropDown
                dataSource={getSubjects()}
                valueField="id"
                value={selectedSubjectId}
                placeholder={"Select Subject"}
                displayField={(item) =>
                  `${upperCase(item.subject_code)} - ${upperCase(
                    item.subject_name
                  )}`
                }
                onChange={(v) => setSelectedSubjectId(v)}
              />
              <input
                type="hidden"
                name="subject_id"
                value={selectedSubjectId}
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <div className="text-end">
                <Button type="submit" size="sm">
                  <i className="fa-solid fa-check me-2"></i> Update
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default withRouter(EditCourse);
