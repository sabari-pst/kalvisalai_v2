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
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";

const AddNaacCriteria = (props) => {
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
      .post(ServiceUrl.NAAC.SAVE_CRITERIA, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          document.getElementById("frm_save_criteria").reset();
          if (props.onSuccess) props.onSuccess();

          toast.success(res["data"].message || "Success");
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
          id="frm_save_criteria"
          onSubmit={handleFormSubmit}
        >
          <Row className="">
            <Col md={12}>
              <label>
                Criteria Code<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="number"
                name="criteria_code"
                className="text-uppercase fw-bold"
                size="sm"
                required
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <label>
                Criteria Title<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="criteria_title"
                size="sm"
                className="fw-bold"
                required
              />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={12}>
              <div className="text-end">
                <a
                  onClick={(e) => props.onHide()}
                  className="me-2 border-end pe-2"
                >
                  Cancel
                </a>
                <LoaderSubmitButton
                  type="submit"
                  size="sm"
                  loading={loader}
                  text={
                    <>
                      <i className="fa-solid fa-check me-2"></i>Save
                    </>
                  }
                />
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default withRouter(AddNaacCriteria);
