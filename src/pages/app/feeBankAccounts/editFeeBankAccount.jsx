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
import { SelectCashBookDropDown } from "../components";
import LoaderSubmitButton from "../../../utils/LoaderSubmitButton";

const EditFeeBankAccount = (props) => {
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
    axios.post(ServiceUrl.FEES.UPDATE_BANK, new FormData(form)).then((res) => {
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

  return (
    <>
      <Spin spinning={loader}>
        <Form
          method="post"
          noValidate
          validated={validated}
          id="frm_UpdateHrBranch"
          onSubmit={handleFormSubmit}
        >
          <input type="hidden" name="id" value={field("id")} />

          {!context.cashbook && (
            <Row className="mb-2">
              <Col md={12}>
                <label>
                  Cashbook <span className="text-danger">*</span>
                </label>
                <SelectCashBookDropDown defaultValue={field("cashbook_id")} />
              </Col>
            </Row>
          )}

          <Row className="">
            <Col md={12}>
              <label>
                Print Name<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="bank_print_name"
                className="fw-bold"
                defaultValue={field("bank_print_name")}
                size="sm"
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label>
                Bank Name<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="bank_name"
                className="text-uppercase fw-bold"
                defaultValue={field("bank_name")}
                size="sm"
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={6}>
              <label>
                Account No <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="bank_account_no"
                className="text-uppercase fw-bold"
                defaultValue={field("bank_account_no")}
                size="sm"
                required
              />
            </Col>
            <Col md={6}>
              <label>Branch Name</label>
              <Form.Control
                type="text"
                name="branch_name"
                className="fw-bold"
                defaultValue={field("branch_name")}
                size="sm"
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <label>Place</label>
              <Form.Control
                type="text"
                name="bank_place"
                className="fw-bold"
                defaultValue={field("bank_place")}
                size="sm"
              />
            </Col>
            <Col md={6}>
              <label>Status</label>
              <Form.Control
                as="select"
                name="active_status"
                size="sm"
                className="fw-bold form-select form-select-sm"
                defaultValue={field("active_status")}
                required
              >
                <option value="1"> Active </option>
                <option value="0"> In-Active </option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <label>
                Address <span className="text-danger"></span>
              </label>
              <Form.Control
                as="textarea"
                name="bank_address"
                defaultValue={field("bank_address")}
                className="fw-bold"
                rows="4"
              />
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

export default withRouter(EditFeeBankAccount);
