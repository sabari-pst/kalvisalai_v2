import { Spin } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";

import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Link, withRouter } from "react-router-dom";
import PsContext from "../../../../context";
import ModuleAccess from "../../../../context/moduleAccess";
import { getStudentTemplate } from "../../../../models/utilities";
import { CardFixedTop, momentDate, upperCase } from "../../../../utils";
import { PAGE_LAYOUT, PAGE_SIZE } from "../../../../utils/data";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import ContentEditor from "../../website/contentEditor";

const EditStudentCertificate = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);

  const buttonRef = useRef(null);

  const [dataList, setDataList] = useState([]);
  const [editorContent, setEditorContent] = useState("");

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    getStudentTemplate(props.match.params.id).then((res) => {
      if (res) {
        setDataList(res);
        setEditorContent(res.certificate_content);
      }
      setLoader(false);
    });
  };

  const field = (fieldName) => {
    return dataList && dataList[fieldName];
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!window.confirm("Do you want to update ?")) return;
    setLoader(true);
    axios
      .post(ServiceUrl.UTILITIES.UPDATE_STUDENT_CERTIFICATE, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1")
          toast.success(res["data"].message || "Success");
        else toast.error(res["data"].message || "Error");
        setLoader(false);
      });
  };

  return (
    <>
      <CardFixedTop
        title={
          <>
            Edit Student Certificate | <i>{field("certificate_title")}</i>
          </>
        }
      >
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Link
              to="/app/uti/student-certificates"
              className="btn btn-sm btn-transparent border-start fs-6 me-2 border-end"
            >
              <i className="fa-solid fa-xmark px-2"></i> Cancel
            </Link>
          </li>
          <li className="list-inline-item">
            <Button
              type="button"
              size="sm"
              className="border-start"
              onClick={(e) => buttonRef.current.click()}
            >
              <i className="fa-solid fa-check fs-6 px-1"></i>Update
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container py-2">
        <Spin spinning={loader}>
          <Form
            noValidate
            validated={validated}
            action=""
            method="post"
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="id" value={field("id")} />

            <Row className="my-2">
              <Col md={3}>
                <InputGroup size="sm">
                  <InputGroup.Text>Page Size</InputGroup.Text>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="page_size"
                    required
                  >
                    {PAGE_SIZE.map((item) => (
                      <option
                        value={item}
                        selected={item == field("page_size") ? "selected" : ""}
                      >
                        {upperCase(item)}
                      </option>
                    ))}
                  </Form.Control>
                </InputGroup>
              </Col>
              <Col md={3}>
                <InputGroup size="sm">
                  <InputGroup.Text>Page Layout</InputGroup.Text>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    size="sm"
                    name="page_layout"
                    required
                  >
                    {PAGE_LAYOUT.map((item) => (
                      <option
                        value={item}
                        selected={
                          item == field("page_layout") ? "selected" : ""
                        }
                      >
                        {upperCase(item)}
                      </option>
                    ))}
                  </Form.Control>
                </InputGroup>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={12}>
                <ContentEditor
                  content={editorContent}
                  onEditorChange={(html) => setEditorContent(html)}
                />
                <input
                  type="hidden"
                  name="certificate_content"
                  value={editorContent}
                />
              </Col>
            </Row>

            <Row className="mt-3 mb-4">
              <Col md={12}>
                <div className="text-end">
                  <Button type="submit" size="sm" ref={buttonRef}>
                    <i className="fa-solid fa-check fs-6 px-1"></i>Update
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    </>
  );
};
export default withRouter(EditStudentCertificate);
