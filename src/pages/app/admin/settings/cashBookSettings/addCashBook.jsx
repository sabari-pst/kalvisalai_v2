import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Form, Row, Col, Button, Card } from "react-bootstrap";
import PsContext from "../../../../../context";
import { ServiceUrl } from "../../../../../utils/serviceUrl";
import axios from "axios";
import { Spin } from "antd";
import toast from "react-hot-toast";
import LoaderSubmitButton from "../../../../../utils/LoaderSubmitButton";

const AddCashBook = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [originalText, setOriginalText] = useState("");

  useEffect(() => {}, []);

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
      .post(ServiceUrl.SETTINGS.SAVE_CASHBOOKS, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].content || "Success");

          if (props.afterFinish) props.afterFinish();
        } else {
          toast.error(res["data"].content || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <>
      <Spin spinning={loader}>
        <Form
          noValidate
          validated={validated}
          method="post"
          id="frm_AddTemplate"
          onSubmit={handleFormSubmit}
        >
          <Row>
            <Col md={12}>
              <Row>
                <Col md={12}>
                  <label className="control-label">
                    Name of the Cashbook <span className="text-danger">*</span>
                  </label>
                  <Form.Control
                    type="text"
                    name="cashbook_name"
                    className="fw-bold"
                    size="sm"
                    defaultValue=""
                    required
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={9}>
                  <label>Allow to access Aided informations</label>
                </Col>
                <Col md={3} className="text-end">
                  <Form.Check
                    type="switch"
                    className="check-input-lg"
                    value="1"
                    name="allow_aided"
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={9}>
                  <label>Allow to access Un-Aided informations</label>
                </Col>
                <Col md={3} className="text-end">
                  <Form.Check
                    type="switch"
                    className="check-input-lg"
                    value="1"
                    name="allow_unaided"
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={9}>
                  <label>Allow to access Transport related actions only</label>
                </Col>
                <Col md={3} className="text-end">
                  <Form.Check
                    type="switch"
                    className="check-input-lg"
                    value="1"
                    name="allow_transport"
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={9}>
                  <label>Allow to access Hostel related actions only</label>
                </Col>
                <Col md={3} className="text-end">
                  <Form.Check
                    type="switch"
                    className="check-input-lg"
                    value="1"
                    name="allow_hostel"
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={12}>
                  <label>Active Status</label>
                  <Form.Control
                    as="select"
                    size="sm"
                    className="form-select form-select-sm fw-bold"
                    name="active_status"
                    required
                  >
                    <option value="1">Active</option>
                    <option value="0">In-Active</option>
                  </Form.Control>
                </Col>
              </Row>

              <Row className="mt-3 py-2 border-top">
                <Col md={12}>
                  <div className="text-end">
                    <LoaderSubmitButton
                      type="submit"
                      variant="primary"
                      loading={loader}
                      value="Save"
                      size="sm"
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default AddCashBook;
