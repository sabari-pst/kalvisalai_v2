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

const AddEmployee = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [married, setMarried] = useState(0);
  const [preAddress, setPreAddress] = useState([]);
  const [perAddress, setPerAddress] = useState([]);
  const [empCode, setEmpCode] = useState("");

  const [departments, setDepartments] = useState([]);
  const [stdepartments, setstDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getEmpCode();

    listDepartments("1").then((res) => res && setDepartments(res));
    listDesignations("1").then((res) => res && setDesignations(res));
    liststDepartments("1").then((res) => res && setstDepartments(res));
    listUserRoles("1").then((res) => res && setRoles(res));
  }, []);

  const getEmpCode = () => {
    setLoader(true);
    axios.get(ServiceUrl.HR.EMPLOYEE_NEW_CODE).then((res) => {
      if (res["data"].status == "1") {
        setEmpCode(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
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
    if (!window.confirm("Do you want to save?")) {
      return;
    }
    setLoader(true);
    axios
      .post(ServiceUrl.HR.SAVE_EMPLOYEE, $("#frm_addEmployee").serialize())
      .then((res) => {
        if (res["data"].status == "1") {
          document.getElementById("frm_addEmployee").reset();
          setMarried(0);
          getEmpCode();

          if (props.onSuccess) props.onSuccess();

          toast.success(res["data"].message || "Success");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const innerOptions = (items) => {
    return items.map((item) => (
      <option value={item.id}>
        {item.department} - {item.dept_type == "aided" ? "(R)" : "(SF)"}
      </option>
    ));
  };

  const getAcademicDepartments = () => {
    let m = groupByMultiple(stdepartments, function (obj) {
      return [obj.dept_type];
    });
    let rv = [];
    m.map((item, i) => {
      rv.push(
        <optgroup label={upperCase(item[0].dept_type)}>
          {innerOptions(item)}
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
          id="frm_addEmployee"
          onSubmit={handleFormSubmit}
        >
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
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
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
                    max={momentDate(
                      subtractYears(new Date(), 18),
                      "YYYY-MM-DD"
                    )}
                    name="dob"
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
                  >
                    <option value="">-</option>
                    {departments.map((item) => (
                      <option value={item.id}>{item.department_name}</option>
                    ))}
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
                    name="emp_academic_department"
                  >
                    <option value="">-</option>
                    {designations.map((item) => (
                      <option value={item.id}>{item.designation_name}</option>
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
                    name="emp_designation"
                  >
                    <option value="">-</option>
                    {getAcademicDepartments()}
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
                      <option value={item.id}>{item.role_name}</option>
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
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                className="fw-bold"
                size="sm"
                name="emp_current_pincode"
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
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                className="fw-bold"
                size="sm"
                name="emp_permanent_pincode"
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
                  <i className="fa fa-check me-2 pe-2 border-right"></i>Save
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default withRouter(AddEmployee);
