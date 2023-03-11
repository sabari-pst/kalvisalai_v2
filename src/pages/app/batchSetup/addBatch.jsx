import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  upperCase,
} from "../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../utils/serviceUrl";
import LoaderSubmitButton from "../../../utils/LoaderSubmitButton";
import { COURSE_TYPE_SORT_ORDER } from "../../../utils/data";

const AddBatch = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

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
      .post(ServiceUrl.SETTINGS.SAVE_BATCH, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          document.getElementById("frm_SaveBatch").reset();
          if (props.onSuccess) props.onSuccess();

          toast.success(res["data"].message || "Success");
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
          method="post"
          noValidate
          validated={validated}
          id="frm_SaveBatch"
          onSubmit={handleFormSubmit}
        >
          <Row className="mt-1">
            <Col md={12}>
              <label className="fs-sm">
                Batch Value <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                name="batch"
                className="fw-bold text-uppercase"
                size="sm"
                required
              />
            </Col>
            <span>E:g 2021-2024</span>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label className="fs-sm">
                No.of. Semesters <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="number"
                name="no_of_semesters"
                className="fw-bold"
                size="sm"
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label className="fs-sm">
                Type <span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                name="type"
                className="fw-bold form-select form-select-sm"
                size="sm"
                required
              >
                <option value="">-Select-</option>
                {COURSE_TYPE_SORT_ORDER.map((item) => (
                  <option value={item}>{upperCase(item)}</option>
                ))}
                {/*<option value="ug"> UG </option>
                                <option value="pg"> PG </option>
                                <option value="mphil"> Mphil </option>
                                <option value="phd"> PhD </option>
    <option value="diploma"> Diploma </option>*/}
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <div className="text-end">
                <LoaderSubmitButton text="Save" loading={loader} />
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default withRouter(AddBatch);
