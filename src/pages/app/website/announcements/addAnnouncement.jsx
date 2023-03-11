import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../../context";
import {
  CardFixedTop,
  formToObject,
  makeUrl,
  siteUrl,
} from "../../../../utils";
import { Spin } from "antd";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import ContentEditor from "../contentEditor";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";
import PsModalWindow from "../../../../utils/PsModalWindow";

const AddAnnouncement = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const buttonRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [title, setTitle] = useState("");
  const [editSlug, setEditSlug] = useState(false);
  const [topScroll, setTopScroll] = useState(false);

  const [editorContent, setEditorContent] = useState("");

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
          document.getElementById("frm_add_Announcement").reset();
          setTitle("");
          setEditSlug("");
          setEditorContent("");
          setTopScroll(false);

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
            <input type="hidden" name="type" value="announcement" />

            <Row>
              <Col md={9}>
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
              <Col md={3}>
                <label>
                  Expired On <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="date"
                  name="active_to_date"
                  className="fw-bold mt-2"
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12}>
                <label>
                  Page Content <span className="text-danger">*</span>
                </label>
                <ContentEditor
                  initialValue={editorContent}
                  onEditorChange={(html) => setEditorContent(html)}
                  editorHeight="300px"
                />
                <input
                  type="hidden"
                  name="content_html"
                  value={editorContent}
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={3}>
                <Form.Check
                  type="switch"
                  label="Show on Top Scroll"
                  name="show_on_top_scroll"
                  value="1"
                  onChange={(e) => setTopScroll(!topScroll)}
                  checked={topScroll}
                />
                {topScroll && (
                  <Form.Check
                    type="switch"
                    label="Show new gif image"
                    name="show_new_blink_img"
                    value="1"
                  />
                )}
              </Col>
              {topScroll && (
                <Col md={9}>
                  <label>
                    Click url for top link
                    <span className="text-danger"></span>
                  </label>
                  <Form.Control
                    type="text"
                    name="seo_slug"
                    className="fw-bold mt-2"
                  />
                </Col>
              )}
            </Row>

            <Row className="mt-3 mb-4">
              <Col md={12}>
                <div className="text-center">
                  <Button type="submit" className="btn-block" ref={buttonRef}>
                    Save Announcement
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

export default AddAnnouncement;
