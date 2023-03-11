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
import { SelectCashBookDropDown } from "../../components";
import { listFeeBanks, listGatewaySubAccounts } from "../../../../models/fees";

const NewFeeCategory = (props) => {
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
        ServiceUrl.FEE_CATEGORY.SAVE_CATEGORY,
        $("#frm_SaveFeeCategory").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          document.getElementById("frm_SaveFeeCategory").reset();
          if (props.onSuccess) props.onSuccess();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
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
            id="frm_SaveFeeCategory"
            onSubmit={handleFormSubmit}
          >
            {!context.cashbook && (
              <Row className="mb-2">
                <Col md={12}>
                  <label>
                    Cashbook <span className="text-danger">*</span>
                  </label>
                  <SelectCashBookDropDown />
                </Col>
              </Row>
            )}

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
                    <option value={item.id}>
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
                    <option value={item.id}>
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
                  defaultValue="0"
                  name="amount"
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
                  defaultValue="0"
                  name="display_order"
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
                  <LoaderSubmitButton loading={loader} text="Save Category" />
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </PsModalWindow>
    </>
  );
};

export default NewFeeCategory;
