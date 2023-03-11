import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Form, Row, Col, Button, Card } from "react-bootstrap";
import PsContext from "../../../../../context";
import { ServiceUrl } from "../../../../../utils/serviceUrl";
import axios from "axios";
import { Spin } from "antd";
import toast from "react-hot-toast";
import LoaderSubmitButton from "../../../../../utils/LoaderSubmitButton";

const EditCashbook = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [originalText, setOriginalText] = useState("");

  useEffect(() => {
    setOriginalText(props.dataSource.template);
  }, []);
  const field = (fieldName) => props.dataSource[fieldName] || "";

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
      .post(ServiceUrl.SETTINGS.UPDATE_CASHBOOK, new FormData(form))
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
          id="frm_UpdateTemplate"
          onSubmit={handleFormSubmit}
        >
          <input type="hidden" name="id" value={field("id")} />

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
                    defaultValue={field("cashbook_name")}
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
                    defaultChecked={field("allow_aided") == "1"}
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
                    defaultChecked={field("allow_unaided") == "1"}
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
                    defaultChecked={field("allow_transport") == "1"}
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
                    defaultChecked={field("allow_hostel") == "1"}
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
                    <option
                      value="1"
                      selected={field("active_status") == "1" ? "selected" : ""}
                    >
                      Active
                    </option>
                    <option
                      value="0"
                      selected={field("active_status") == "0" ? "selected" : ""}
                    >
                      In-Active
                    </option>
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
                      value="Update"
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

export default EditCashbook;
