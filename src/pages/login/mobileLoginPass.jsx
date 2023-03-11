import axios from "axios";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";
import PsContext from "../../context";
import { integerIndMobile, siteUrl } from "../../utils";
import { MOB_ICONS, MOB_LOGIN_TOP_BG } from "../../utils/data";
import { ServiceUrl } from "../../utils/serviceUrl";

const MobileLoginPass = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);

  const [validated, setValidated] = useState(false);

  const [serverResponse, setServerResponse] = useState([]);

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
      .post(ServiceUrl.MOB.VERIFY_LOGIN_OTP, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          axios.defaults.headers.common["Api-Token"] = `${res["data"].api}`;
          context.saveLogin(res["data"].data, res["data"].api, [], []);
          context.updateAcyear(res["data"].acyear);

          context.updateLogged();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const resetPass = () => {
    context.updateMobilePassword("");
    context.updateMobileUserId("");
  };

  useEffect(() => {
    setLoader(true);
    window.location.href = siteUrl + "mob";
  }, []);

  return (
    <>
      <Card className="bg-blue-100 border-0">
        <Card.Body style={{ minHeight: "200px" }}>
          <div style={{ paddingTop: "100px" }}>
            <h2 className="fw-bold">Screen Lock</h2>
            Enter lock Code
          </div>
          <img
            src={MOB_ICONS.SCREEN_LOCK_256.default}
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
          <input type="hidden" name="staff_uuid" value={context.mobileUserId} />
          <input type="hidden" name="device_name" value={"kalvisalai"} />
          <input type="hidden" name="device_build_id" value={"kalvisalai"} />

          <Row className="mt-3">
            <Col md={12}>
              <Form.Control
                type="password"
                name="otp"
                className="fw-bold"
                size="lg"
                placeholder="Screen Lock Code"
                autoFocus
                required
              />
              <Form.Control.Feedback type="invalid">
                Lock code is required
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
                {loader ? "Validating..." : "Validate"}
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
          <Row className="mt-4">
            <Col md={12} className="">
              <a
                style={{ textDecoration: "underline", color: "blue" }}
                onClick={(e) => resetPass()}
              >
                Forgot Password
              </a>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};
export default MobileLoginPass;
