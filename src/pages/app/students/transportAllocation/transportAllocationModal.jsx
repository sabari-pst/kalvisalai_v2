import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { Spin } from "antd";
import axios from "axios";
import PsModalWindow from "../../../../utils/PsModalWindow";
import TransportAllocation from ".";
import { CustomDropDown } from "../../components";
import { listDestinations } from "../../../../models/transport";
import { momentDate, upperCase } from "../../../../utils";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { ServiceUrl } from "../../../../utils/serviceUrl";

const TransportAllocationModal = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [ratePerMonth, setRatePerMonth] = useState(0);
  const [noOfMonth, setNoOfMonth] = useState(1);

  useEffect(() => {
    setLoader(true);
    listDestinations("1").then((res) => {
      if (res) setDestinations(res);
      setLoader(false);
    });
  }, []);

  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
  };

  const handleDestinationChange = (v, dest) => {
    if (dest) {
      setRatePerMonth(dest.rate);
      setSelectedDestination(dest);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!selectedDestination || !selectedDestination.id) {
      toast.error("Select a destination");
      return;
    }
    if (!window.confirm("Do you want to save?")) return;

    setLoader(true);
    axios
      .post(ServiceUrl.STUDENTS.SAVE_BUS_ROUTE, new FormData(form))
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
      <PsModalWindow {...props}>
        <Spin spinning={loader}>
          <Form
            action=""
            method="post"
            noValidate
            validated={validated}
            id="frm_SaveStudentTransport"
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="student_uuid" value={field("uuid")} />
            <input type="hidden" name="semester" value={field("semester")} />
            <input
              type="hidden"
              name="destination_id"
              value={selectedDestination.id}
            />
            <input
              type="hidden"
              name="vehicle_id"
              value={selectedDestination.vehicle_id}
            />

            <Row>
              <Col md={4}>
                <label>Register No</label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold text-uppercase"
                  value={field("registerno") || field("admissionno")}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={4}>
                <label>Name</label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold text-uppercase"
                  value={field("name")}
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <label>Destination</label>
              </Col>
              <Col md={8}>
                <CustomDropDown
                  dataSource={destinations}
                  value="id"
                  displayField={(item) =>
                    `${upperCase(item.destination_name)}-${item.vehicle_no}`
                  }
                  onChange={handleDestinationChange}
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <label>Date From</label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="date"
                  size="sm"
                  name="date_from"
                  className="fw-bold"
                  max={momentDate(new Date(), "YYYY-MM-DD")}
                  required
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <label>Rate (Per Month)</label>
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  size="sm"
                  name="rate"
                  className="fw-bold text-uppercase"
                  required
                  value={ratePerMonth}
                />
              </Col>
              <Col md={3}>
                <label>No.of.Month</label>
              </Col>
              <Col md={2}>
                <Form.Control
                  type="number"
                  size="sm"
                  name="no_of_month"
                  className="fw-bold"
                  required
                  value={noOfMonth}
                  onChange={(e) => setNoOfMonth(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <label>Total Amount</label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="number"
                  size="sm"
                  name="total_amount"
                  className="fw-bold"
                  required
                  value={ratePerMonth * noOfMonth}
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <label>Save As</label>
              </Col>
              <Col md={8}>
                <Form.Control
                  as="select"
                  size="sm"
                  name="save_as"
                  className="fw-bold"
                  required
                >
                  <option value="single">Single Entry</option>
                  <option value="bymonth">By No.of Months</option>
                </Form.Control>
              </Col>
            </Row>

            {/*} <Row className="mt-2">
                <Col md={4}>
                    <label>Fee From</label>
                </Col>
                <Col md={8}>
                    <Form.Control
                        type="date"
                        size="sm"
                        name="date_from"
                        className="fw-bold"
                        max={momentDate(new Date(),'YYYY-MM-DD')}
                        required
                    />
                </Col>
   </Row>*/}

            <Row className="mt-3">
              <Col md={12}>
                <div className="text-end">
                  <LoaderSubmitButton text="Save" />
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </PsModalWindow>
    </>
  );
};

export default withRouter(TransportAllocationModal);
