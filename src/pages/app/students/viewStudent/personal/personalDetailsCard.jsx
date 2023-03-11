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
  getFileLiveUrl,
  momentDate,
  semesterValue,
  upperCase,
  yearBySem,
} from "../../../../../utils";
import { SELECT_USER_PHOTO } from "../../../../../utils/data";

const PersonalDetailsCard = (props) => {
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
      <Row>
        <Col md={9}>
          <Card>
            <Card.Header className="fw-bold">Personal Details</Card.Header>
            <Card.Body>
              {colMdFirst("Name", field("name"))}

              <Row className="mt-2">
                <Col md={2}>
                  <label>Adm. No. & Date</label>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={field("admissionno")}
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={momentDate(field("admissiondate"), "DD/MM/YYYY")}
                  />
                </Col>
                <Col md={2}>
                  <label>Appl. No. & Date</label>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={field("application_no")}
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={momentDate(field("application_date"), "DD/MM/YYYY")}
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={2}>
                  <label>Register No</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold text-uppercase"
                    value={field("registerno")}
                  />
                </Col>
              </Row>

              {colMdFirst(
                "Course",
                field("degree_name") +
                  "-" +
                  field("course_name") +
                  "  -" +
                  upperCase(field("course_type"))
              )}

              <Row className="mt-2">
                <Col md={2}>
                  <label>Batch </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("batch"))}
                  />
                </Col>
                <Col md={2}>
                  <label>Year & Sem</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={
                      yearBySem(field("semester")) +
                      " / " +
                      semesterValue(field("semester"))
                    }
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={2}>
                  <label>Gender </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("gender"))}
                  />
                </Col>
                <Col md={2}>
                  <label>DOB & Age</label>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={momentDate(field("dob"))}
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={calculateAge(field("dob"))}
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={2}>
                  <label>Community </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("community_name"))}
                  />
                </Col>
                <Col md={2}>
                  <label>Caste</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("caste"))}
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={2}>
                  <label>Nationality </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("nationality"))}
                  />
                </Col>
                <Col md={2}>
                  <label>Mother Tongue</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("mothertongue"))}
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={2}>
                  <label>Mobile </label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={upperCase(field("mobile"))}
                  />
                </Col>
                <Col md={2}>
                  <label>Email Id</label>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    value={field("email")}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Image
            src={getFileLiveUrl(field("profile_photo"))}
            fallback={SELECT_USER_PHOTO}
            style={{ maxHeight: "255px" }}
          />
        </Col>
      </Row>
    </>
  );
};

export default withRouter(PersonalDetailsCard);
