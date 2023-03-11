import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";
import { liststDepartments } from "../../../../models/hr";
import PsContext from "../../../../context";
import { capitalizeFirst, CardFixedTop, upperCase } from "../../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { COURSE_TYPE_SORT_ORDER } from "../../../../utils/data";

const AddCourse = (props) => {
  const context = useContext(PsContext);
  const [stdepartments, setstDepartments] = useState([]);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setLoader(true);
    liststDepartments("1").then((res) => {
      if (res) setstDepartments(res);
      setLoader(false);
    });
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
      .post(ServiceUrl.ACADEMIC.SAVE_COURSES, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          document.getElementById("frm_saveCourse").reset();
          if (props.onSuccess) props.onSuccess();

          toast.success(res["data"].message || "Error");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <>
      <Spin spinning={loader}>
        <Form
          method="post"
          noValidate
          validated={validated}
          id="frm_saveCourse"
          onSubmit={handleFormSubmit}
        >
          <Row className="">
            <Col md={12}>
              <label>
                Department<span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                name="academic_department"
                className="fw-bold form-select form-select-sm"
                size="sm"
                required
              >
                <option value="">-Select-</option>
                {stdepartments.map((item) => (
                  <option value={item.id}>
                    {item.department} (
                    {item.dept_type == "unaided" ? "SF" : "R"})
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <label>
                Degree Name<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="degreename"
                className="fw-bold"
                size="sm"
                required
              />
            </Col>
            <Col md={6}>
              <label>
                Course Type<span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                name="academic_dept_type"
                className="fw-bold form-select form-select-sm"
                size="sm"
                required
              >
                <option value="">-Select-</option>
                {COURSE_TYPE_SORT_ORDER.map((item) => (
                  <option value={item}>{upperCase(item)}</option>
                ))}
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <label>
                Type <span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                name="coursetype"
                size="sm"
                className="fw-bold form-select form-select-sm"
                required
              >
                <option value="regular"> Regular (Aided) </option>
                <option value="self"> Self (Un-Aided)</option>
              </Form.Control>
            </Col>
            <Col md={6}>
              <label>
                Medium of Instruction <span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                name="medium"
                size="sm"
                className="fw-bold form-select form-select-sm"
                required
              >
                <option value="tamil"> Tamil </option>
                <option value="english"> English </option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <label>
                Course Name<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="name"
                className="fw-bold"
                size="sm"
                required
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <label>
                Short Name<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="shortname"
                className="fw-bold"
                size="sm"
              />
            </Col>
            <Col md={6}>
              <label>
                Attendance Hour Per Day<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="number"
                name="att_hour_per_day"
                className="fw-bold"
                size="sm"
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <label>
                First Half Hours<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="first_half_hours"
                className="fw-bold"
                size="sm"
                required
              />
            </Col>
            <Col md={6}>
              <label>
                Second Half Hours<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="second_half_hours"
                className="fw-bold"
                size="sm"
                required
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
