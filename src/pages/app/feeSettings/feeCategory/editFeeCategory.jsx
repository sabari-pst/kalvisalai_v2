import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import { Button, ButtonGroup, Col, Form, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";

import { capitalizeFirst, CardFixedTop } from "../../../../utils";
import PsModalWindow from "../../../../utils/PsModalWindow";
import { Spin } from "antd";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { listFeeBanks, listGatewaySubAccounts } from "../../../../models/fees";

const EditFeeCategory = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [subAccounts, setSubAccounts] = useState([]);

  useEffect(() => {
    setLoader(true);
    listFeeBanks("1").then((res) => {
      if (res) setBankAccounts(res);
      setLoader(false);
    });
    listGatewaySubAccounts("1").then((res) => res && setSubAccounts(res));
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
        ServiceUrl.FEE_CATEGORY.UPDATE_CATEGORY,
        $("#frm_UpdateFeeCategory").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          if (props.onSuccess) props.onSuccess();
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
      <PsModalWindow {...props}>
        <Spin spinning={loader}>
          <Form
            noValidate
            validated={validated}
            action=""
            method="post"
            id="frm_UpdateFeeCategory"
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="id" value={field("id")} />

            <Row className="">
              <Col md={12}>
                <label>
                  Under the Bank Account <span className="text-danger">*</span>
                </label>
                <Form.Control
                  as="select"
                  size="sm"
                  className="fw-bold form-select form-select-sm"
                  name="fee_bank_id"
                  required
                >
                  <option value="">-Select-</option>
                  {bankAccounts.map((item) => (
                    <option
                      value={item.id}
                      selected={
                        field("fee_bank_id") == item.id ? "selected" : ""
                      }
                    >
                      {item.bank_print_name || item.bank_name}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12}>
                <label>
                  Collection Sub Account <span className="text-danger">*</span>
                </label>
                <Form.Control
                  as="select"
                  size="sm"
                  className="fw-bold form-select form-select-sm"
                  name="payment_gateway_subid"
                >
                  <option value="">-None-</option>
                  {subAccounts.map((item) => (
                    <option
                      value={item.id}
                      selected={
                        field("payment_gateway_subid") == item.id
                          ? "selected"
                          : ""
                      }
                    >
                      {item.sub_account_id} - {item.sub_account_name} -{" "}
                      {item.sub_bank_account_no}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12}>
                <label>
                  Name of the Category <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold"
                  name="category_name"
                  defaultValue={field("category_name")}
                  required
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12}>
                <label>
                  Print Name of the Category{" "}
                  <span className="text-danger"></span>
                </label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold"
                  name="print_name"
                  defaultValue={field("category_print_name")}
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12}>
                <label>
                  Account No <span className="text-danger"></span>
                </label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold"
                  name="account_no"
                  defaultValue={field("category_account_no")}
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6}>
                <label>
                  Default Category Amount <span className="text-danger"></span>
                </label>
                <Form.Control
                  type="number"
                  size="sm"
                  className="fw-bold"
                  name="amount"
                  defaultValue={field("category_amount")}
                />
              </Col>
              <Col md={6}>
                <label>
                  Display Order <span className="text-danger"></span>
                </label>
                <Form.Control
                  type="number"
                  size="sm"
                  className="fw-bold"
                  name="display_order"
                  defaultValue={field("display_order")}
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12}>
                <label>
                  Status <span className="text-danger"></span>
                </label>
                <Form.Control
                  as="select"
                  size="sm"
                  className="fw-bold"
                  name="status"
                  defaultValue={field("active_status")}
                >
                  <option value="1"> Active </option>
                  <option value="0"> In-Active </option>
                </Form.Control>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  label="Do you want to allow the Students to pay this category through online ?"
                  name="online_pay"
                  defaultChecked={field("allow_online_pay") == "1"}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <div className="text-end">
                  <a
                    className="border-end pe-2 me-3 fs-10"
                    onClick={(e) => props.onHide && props.onHide()}
                  >
                    <u>Cancel</u>
                  </a>
                  <LoaderSubmitButton loading={loader} text="Update Category" />
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </PsModalWindow>
    </>
  );
};

export default EditFeeCategory;
