import React, { useContext, useEffect, useState } from "react";
import {
  CardFixedTop,
  customSorting,
  groupByMultiple,
  upperCase,
  yearByBatch,
} from "../../../utils";
import PsContext from "../../../context";
import {
  Alert,
  Button,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";

import { toast } from "react-hot-toast";
import { listAllCourses } from "../../../models/courses";
import { listBatches } from "../../../models/academicYears";
import { COURSE_TYPE_SORT_ORDER } from "../../../utils/data";
import { Spin } from "antd";

const CourseDetails = (props) => {
  const context = useContext(PsContext);
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
    <div>
      <Spin spinning={loader}>
        <Row className=" mb-2">
          <Col md={2}>
            <label>
              Batch / Course <span className="text-danger">*</span>
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
                <option value={item[0].type}>{upperCase(item[0].type)}</option>
              ))}
            </Form.Control>
          </Col>
          <Col md={2}>
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
          {/*<Col md={2}>
          <Form.Control
            as="select"
            className="fw-bold form-select form-select-sm"
            name="semester"
            required
          >
            {loadSemester()}
          </Form.Control>
            </Col>*/}
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
        </Row>
      </Spin>
    </div>
  );
};

export default CourseDetails;
