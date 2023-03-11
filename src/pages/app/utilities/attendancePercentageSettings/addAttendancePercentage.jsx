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

const AddAttendancePercentage = (props) => {
  const context = useContext(PsContext);
  const [stdepartments, setstDepartments] = useState([]);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

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
      .post(ServiceUrl.UTILITIES.SAVE_ATTENDANCE_PERCENTAGE, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          form.reset();
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
          id="frm_save_SubjectNature"
          onSubmit={handleFormSubmit}
        >
          <Row className="">
            <Col md={12}>
              <label>
                Name<span className="text-danger">*</span>
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

          <Row className="mt-2">
            <Col md={6}>
              <label>
                Percentage From<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="number"
                name="percentage_from"
                className="fw-bold"
                size="sm"
                required
              />
            </Col>
            <Col md={6}>
              <label>
                Percentage To<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="number"
                name="percentage_to"
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

export default withRouter(AddAttendancePercentage);
