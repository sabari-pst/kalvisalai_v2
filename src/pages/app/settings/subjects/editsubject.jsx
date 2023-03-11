import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { capitalizeFirst, CardFixedTop, upperCase } from "../../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { liststDepartments } from "../../../../models/hr";
import { loadDepartmentOptions } from "../../../../models/courses";
import ModuleAccess from "../../../../context/moduleAccess";

const EditSubject = (props) => {
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
      .post(
        ServiceUrl.SETTINGS.UPDATE_SUBJECT,
        $("#frm_Updatesubject").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          if (props.onSuccess) props.onSuccess(res["data"].data);

          toast.success("Subject Updated");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };
  useEffect(() => {
    liststDepartments("1").then((res) => res && setstDepartments(res));
  }, []);
  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
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
                Subject Name<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="subject_name"
                defaultValue={field("subject_name")}
                size="sm"
                className="fw-bold text-uppercase"
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={6}>
              <label>Subject Code</label>
              <Form.Control
                type="text"
                name="subject_code"
                defaultValue={field("subject_code")}
                className="fw-bold"
                size="sm"
              />
              <ModuleAccess
                module="academic_subject_duplicate_code"
                action="action_create"
              >
                <input type="hidden" value="1" name="duplicate_code" />
              </ModuleAccess>
            </Col>
            <Col md={6}>
              <label>Short Name</label>
              <Form.Control
                type="text"
                name="short_name"
                defaultValue={field("short_name")}
                className="fw-bold"
                size="sm"
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={4}>
              <label>Subject Type </label>
              <Form.Control
                as="select"
                name="subject_type"
                defaultValue={field("subject_type")}
                size="sm"
                className="fw-bold form-select form-select-sm"
                required
              >
                <option value="Theory"> Theory</option>
                <option value="practical"> Practical</option>
              </Form.Control>
            </Col>

            <Col md={4}>
              <label>
                Part<span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                name="part"
                size="sm"
                defaultValue={field("part")}
                className="fw-bold form-select form-select-sm"
                required
              >
                <option value="1"> Part I</option>
                <option value="2">Part II</option>
                <option value="3"> Part III</option>
                <option value="4"> Part IV</option>
                <option value="5"> Part V</option>
              </Form.Control>
            </Col>
            <Col md={4}>
              <label>
                Color<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="color"
                name="subject_color"
                size="sm"
                className="fw-bold form-select form-select-sm"
                defaultValue={field("subject_color")}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={12}>
              <label>
                Department<span className="text-danger"></span>
              </label>
              <Form.Control
                as="select"
                name="academic_department"
                size="sm"
                className="fw-bold form-select form-select-sm"
              >
                <option value="">-</option>
                {/*stdepartments.map(item => <option value={item.id} selected={item.id==field("academic_department") ? 'selected' : ''} >{item.department}</option>)*/}
                {loadDepartmentOptions(
                  stdepartments,
                  "dept_type",
                  field("academic_department")
                )}
              </Form.Control>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={12}></Col>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                className="fw-bold"
                name="remarks"
                defaultValue={field("remarks")}
                rows={3}
              />
            </Form.Group>
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

export default withRouter(EditSubject);
