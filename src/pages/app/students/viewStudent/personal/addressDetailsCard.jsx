import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import { Row, Col, Card, Form } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../../context";
import { Image, Spin, Tabs } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../../utils/serviceUrl";
import {
  calculateAge,
  capitalizeFirst,
  momentDate,
  semesterValue,
  upperCase,
  yearBySem,
} from "../../../../../utils";
import { SELECT_USER_PHOTO } from "../../../../../utils/data";

const AddressDetailsCard = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState(props.dataSource);
  const [dataView, setDataView] = useState(props.dataSource);

  const field = (fieldName) => {
    if (dataView && dataView[fieldName]) return dataView[fieldName];
  };

  const colMdFirst = (text, value) => {
    return (
      <Row className="mt-2">
        <Col md={2}>
          <label>{text}</label>
        </Col>
        <Col md={10}>
          <Form.Control
            type="text"
            size="sm"
            className="fw-bold"
            value={value}
          />
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Row className="mt-2">
        <Col md={6}>
          <Card>
            <Card.Header className="fw-bold">Present Address</Card.Header>
            <Card.Body>
              <Row className="">
                <Col md={2}>
                  <label>Street </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={capitalizeFirst(field("street_persent"))}
                  />
                </Col>
                <Col md={2}>
                  <label>Place</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("place_present"))}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={2}>
                  <label>Village </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={capitalizeFirst(field("village_present"))}
                  />
                </Col>
                <Col md={2}>
                  <label>Taluk </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={capitalizeFirst(field("taluk_present"))}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={2}>
                  <label>City</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("city_present"))}
                  />
                </Col>
                <Col md={2}>
                  <label>State</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("state_present"))}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={2}>
                  <label>Country </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={capitalizeFirst(field("country_present"))}
                  />
                </Col>
                <Col md={2}>
                  <label>Pincode</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("pincode_present"))}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header className="fw-bold">Permanent Address</Card.Header>
            <Card.Body>
              <Row className="">
                <Col md={2}>
                  <label>Street </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={capitalizeFirst(field("street_permanent"))}
                  />
                </Col>
                <Col md={2}>
                  <label>Place</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("place_permanent"))}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={2}>
                  <label>Village </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={capitalizeFirst(field("village_permanent"))}
                  />
                </Col>
                <Col md={2}>
                  <label>Taluk</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("taluk_permanent"))}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={2}>
                  <label>City </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={capitalizeFirst(field("city_permanent"))}
                  />
                </Col>
                <Col md={2}>
                  <label>State</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("state_permanent"))}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={2}>
                  <label>Country </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={capitalizeFirst(field("country_permanent"))}
                  />
                </Col>
                <Col md={2}>
                  <label>Pincode</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("pincode_permanent"))}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col md={12}>
          <Card>
            <Card.Header className="fw-bold">Notes</Card.Header>
            <Card.Body>
              <Form.Control
                as="textarea"
                name="remarks"
                className="fw-bold"
                value={field("remarks")}
                size="sm"
                rows="3"
              ></Form.Control>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default withRouter(AddressDetailsCard);
