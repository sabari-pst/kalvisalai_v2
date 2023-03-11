import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import { Row, Col, Card, Form } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { momentDate, subtractYears } from "../../../../utils";
import { listCommunity, listReligions } from "../../../../models/settings";

const PersonalInfo = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [religions, setReligions] = useState([]);
  const [community, setCommunity] = useState([]);

  const [maritalStatus, setMaritalStatus] = useState("single");

  useEffect(() => {
    listCommunity().then((res) => res && setCommunity(res));
    listReligions().then((res) => res && setReligions(res));
    setMaritalStatus(field("maritalstatus"));
  }, []);

  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
  };

  return (
    <>
      <Card>
        <Card.Header className="fw-bold">Personal Information</Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <label>
                Student Initial & Name <span className="text-danger">*</span>
              </label>
            </Col>
            <Col md={2}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold text-uppercase"
                name="initial"
                placeholder="Initial"
                defaultValue={field("initial")}
              />
            </Col>
            <Col md={7}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold text-uppercase"
                name="name"
                placeholder="Student Name"
                defaultValue={field("name")}
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Date of Birth & Gender <span className="text-danger">*</span>
              </label>
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                size="sm"
                className="fw-bold text-uppercase"
                name="dob"
                placeholder="Date of Birth"
                max={momentDate(subtractYears(new Date(), 15), "YYYY-MM-DD")}
                defaultValue={field("dob")}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Control
                as="select"
                size="sm"
                className="fw-bold text-uppercase form-select form-select-sm"
                name="gender"
                defaultValue={field("gender")}
                placeholder=""
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Community & Caste <span className="text-danger">*</span>
              </label>
            </Col>
            <Col md={3}>
              <Form.Control
                as="select"
                size="sm"
                className="fw-bold text-uppercase form-select form-select-sm"
                name="community"
                required
              >
                <option value="">-Select-</option>
                {community.map((item) => (
                  <option
                    value={item.id}
                    selected={item.id == field("community") ? "selected" : ""}
                  >
                    {item.community}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={6}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                name="caste"
                placeholder="Caste"
                defaultValue={field("caste")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Religion & Nationality <span className="text-danger"></span>
              </label>
            </Col>
            <Col md={3}>
              <Form.Control
                as="select"
                size="sm"
                className="fw-bold text-uppercase form-select form-select-sm"
                name="religion"
                required
              >
                <option value="">-Select-</option>
                {religions.map((item) => (
                  <option
                    value={item.id}
                    selected={item.id == field("religion") ? "selected" : ""}
                  >
                    {item.religion}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={6}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                name="nationality"
                placeholder="Nationality"
                defaultValue={field("nationality")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Aadhar No <span className="text-danger"></span>
              </label>
            </Col>
            <Col md={9}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                name="aadharno"
                placeholder="Aadhar No"
                defaultValue={field("aadharno")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Mother Tongue & Marital Status{" "}
                <span className="text-danger"></span>
              </label>
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                name="mothertongue"
                placeholder="Mother Tongue"
                defaultValue={field("mothertongue")}
              />
            </Col>
            <Col md={6}>
              <Form.Control
                as="select"
                size="sm"
                className="fw-bold form-select form-select-sm"
                name="maritalstatus"
                onChange={(e) => {
                  setMaritalStatus(e.target.value);
                  props.onMaritalStatus(e.target.value);
                }}
                value={maritalStatus}
                required
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={3}>
              <label>
                Mobile & Email <span className="text-danger">*</span>
              </label>
            </Col>
            <Col md={3}>
              <Form.Control
                type="number"
                size="sm"
                className="fw-bold"
                name="mobile"
                placeholder="Mobile"
                defaultValue={field("mobile")}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Control
                type="email"
                size="sm"
                className="fw-bold"
                name="email"
                defaultValue={field("email")}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default withRouter(PersonalInfo);
