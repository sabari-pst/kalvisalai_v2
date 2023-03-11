import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Redirect, Route, withRouter } from "react-router-dom";

import PsContext from "../../../context";
import { MOB_ICONS } from "../../../utils/data";
import { ServiceUrl } from "../../../utils/serviceUrl";

const SetMobilePassword = (props) => {
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
      .post(ServiceUrl.MOB.SET_LOGIN_PASSWORD, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          context.updateMobilePassword(context.user.uuid);
        } else {
          toast.error(res["data"].message || "Error");
          setLoader(false);
        }
      });
  };

  return (
    <div className="container px-5 py-5">
      <img src={MOB_ICONS.SCREEN_LOCK_256.default} style={{ width: "60px" }} />
      <h1 className="mt-4">Set a Screen Lock</h1>

      <Form
        action=""
        method="post"
        noValidate
        validated={validated}
        onSubmit={handleFormSubmit}
      >
        <input type="hidden" name="staff_uuid" value={context.user.uuid} />
        <Row className="mt-4">
          <Col md={12}>
            <Form.Control
              type="password"
              name="password"
              size="lg"
              className="fw-bold text-center"
              placeholder="Type your password"
              autoFocus={true}
              required
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12}>
            <Button
              type="submit"
              className="btn-block text-uppercase"
              size="lg"
              disabled={loader}
            >
              {loader ? "Wait..." : "Next"}
              {loader && (
                <Spinner
                  animation="grow"
                  size="sm"
                  state="loading"
                  className="ms-3"
                />
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default withRouter(SetMobilePassword);
