import { Spin } from "antd";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import PsContext from "../../../../context";
import { momentDate } from "../../../../utils";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";

import { ServiceUrl } from "../../../../utils/serviceUrl";

const DateAdjustModal = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const field = (fieldName) => {
    if (props.dataSource[fieldName]) return props.dataSource[fieldName];
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() == false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (!window.confirm("Do you want to update")) return;
    setLoader(true);

    axios
      .post(ServiceUrl.FEES.UPDATE_PAID_PAYMENT_DATE, new FormData(form))
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

  return (
    <>
      <Spin spinning={loader}>
        <Form
          action=""
          method="post"
          noValidate
          validated={validated}
          onSubmit={handleFormSubmit}
        >
          <input type="hidden" name="bill_uuid" value={field("bill_uuid")} />
          <input
            type="hidden"
            name="student_uuid"
            value={field("student_uuid")}
          />
          <input
            type="hidden"
            name="student_uuid"
            value={field("student_uuid")}
          />

          <Row>
            <Col md={3}>
              <label>Reg.No</label>
            </Col>
            <Col md={9}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                value={field("registerno")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>Name</label>
            </Col>
            <Col md={9}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                value={field("student_name")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>Bill No</label>
            </Col>
            <Col md={9}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                name="bill_no"
                value={field("bill_no")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>Bill Date</label>
            </Col>
            <Col md={9}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                name="old_bill_date"
                value={field("bill_date")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>Bill Date</label>
            </Col>
            <Col md={9}>
              <Form.Control
                type="date"
                size="sm"
                className="fw-bold"
                name="bill_date"
                max={momentDate(new Date(), "YYYY-MM-DD")}
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}></Col>
            <Col md={9}>
              <div className="text-end">
                <LoaderSubmitButton
                  type="submitt"
                  variant="primary"
                  text="Update Bill Date"
                  loading={loader}
                />
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default DateAdjustModal;
