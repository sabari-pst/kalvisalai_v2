import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../context";
import { CardFixedTop, formToObject, makeUrl, siteUrl } from "../../../utils";
import { Spin } from "antd";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { ServiceUrl } from "../../../utils/serviceUrl";
import { toast } from "react-hot-toast";
import PsModalWindow from "../../../utils/PsModalWindow";

const AddContentCategory = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const buttonRef = useRef(null);
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

    if (!window.confirm("Do you want to save ?")) return;

    setLoader(true);
    axios
      .post(ServiceUrl.WEBSITE_CMS.SAVE_PAGE, new FormData(form))
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
            id="frm_add_Announcement"
            noValidate
            validated={validated}
            action=""
            method="post"
            encType="mutipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="type" value={props.type} />

            <Row>
              <Col md={12}>
                <label>
                  Title <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="text"
                  name="title"
                  className="fw-bold mt-2"
                  required
                />
              </Col>
            </Row>

            <Row className="mt-3 mb-4">
              <Col md={12}>
                <div className="text-center">
                  <Button type="submit" className="btn-block" ref={buttonRef}>
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </PsModalWindow>
    </>
  );
};

export default AddContentCategory;
