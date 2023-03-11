import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  integerAadhar,
  momentDate,
  subtractYears,
  upperCase,
} from "../../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { BLOOD_GROUPS } from "../../../../utils/data";
import { listDepartments, listDesignations } from "../../../../models/hr";
import { liststDepartments } from "../../../../models/hr";
import { listUserRoles } from "../../../../models/users";
const EditEmployee = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [married, setMarried] = useState(0);
  const [empCode, setEmpCode] = useState("");

  const [departments, setDepartments] = useState([]);
  const [stdepartments, setstDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    setEmpCode(props.dataSource.emp_code);
    setMarried(props.dataSource.emp_marital_status);

    listDepartments("1").then((res) => res && setDepartments(res));
    listDesignations("1").then((res) => res && setDesignations(res));
    liststDepartments("1").then((res) => res && setstDepartments(res));
    listUserRoles("1").then((res) => res && setRoles(res));
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (!window.confirm("Do you want to update?")) {
      return;
    }
    setLoader(true);
    axios
      .post(ServiceUrl.HR.UPDATE_EMPLOYEE, $("#frm_UpdateEmployee").serialize())
      .then((res) => {
        if (res["data"].status == "1") {
          if (props.onSuccess) props.onSuccess(res["data"].data);

          toast.success(res["data"].message || "Success");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
  };

  const innerOptions = (items, dv) => {
    return items.map((item) => (
      <option value={item.id} selected={item.id == dv ? "selected" : ""}>
        {item.department} - {item.dept_type == "aided" ? "(R)" : "(SF)"}
      </option>
    ));
  };

  const getAcademicDepartments = (val) => {
    let m = groupByMultiple(stdepartments, function (obj) {
      return [obj.dept_type];
    });
    let rv = [];
    m.map((item, i) => {
      rv.push(
        <optgroup label={upperCase(item[0].dept_type)}>
          {innerOptions(item, val)}
        </optgroup>
      );
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
          id="frm_UpdateEmployee"
          onSubmit={handleFormSubmit}
        >
          <input type="hidden" name="id" value={field("id")} />
          <input type="hidden" name="uuid" value={field("uuid")} />

          <Row>
            <Col md={9}>
              <Row>
                <Col md={3}>
                  <label className="fs-sm">
                    Emp.Code <span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="text"
                    className="fw-bold text-uppercase"
                    placeholder="Employee Code"
                    size="sm"
                    name="emp_code"
                    value={empCode}
                    readOnly
                    required
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={3}>
                  <label className="fs-sm">
                    Name <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={2}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="prefix"
                    defaultValue={field("emp_prefix")}
                    required
                  >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="M/S">M/S</option>
                  </Form.Control>
                </Col>
                <Col md={7}>
                  <Form.Control
                    type="text"
                    className="fw-bold text-uppercase"
                    placeholder="Employee Name"
                    size="sm"
                    name="name"
                    defaultValue={field("emp_name")}
                    required
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={3}>
                  <label className="fs-sm">
                    Appoin.Dt <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="date"
                    className="fw-bold"
                    size="sm"
                    name="appoinment_date"
                    defaultValue={field("emp_confirm_date")}
                    required
                  />
                </Col>
                <Col md={2} className="text-end">
                  <label className="fs-sm">
                    Join.Dt <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="date"
                    className="fw-bold "
                    size="sm"
                    name="join_date"
                    defaultValue={field("emp_joining_date")}
                    required
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={3}>
                  <label className="fs-sm">
                    Gender <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={3}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="gender"
                    defaultValue={field("emp_gender")}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>form-select
                    <option value="tg">TG</option>
                  </Form.Control>
                </Col>
                <Col md={2} className="text-end">
                  <label className="fs-sm">
                    DOB <span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="date"
                    className="fw-bold text-uppercase"
                    size="sm"
                    name="dob"
                    max={momentDate(
                      subtractYears(new Date(), 18),
                      "YYYY-MM-DD"
                    )}
                    defaultValue={field("emp_dob")}
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={3}>
                  <label className="fs-sm">
                    Blood Group <span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={3}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="blood_group"
                    defaultValue={field("emp_blood_group")}
                  >
                    <option value=""></option>
                    {BLOOD_GROUPS.map((item) => (
                      <option value={item}>{item}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2} className="text-end">
                  <label className="fs-sm">
                    Religion <span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="religion"
                    defaultValue={field("emp_religion")}
                  >
                    <option value="">-</option>
                    <option value="hindu">Hindu</option>
                    <option value="christian">Christian</option>
                    <option value="muslim">Muslim</option>
                    <option value="other">Other</option>
                  </Form.Control>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={3}>
                  <label className="fs-sm">
                    Qual.Category <span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={3}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="qualification_category"
                    defaultValue={field("emp_qualification_category")}
                  >
                    <option value="">-</option>
                    <option value="school">School</option>
                    <option value="iti">ITI</option>
                    <option value="diploma">Diploma</option>
                    <option value="ug">UG</option>
                    <option value="pg">PG</option>
                    <option value="phd">Phd</option>
                  </Form.Control>
                </Col>
                <Col md={2} className="text-end">
                  <label className="fs-sm">
                    Qualification <span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    className="fw-bold"
                    size="sm"
                    name="qualification"
                    defaultValue={field("emp_qualification")}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={3}>
                  <label className="fs-sm">
                    Department<span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={3}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="emp_department"
                    defaultValue={field("emp_department")}
                  >
                    <option value="">-</option>
                    {departments.map((item) => (
                      <option
                        value={item.id}
                        selected={
                          item.id == field("emp_department") ? "selected" : ""
                        }
                      >
                        {item.department_name}
                      </option>
                    ))}
                    {/* {departments.map(item => <option value={item.id}>{item.department_name}</option>)} */}
                  </Form.Control>
                </Col>
                <Col md={2} className="text-end">
                  <label className="fs-sm">
                    Designation<span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="emp_designation"
                    defaultValue={field("emp_designation")}
                  >
                    <option value="0">-Select-</option>
                    {designations.map((item) => (
                      <option
                        value={item.id}
                        selected={
                          item.id == field("emp_designation") ? "selected" : ""
                        }
                      >
                        {item.designation_name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={3} className="">
                  <label className="fs-sm">
                    Academic Department<span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={9}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="emp_academic_department"
                    defaultValue={field("emp_academic_department")}
                  >
                    <option value="0">-Select-</option>
                    {getAcademicDepartments(field("emp_academic_department"))}
                  </Form.Control>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={3}>
                  <label className="fs-sm">Role</label>
                </Col>
                <Col md={3}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="emp_role_id"
                  >
                    <option value="">-None-</option>
                    {roles.map((item) => (
                      <option
                        value={item.id}
                        selected={
                          item.id == field("emp_role_id") ? "selected" : ""
                        }
                      >
                        {item.role_name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <label className="fs-sm">Smart Card Id</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    className="fw-bold"
                    size="sm"
                    name="emp_smart_id"
                    defaultValue={field("emp_smart_id")}
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={3}>
                  <label className="fs-sm">Married</label>
                </Col>
                <Col md={3}>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="marital_status"
                    onChange={(e) => setMarried(e.target.value)}
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </Form.Control>
                </Col>
                <Col md={2} className="text-end">
                  <label className="fs-sm">
                    Aadhar No<span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    onKeyPress={integerAadhar}
                    className="fw-bold"
                    size="sm"
                    name="emp_aadhar"
                    defaultValue={field("emp_aadhar")}
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={3}>
                  <label className="fs-sm">Spouse Name</label>
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="text"
                    className="fw-bold"
                    size="sm"
                    disabled={married == 0}
                    name="spouse_name"
                    defaultValue={field("emp_spouse_name")}
                  />
                </Col>
                <Col md={2} className="text-end">
                  <label className="fs-sm">
                    Anniversary <span className="text-danger"></span>
                  </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="date"
                    className="fw-bold"
                    size="sm"
                    disabled={married == 0}
                    name="anniversary"
                    defaultValue={field("emp_anniversary")}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}>
              <label className="fs-sm">Father's Name</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="father_name"
                defaultValue={field("emp_father_name")}
              />
            </Col>

            <Col md={2}>
              <label className="fs-sm">
                Mother's Name <span className="text-danger"></span>
              </label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="mother_name"
                defaultValue={field("emp_mother_name")}
              />
            </Col>
          </Row>
          {/*<Row className="mt-2">
                <Col md={12} className="text-end">
                    <label className='fs-sm'>
                        <input type="checkbox" /> Same as present address
                    </label>
                </Col>
            </Row>*/}
          <Row className="mt-2">
            <Col md={2}>
              <label className="fs-sm">Present Address</label>
            </Col>
            <Col md={4}>
              <Form.Control
                as="textarea"
                rows="4"
                className="fw-bold"
                size="sm"
                name="emp_current_address"
                defaultValue={field("emp_current_address")}
              />
            </Col>

            <Col md={2}>
              <label className="fs-sm">
                Permanent Address <span className="text-danger"></span>
              </label>
            </Col>
            <Col md={4}>
              <Form.Control
                as="textarea"
                rows="4"
                className="fw-bold"
                size="sm"
                name="emp_permanent_address"
                defaultValue={field("emp_permanent_address")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}>
              <label className="fs-sm">City & Pincode</label>
            </Col>
            <Col md={2}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="emp_current_city"
                defaultValue={field("emp_current_city")}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                className="fw-bold"
                size="sm"
                name="emp_current_pincode"
                defaultValue={field("emp_current_pincode")}
              />
            </Col>

            <Col md={2}>
              <label className="fs-sm">City & Pincode</label>
            </Col>
            <Col md={2}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="emp_permanent_city"
                defaultValue={field("emp_permanent_city")}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                className="fw-bold"
                size="sm"
                name="emp_permanent_pincode"
                defaultValue={field("emp_permanent_pincode")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}>
              <label className="fs-sm">State</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="emp_current_state"
                defaultValue={field("emp_current_state")}
              />
            </Col>
            <Col md={2}>
              <label className="fs-sm">State</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="emp_permanent_state"
                defaultValue={field("emp_permanent_state")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}>
              <label className="fs-sm">Mobile No</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="mobile"
                defaultValue={field("emp_personal_mobile")}
              />
            </Col>
            <Col md={2}>
              <label className="fs-sm">Whatsapp No</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="whatsapp"
                defaultValue={field("emp_whatsapp_no")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}>
              <label className="fs-sm">Email Id</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="email"
                className="fw-bold"
                size="sm"
                name="email"
                defaultValue={field("emp_personal_mail")}
              />
            </Col>
            <Col md={2}>
              <label className="fs-sm">Week off Day</label>
            </Col>
            <Col md={4}>
              <Form.Control
                as="select"
                className="fw-bold"
                size="sm"
                name="week_off_day"
                defaultValue={field("emp_weekoff_day")}
              >
                <option value="">-</option>
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}>
              <label className="fs-sm">PF No</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="emp_epf_no"
                defaultValue={field("emp_epf_no")}
              />
            </Col>
            <Col md={2}>
              <label className="fs-sm">ESI No</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="emp_esi_no"
                defaultValue={field("emp_esi_no")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}>
              <label className="fs-sm">Bank Name</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="emp_bank_name"
                defaultValue={field("emp_bank_name")}
              />
            </Col>
            <Col md={2}>
              <label className="fs-sm">Bank Acc.No</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                className="fw-bold"
                size="sm"
                name="emp_bank_account_no"
                defaultValue={field("emp_bank_account_no")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}>
              <label className="fs-sm">Basic Pay</label>
            </Col>
            <Col md={4}>
              <Form.Control
                type="number"
                className="fw-bold"
                size="sm"
                name="emp_basic_pay"
                defaultValue={field("emp_basic_pay")}
              />
            </Col>
            <Col md={2}>
              <label className="fs-sm">Status</label>
            </Col>
            <Col md={4}>
              <Form.Control
                as="select"
                className="fw-bold form-select form-select-sm"
                size="sm"
                name="active_status"
                defaultValue={field("active_status")}
              >
                <option value="1">Active</option>
                <option value="0">In-Active</option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}></Col>
            <Col md={10}>
              <div className="text-end">
                <Button
                  type="reset"
                  size="sm"
                  variant="danger"
                  className="me-2"
                >
                  <i className="fa fa-xmark me-2 pe-2 border-right"></i>Reset
                </Button>
                <Button type="submit" size="sm" variant="secondary">
                  <i className="fa fa-check me-2 pe-2 border-right"></i>Update
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default withRouter(EditEmployee);
