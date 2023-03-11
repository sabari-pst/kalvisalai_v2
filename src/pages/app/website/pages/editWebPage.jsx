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
import FileBrowserModal from "../../fileManager/fileBrowserModal";
import ModuleAccess from "../../../../context/moduleAccess";

const EditWebPage = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const buttonRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [title, setTitle] = useState("");
  const [editSlug, setEditSlug] = useState(false);

  const [editorContent, setEditorContent] = useState("");

  const [dataView, setDataView] = useState([]);

  const [showFileManager, setShowFileManager] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    axios
      .get(ServiceUrl.WEBSITE_CMS.GET_PAGE + "?id=" + props.match.params.id)
      .then((res) => {
        if (res["data"].status == "1") {
          let d = res["data"].data;
          setTitle(d.title);
          setEditorContent(d.content_html);
          setDataView(d);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
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
      .post(ServiceUrl.WEBSITE_CMS.UPDATE_PAGE, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const field = (fieldName) => dataView[fieldName] || "";

  return (
    <>
      <CardFixedTop title="Edit Page">
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Link to="/app/web/pages" className="btn btn-white border-start">
              <i className="fa-solid fa-arrow-left fs-5 px-1"></i> Back to Pages
            </Link>
          </li>
          <li className="list-inline-item">
            <Button
              type="button"
              className="border-start"
              onClick={(e) => buttonRef.current.click()}
            >
              <i className="fa-solid fa-check fs-5 px-1"></i>Update Page
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container ">
        <Spin spinning={loader}>
          <Form
            id="frm_update_Page"
            noValidate
            validated={validated}
            action=""
            method="post"
            encType="mutipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="id" value={field("id")} />
            <input type="hidden" name="type" value="page" />

            <Row className="mt-2">
              <Col md={{ span: 10, offset: 1 }}>
                <Row>
                  <Col md={12}>
                    <label>
                      Page Title <span className="text-danger">*</span>
                    </label>
                    <Form.Control
                      type="text"
                      name="title"
                      className="fw-bold mt-2"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      required
                    />
                  </Col>
                </Row>
                <Row className="">
                  {editSlug && (
                    <Col md={12}>
                      <Form.Control
                        type="text"
                        name="title"
                        className="fw-bold mt-2"
                        required
                      />
                    </Col>
                  )}
                  {!editSlug && (
                    <>
                      <a href="javascript:;" className="mt-1">
                        {siteUrl} {makeUrl(title)}
                      </a>
                      <input
                        type="hidden"
                        name="seo_slug"
                        value={makeUrl(title)}
                      />
                    </>
                  )}
                </Row>

                <Row className="mt-2">
                  <Col md={12}>
                    <label>
                      Page Content <span className="text-danger">*</span>
                      <ModuleAccess
                        module="cms_file_manager"
                        action="action_list"
                      >
                        <Button
                          type="button"
                          size="sm"
                          onClick={(e) => setShowFileManager(true)}
                          className="mb-2 mx-3"
                        >
                          Open File Manager
                        </Button>
                      </ModuleAccess>
                    </label>
                    <ContentEditor
                      content={editorContent}
                      onEditorChange={(html) => setEditorContent(html)}
                    />
                    <input
                      type="hidden"
                      name="content_html"
                      value={editorContent}
                    />
                  </Col>
                </Row>

                <Card className="mt-3">
                  <Card.Header className="fw-bold">SEO Details</Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={12}>
                        <label>Meta Title</label>
                        <Form.Control
                          as="textarea"
                          rows="2"
                          className="fw-bold"
                          name="seo_meta_title"
                          defaultValue={field("seo_meta_title")}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={12}>
                        <label>Meta Description</label>
                        <Form.Control
                          as="textarea"
                          rows="4"
                          className="fw-bold"
                          name="seo_meta_description"
                          defaultValue={field("seo_meta_description")}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={12}>
                        <label>Meta Keywords</label>
                        <Form.Control
                          as="textarea"
                          rows="2"
                          className="fw-bold"
                          name="seo_meta_keywords"
                          defaultValue={field("seo_meta_keywords")}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Row className="mt-3 mb-4">
                  <Col md={12}>
                    <div className="text-center">
                      <Button
                        type="submit"
                        className="btn-block"
                        ref={buttonRef}
                      >
                        Update Page
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>

      {showFileManager && (
        <FileBrowserModal
          title="Fiel Manager"
          size="xl"
          show={showFileManager}
          onHide={(e) => setShowFileManager(false)}
        />
      )}
    </>
  );
};

export default withRouter(EditWebPage);
