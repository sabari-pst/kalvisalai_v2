import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { Toast } from "antd-mobile";
import { toast } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import PsContext from "../../context";
import { baseUrl, integerIndMobile, siteUrl } from "../../utils";
import { MOB_ICONS, MOB_LOGIN_TOP_BG } from "../../utils/data";
import { ServiceUrl } from "../../utils/serviceUrl";
import MobileLoginPass from "./mobileLoginPass";
import MobileOtpVerify from "./mobileOtpVerify";
import { useEffect } from "react";

const MobileLoginView = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const history = useHistory();

  const [validated, setValidated] = useState(false);

  const [serverResponse, setServerResponse] = useState("");

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
      .post(ServiceUrl.MOB.CHECK_USERNAME, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          context.updateMobileUserId(res["data"].data);
          setServerResponse(res["data"].data);
        } else {
          //toast.error(res["data"].message || "Error");
          Toast.show({
            content: res["data"].message || "Error",
            position: "top",
          });
        }
        setLoader(false);
      });
  };

  useEffect(() => {
    setLoader(true);
    window.location.href = siteUrl + "mob";
  }, []);

  if (context.logged == "yes") {
    history.push("/mob/app");
    return null;
  } else if (
    context.mobileUserId &&
    context.mobileUserId.length > 4 &&
    context.mobilePass &&
    context.mobilePass.length > 1
  ) {
    return <MobileLoginPass />;
  } else if (serverResponse && serverResponse.length > 0) {
    return (
      <MobileOtpVerify
        onReset={(e) => setServerResponse([])}
        staffUuid={serverResponse}
      />
    );
  } else {
    return (
      <>
        <Card className="bg-blue-100 border-0">
          <Card.Body style={{ minHeight: "200px" }}>
            <div style={{ paddingTop: "100px" }}>
              <h2 className="fw-bold">Login</h2>
              Enter your mobile to continue
            </div>
            <img
              src={MOB_ICONS.KEY_256.default}
              className="mob_login_top_img"
            />
          </Card.Body>
        </Card>

        <div className="px-3 mt-5">
          <Form
            action=""
            method="post"
            noValidate
            validated={validated}
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="device_name" value={"kalvisalai"} />
            <input type="hidden" name="device_build_id" value={"kalvisalai"} />
            <input
              type="hidden"
              name="emp_mobile_password"
              value={context.mobPass}
            />
            <Row className="mt-3">
              <Col md={12}>
                <Form.Control
                  type="number"
                  name="mobile_no"
                  className="fw-bold"
                  size="lg"
                  placeholder="Mobile Number"
                  onKeyPress={integerIndMobile}
                  autoFocus
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Mobile Number is required
                </Form.Control.Feedback>
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
                  {loader ? "Validating..." : "Continue"}
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
      </>
    );
  }
};
export default MobileLoginView;
