import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../context";
import { capitalizeFirst, CardFixedTop, upperCase } from "../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../utils/serviceUrl";
import LoaderSubmitButton from "../../../utils/LoaderSubmitButton";

const AddSubAcount = (props) => {
  const context = useContext(PsContext);

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
      .post(ServiceUrl.SETTINGS.SAVE_GATEWAY_SUBACCOUNT, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          //document.getElementById("frm_save_feeBank").reset();
          form.reset();
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
          id="frm_save_feeBank"
          onSubmit={handleFormSubmit}
        >
          <Row className="">
            <Col md={12}>
              <label>
                Gateway Name<span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                name="gateway_name"
                className="fw-bold form-select form-select-sm"
                size="sm"
                required
              >
                <option value="ccavenue">CCAvenue</option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label>
                Sub Account Id<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="sub_account_id"
                className="fw-bold"
                size="sm"
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label>
                Sub Account Name<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="sub_account_name"
                className="fw-bold"
                size="sm"
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label>
                Sub Account Entity Name<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="sub_account_entity_name"
                className="fw-bold"
                size="sm"
                required
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <label>
                Bank Account No <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="sub_bank_account_no"
                className="fw-bold"
                size="sm"
                required
              />
            </Col>
            <Col md={6}>
              <label>Status</label>
              <Form.Control
                as="select"
                name="active_status"
                size="sm"
                className="fw-bold form-select form-select-sm"
                required
              >
                <option value="1"> Active </option>
                <option value="0"> In-Active </option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <div className="text-end">
                <a
                  onClick={(e) => props.onHide()}
                  className="pe-2 me-2 border-end"
                >
                  Cancel
                </a>
                <LoaderSubmitButton
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

export default withRouter(AddSubAcount);
