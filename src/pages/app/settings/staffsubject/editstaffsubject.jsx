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

const EditStaffSubject = (props) => {
  const [stdepartments, setstDepartments] = useState([]);
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [dataListSub, setDataSub] = useState([]);
  const [dataSubView, setSubView] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedAcademic, setSelectedAcademic] = useState("");
  const [subjects, setsubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [academics, setAcademics] = useState([]);

  const [courseTypes, setCourseTypes] = useState([]);

  const [staffFromOtherDept, setStaffFromOtherDept] = useState(0);

  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [selectedStaffId, setSelectedStaffId] = useState(
    props.dataSource?.staff_id
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    props.dataSource?.subject_id
  );

  useEffect(() => {
    liststDepartments("1").then((res) => res && setstDepartments(res));
    getReport();
    loadAcademics();
    getSubject();
    setSelectedStaffId(props.dataSource.staff_id);
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
        ServiceUrl.SETTINGS.UPDATE_STAFFSUBJECT,
        $("#frm_Updatestaffsubject").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          if (props.onSuccess) props.onSuccess(res["data"].data);

          toast.success("Staff Subject Updated");
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
    setDataList([]);
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

  const getSubject = () => {
    setLoader(true);
    setDataSub([]);
    setSubView([]);

    axios.get(ServiceUrl.SETTINGS.LIST_SUBJECT).then((res) => {
      if (res["data"].status == "1") {
        setDataSub(res["data"].data);
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

  const courseTypeChange = (value) => {
    let m = academics.filter(
      (item) => upperCase(item.type) == upperCase(value)
    );
    setAcademicYear(m);
    setSelectedType(value);
  };

  const handleDepartmentChange = (departmentId) => {
    let m = staffList.filter(
      (item) => item.emp_academic_department == departmentId
    );
    setFilteredStaff(m);
    //setSelectedStaff('');
  };

  useEffect(() => {
    handleDepartmentChange(field("academic_department"));
  }, [staffList]);

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
          id="frm_Updatestaffsubject"
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
                {courseTypes.map((item) => {
                  if (item[0].type === field("course_type"))
                    return (
                      <option value={item[0].type} selected>
                        {upperCase(item[0].type)}
                      </option>
                    );
                  else
                    return <option value={item[0].type}>{item[0].type}</option>;
                })}
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

          <Row className="mt-2">
            <Col md={12}>
              <label>
                Department<span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                name="academic_department"
                size="sm"
                className="fw-bold form-select form-select-sm"
                onChange={(e) => {
                  handleDepartmentChange(e.target.value);
                  setSelectedStaffId("");
                }}
                required
              >
                <option value="">-</option>
                {loadDepartmentOptions(
                  stdepartments,
                  "dept_type",
                  field("academic_department")
                )}
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
                    <option
                      value={item.id}
                      selected={item.id == field("staff_id") ? "selected" : ""}
                    >
                      {item.emp_name}
                    </option>
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
                    <option
                      value={item.id}
                      selected={item.id == field("staff_id") ? "selected" : ""}
                    >
                      {item.emp_name}
                    </option>
                  ))}
                </Form.Control>
                  )*/}
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <label>
                Subject<span className="text-danger">*</span>
              </label>
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
              {/*<Form.Control
                as="select"
                name="subject_id"
                size="sm"
                className="fw-bold form-select form-select-sm"
                required
              >
                {staffSubjects().map((item) => (
                  <option
                    value={item.id}
                    selected={item.id == field("subject_id") ? "selected" : ""}
                  >
                    {" "}
                    {item.subject_name}
                  </option>
                ))}
                </Form.Control>*/}
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
export default withRouter(EditStaffSubject);
