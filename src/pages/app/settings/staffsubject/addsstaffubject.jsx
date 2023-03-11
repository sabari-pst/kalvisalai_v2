import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  listAcademicYears,
  listBatches,
} from "../../../../models/academicYears";
import {
  listAllCourses,
  loadDepartmentOptions,
} from "../../../../models/courses";
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
import { liststDepartments } from "../../../../models/hr";
import { COURSE_TYPE_SORT_ORDER } from "../../../../utils/data";
import { CustomDropDown } from "../../components";

const AddStaffSubject = (props) => {
  const context = useContext(PsContext);
  const [stdepartments, setstDepartments] = useState([]);
  const [loader, setLoader] = useState(false);
  const [academics, setAcademics] = useState([]);
  const [selectedAcademic, setSelectedAcademic] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [academicYear, setAcademicYear] = useState([]);
  const [courses, setCourses] = useState([]);
  const [validated, setValidated] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [dataListSub, setDataSub] = useState([]);
  const [dataSubView, setSubView] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);

  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);

  const [staffFromOtherDept, setStaffFromOtherDept] = useState(0);

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  useEffect(() => {
    liststDepartments("1").then((res) => res && setstDepartments(res));
    getReport();
    loadAcademics();
    getSubject();
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
        ServiceUrl.SETTINGS.SAVE_STAFFSUBJECT,
        $("#frm_staffsavesubject").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          document.getElementById("frm_staffsavesubject").reset();
          if (props.onSuccess) props.onSuccess();

          toast.success("Staff Subject Saved");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };
  const loadPrograms = () => {
    let m = courses.filter(
      (item) => upperCase(item.type) == upperCase(selectedType)
    );

    return m.map((item) => (
      <option value={item.id}>
        {item.degreename} - {item.name} (
        {upperCase(item.coursetype) == "SELF" ? "SF" : "R"})
      </option>
    ));
  };
  const getReport = () => {
    setLoader(true);
    setStaffList([]);
    setStaffList([]);

    axios
      .get(
        ServiceUrl.HR.LIST_EMPLOYEES + "?status=1&academic_department=NOT_NULL"
      )
      .then((res) => {
        if (res["data"].status == "1") {
          setStaffList(res["data"].data);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
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
  const getSubject = () => {
    setLoader(true);
    setDataSub([]);
    setSubView([]);

    axios.get(ServiceUrl.SETTINGS.LIST_SUBJECT).then((res) => {
      if (res["data"].status == "1") {
        setDataSub(res["data"].data);

        setSubView(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
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

  const [selectedStaff, setSelectedStaff] = useState("");

  const courseTypeChange = (e) => {
    let m = academics.filter(
      (item) => upperCase(item.type) == upperCase(e.target.value)
    );
    setAcademicYear(m);
    setSelectedType(e.target.value);
  };

  const handleDepartmentChange = (departmentId) => {
    let m = staffList.filter(
      (item) => item.emp_academic_department == departmentId
    );
    setFilteredStaff(m);
    setSelectedStaff("");
  };

  const staffSubjects = () => {
    let staff = staffList.find((item) => item.id == selectedStaffId);

    if (staff)
      return dataListSub.filter(
        (item) =>
          item.academic_department == staff.emp_academic_department ||
          item.academic_department == ""
      );

    return [];
  };

  return (
    <>
      <Spin spinning={loader}>
        <Form
          method="post"
          noValidate
          validated={validated}
          id="frm_staffsavesubject"
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
            <Col md={12}>
              <label>
                Department<span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                name="academic_department"
                size="sm"
                className="fw-bold form-select form-select-sm"
                onChange={(e) => handleDepartmentChange(e.target.value)}
                required
              >
                <option value="">-</option>
                {loadDepartmentOptions(stdepartments)}
              </Form.Control>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={12}>
              <label>
                Staff name<span className="text-danger">*</span>
              </label>
              <CustomDropDown
                dataSource={
                  staffFromOtherDept == "1" ? staffList : filteredStaff
                }
                valueField="id"
                value={selectedStaffId}
                placeholder={"Select Staff"}
                displayField={(item) =>
                  `${upperCase(item.emp_name)} - (${upperCase(
                    item.emp_academic_department_name
                  )})`
                }
                onChange={(v) => setSelectedStaffId(v)}
              />
              <input type="hidden" name="staff_id" value={selectedStaffId} />
              {/*staffFromOtherDept == "1" ? (
                <Form.Control
                  as="select"
                  name="staff_id"
                  size="sm"
                  className="fw-bold form-select form-select-sm"
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {staffList.map((item) => (
                    <option value={item.id}>{item.emp_name}</option>
                  ))}
                </Form.Control>
              ) : (
                <Form.Control
                  as="select"
                  name="staff_id"
                  size="sm"
                  className="fw-bold form-select form-select-sm"
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {filteredStaff.map((item) => (
                    <option value={item.id}>{item.emp_name}</option>
                  ))}
                </Form.Control>
                  )*/}
            </Col>
            <Col md={12}>
              <Form.Check
                type="checkbox"
                size="sm"
                label="Load staff from other department"
                onChange={(e) =>
                  setStaffFromOtherDept(e.target.checked ? "1" : "0")
                }
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={12}>
              <label>
                Subject<span className="text-danger">*</span>
              </label>
              {/*<Form.Control
                as="select"
                name="subject_id"
                size="sm"
                className="fw-bold form-select form-select-sm"
                required
              >
                <option value="">Select</option>
                {staffSubjects().map((item, i) => {
                  return <option value={item.id}>{item.subject_name}</option>;
                })}
              </Form.Control>*/}
              <CustomDropDown
                dataSource={staffSubjects()}
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

export default withRouter(AddStaffSubject);
