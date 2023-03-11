import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  timeTableDayFromNumber,
  upperCase,
} from "../../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { liststDepartments } from "../../../../models/hr";
import { loadDepartmentOptions } from "../../../../models/courses";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";

const EditDayOrder = (props) => {
  const context = useContext(PsContext);
  const [stdepartments, setstDepartments] = useState([]);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  let dayOrderCount = context.settingValue("attendance_day_order_count");
  let dayOrderInDayName = context.settingValue(
    "attendance_dayorder_as_day_name"
  );

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
      .post(ServiceUrl.UTILITIES.UPDATE_DAY_ORDER, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          if (props.onSuccess) props.onSuccess(res["data"].data);

          toast.success(res["data"].message || "Updated");
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

  const getDayOrder = () => {
    let rv = [];
    for (let i = 1; i <= dayOrderCount; i++) {
      rv.push(
        <option value={i}>
          {timeTableDayFromNumber(i, dayOrderInDayName)}
        </option>
      );
    }
    return rv;
  };

  return (
    <>
      <Spin spinning={loader}>
        <Form
          method="post"
          noValidate
          validated={validated}
          id="frm_Updatesubject"
          onSubmit={handleFormSubmit}
        >
          <input type="hidden" name="id" value={field("id")} />

          <Row className="">
            <Col md={12}>
              <label>
                Date<span className="text-danger">*</span>
              </label>
              <Form.Control
                type="date"
                name="day_order_date"
                className="text-uppercase fw-bold"
                size="sm"
                defaultValue={field("day_order_date")}
                required
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <label>
                Day Order<span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                name="day_order_value"
                className="text-uppercase fw-bold"
                size="sm"
                defaultValue={field("day_order_value")}
                required
              >
                {getDayOrder()}
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <div className="text-end">
                <a
                  onClick={(e) => props.onHide()}
                  className="border-end me-2 pe-2"
                >
                  Cancel
                </a>
                <LoaderSubmitButton
                  type="submit"
                  text="Update"
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

export default withRouter(EditDayOrder);
