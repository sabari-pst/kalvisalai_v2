import React, { useState, useEffect, useContext } from "react";
import { useHistory, withRouter } from "react-router-dom";
import $ from "jquery";
import { Helmet } from "react-helmet";

import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Spin } from "antd";
import toast from "react-hot-toast";

import Pscontext from "../../context";
import API from "../../utils/api";
import { appName, upperCase } from "../../utils";
import { printHeader, LOGO, VENDOR_LOGO } from "../../utils/data";

import AOS from "aos";

import axios from "axios";
import MobileLoginView from "./mobileLoginView";

const Login = (props) => {
  const context = useContext(Pscontext);
  const history = useHistory();

  const [validated, setValidated] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    AOS.init();
    AOS.refresh();
    context.loadSettings();

    checkTimeZone();
  }, []);

  const checkTimeZone = () => {
    const date = new Date();
    const dateAsString = date.toString();
    const timezone = dateAsString.match(/\(([^\)]+)\)$/)[1];

    if (upperCase(timezone) != upperCase("India Standard Time")) {
      toast.error(
        "Please check your local system time zone and set to UTC + 5:30 Asia/Kolkata"
      );
      return true;
    } else {
      return false;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (checkTimeZone()) return;

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    /* let s = restRequest('v1/login','post',$("#frm_login").serialize());
         console.log(s);
         /*if(s.errorcode=='200'){
 
         }*/
    setLoader(true);
    API.post("v1/admin/login", $("#frm_login").serialize())
      .then((res) => {
        if (res["data"].errorcode == "200") {
          //axios.defaults.headers.common.Authorization = `Bearer ${res['data'].api}`
          axios.defaults.headers.common["Api-Token"] = `${res["data"].api}`;
          context.saveLogin(
            res["data"].data,
            res["data"].api,
            res["data"].permissions,
            res["data"].cashbook
          );
          context.updateAcyear(res["data"].acyear);

          context.updateLogged();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      })
      .catch((er) => {});
  };

  if (context.logged == "yes") {
    history.push("/app");
    return null;
  } /*else if (context.isMobileView()) {
    return <MobileLoginView {...props} />;
  } */ else {
    return (
      <>
        <Helmet>
          <title>{appName}</title>
        </Helmet>
        <div className="container " style={{ marginTop: "6%" }}>
          <Row>
            <Col md={{ span: 4, offset: 4 }}>
              <Card className="shadow shadow-lg" data-aos="fade-up">
                <Card.Body className="px-4 py-5">
                  <Spin spinning={loader}>
                    <div className="text-center mb-30">
                      <img
                        src={VENDOR_LOGO}
                        className="bg-white rounded-3 mb-3"
                        style={{ width: "120px" }}
                      />
                      <div className="font-bold mb-3 header_company_title">
                        {upperCase(context.settingValue("print_header_name"))}
                      </div>
                    </div>
                    <Form
                      noValidate
                      id="frm_login"
                      method="post"
                      validated={validated}
                      onSubmit={handleFormSubmit}
                    >
                      <Row>
                        <Col md={12}>
                          <h6>Please login to your account</h6>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col md={12}>
                          <Form.Control
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="fw-bold"
                            autoFocus
                            required
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col md={12}>
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="fw-bold"
                            required
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3 text-end">
                        <Col md={12}>
                          <Button
                            type="submit"
                            variant="primary"
                            className="btn-block"
                          >
                            LOG IN
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Spin>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
};
export default withRouter(Login);
