import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { listPaymentMethods } from "../../../../models/fees";
import { momentDate } from "../../../../utils";

const PaymentMethodSelection = (props) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);

  useEffect(() => {
    listPaymentMethods("1").then((res) => {
      if (res) {
        setPaymentMethods(res);
        setSelectedPaymentMethod(res[0]);
      }
    });
  }, []);

  const handlePaymentChange = (e) => {
    let m = paymentMethods.find((item) => item.id == e.target.value);
    if (m) setSelectedPaymentMethod(m);
    else setSelectedPaymentMethod([]);
  };

  return (
    <div>
      <input
        type="hidden"
        name="payment_cash"
        value={
          (selectedPaymentMethod && selectedPaymentMethod.refelect_in_cash) || 1
        }
      />
      <Row>
        <Col md={2} style={{ marginTop: "20px" }}>
          <label>Method</label>
        </Col>
        <Col md={4} style={{ marginTop: "20px" }}>
          <Form.Control
            as="select"
            size="sm"
            className="fw-bold form-select form-select-sm font-bookman"
            name="payment_method_id"
            onChange={(e) => handlePaymentChange(e)}
          >
            {paymentMethods.map((item) => (
              <option value={item.id}>{item.method_name}</option>
            ))}
          </Form.Control>
        </Col>
        <Col md={6}>
          <Form.Control
            type="number"
            className="fw-bold text-end py-0 me-2 color-theme font-bookman"
            value={props.grandTotal}
            style={{ fontSize: "30px", fontStyle: "italic" }}
            required
          />
        </Col>
      </Row>
      {selectedPaymentMethod &&
        selectedPaymentMethod.id &&
        selectedPaymentMethod.refelect_in_cash == "0" && (
          <>
            <Row className="mt-1">
              <Col md={2}>
                <label>Ref. No</label>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold"
                  name="payment_ref_number"
                />
              </Col>
              <Col md={2}>
                <label>Ref. Date</label>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="date"
                  size="sm"
                  className="fw-bold"
                  name="payment_ref_date"
                  max={momentDate(new Date())}
                />
              </Col>
            </Row>

            <Row className="mt-1">
              <Col md={2}>
                <label>Notes</label>
              </Col>
              <Col md={10}>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold"
                  name="payment_ref_notes"
                />
              </Col>
            </Row>
          </>
        )}
    </div>
  );
};
export default PaymentMethodSelection;
