import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";
import moment from "moment";
import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  customSorting,
  groupByMultiple,
  upperCase,
} from "../../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import {
  listAcademicYears,
  listBatches,
} from "../../../../models/academicYears";
import { CustomDropDown } from "../../components";
import { listAllCourses, loadCourseOptions } from "../../../../models/courses";
import { listsubject } from "../../../../models/hr";
import { COURSE_TYPE_SORT_ORDER } from "../../../../utils/data";

const AddCourse = (props) => {
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

  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [selectedCourse, setSelectedCourse] = useState("");
  useEffect(() => {
    loadAcademics();
    loadSubjects();
  }, []);

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
  const getAcademicYears = () => {
    var optionList = [];
    for (var i = parseInt(moment().format("YYYY")); i >= 2020; i--) {
      var acYear = i.toString() + "-" + (i + 1).toString();
      optionList.push(<option value={acYear}>{acYear}</option>);
    }
    return optionList;
  };
  const loadSubjects = () => {
    listsubject().then((res) => {
      if (res) {
        setsubjectsSource(res.data);
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
    setLoader(true);
    axios
      .post(
        ServiceUrl.SETTINGS.SAVE_COURSE_SUBJECT,
        $("#frm_savecourse").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          setSelectedSubjectId("");
          document.getElementById("frm_savecourse").reset();
          if (props.onSuccess) props.onSuccess();

          toast.success("Course Subject Saved");
        } else {
          toast.error(res["data"].message || "Error");
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

  const handleCoursechange = (e) => {
    setsubjects([]);

    let c = courses.find((item) => item.id == e.target.value);

    if (c) {
      let sub = subjectsSource.filter(
        (item) =>
          item.academic_department == c.academic_department ||
          item.academic_department == ""
      );
      setsubjects(sub);
    }
  };

  const loadSemester = () => {
    let rv = [];
    let m = academics.find((item) => item.batch == selectedAcademic);
    if (!m) return;

    Array.from({ length: m.no_of_semesters }, (v, i) => {
      rv.push(<option value={i + 1}>{i + 1}</option>);
    });
    return rv;
  };

  return (
    <>
      <Spin spinning={loader}>
        <Form
          method="post"
          noValidate
          validated={validated}
          id="frm_savecourse"
          onSubmit={handleFormSubmit}
        >
          <Row className="mt-3">
            <Col md={12}>
              <label>
                Course Type <span className="text-danger">*</span>
              </label>

              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
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
                required
              >
                <option value="">-Select-</option>
                {academicYear.map((item) => (
                  <option value={item.batch}>{item.batch}</option>
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
                name="course_id"
                onChange={handleCoursechange}
                required
              >
                <option value="">-Select-</option>
                {loadCourseOptions(loadPrograms(true))}
                {/*loadPrograms()*/}
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
                //  onChange={e =>setsubjects(e.target.value)}
                required
              >
                <option value="">-Select-</option>
                {subjects.map((item) => (
                  <option value={item.id}>
                    {item.subject_name} - {item.subject_code}
                  </option>
                ))}
                </Form.Control>*/}
              <CustomDropDown
                dataSource={subjects}
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
                  <i className="fa-solid fa-check me-2"></i>Save
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default withRouter(AddCourse);
