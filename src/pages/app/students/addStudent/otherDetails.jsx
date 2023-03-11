import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import { Row, Col, Card, Form } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { momentDate } from "../../../../utils";
import { listCommunity, listReligions } from "../../../../models/settings";

const OtherDetails = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);

  const [presentAddress, setPresentAddress] = useState([]);

  const handleAddressChange = (e) => {
    let s = [...presentAddress];
    s[e.target.name] = e.target.value;
    setPresentAddress(s);
    props.onAddressChange(s);
  };

  const onCheckClick = (e) => {
    if (e.target.checked) {
    }
  };

  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
  };

  return (
    <>
      <Card>
        <Card.Header className="fw-bold">Other Details</Card.Header>
        <Card.Body>
          <Row>
            <Col md={10}>
              <label>Physically Challanged ?</label>
            </Col>
            <Col md={2}>
              <Form.Check
                type="switch"
                size="lg"
                className="ps__switch__lg"
                name="is_physicall_challenged"
                value="1"
                defaultChecked={field("is_physicall_challenged") == "1"}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={10}>
              <label>Admitted Under Minority Quota ?</label>
            </Col>
            <Col md={2}>
              <Form.Check
                type="switch"
                size="lg"
                className="ps__switch__lg"
                name="is_minority"
                value="1"
                defaultChecked={field("is_minority") == "1"}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={10}>
              <label>Had any Scholorship ?</label>
            </Col>
            <Col md={2}>
              <Form.Check
                type="switch"
                size="lg"
                className="ps__switch__lg"
                name="is_scholarship_holder"
                value="1"
                defaultChecked={field("is_scholarship_holder") == "1"}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={10}>
              <label>Admitted under ex-serviceman Quota ?</label>
            </Col>
            <Col md={2}>
              <Form.Check
                type="switch"
                size="lg"
                className="ps__switch__lg"
                name="is_exserviceman"
                value="1"
                defaultChecked={field("is_exserviceman") == "1"}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={10}>
              <label>Admitted under Sports Quota ?</label>
            </Col>
            <Col md={2}>
              <Form.Check
                type="switch"
                size="lg"
                className="ps__switch__lg"
                name="is_sportsman"
                value="1"
                defaultChecked={field("is_sportsman") == "1"}
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={12}>
              <label>Notes</label>
              <Form.Control
                as="textarea"
                name="remarks"
                className="fw-bold"
                defaultValue={field("remarks")}
                size="sm"
                rows="3"
              ></Form.Control>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default withRouter(OtherDetails);
