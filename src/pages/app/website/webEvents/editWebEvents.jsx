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
  momentDate,
  siteUrl,
  upperCase,
} from "../../../../utils";
import { AutoComplete, Spin } from "antd";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import ContentEditor from "../contentEditor";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";
import { listCategoryNames } from "../../../../models/cms";
import FileBrowserModal from "../../fileManager/fileBrowserModal";
import ModuleAccess from "../../../../context/moduleAccess";

const EditWebEvents = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const buttonRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [title, setTitle] = useState("");
  const [editSlug, setEditSlug] = useState(false);

  const [editorContent, setEditorContent] = useState("");

  const [addCat, setAddCat] = useState(false);
  const [catNames, setCatNames] = useState([]);

  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const [dataView, setDataView] = useState([]);

  const [showFileManager, setShowFileManager] = useState(false);

  useEffect(() => {
    loadData();
    loadCatNames();
  }, []);

  const loadCatNames = () => {
    setLoader(true);
    listCategoryNames("event").then((res) => {
      if (res) setCatNames(res);
      setLoader(false);
    });
  };

  const loadData = () => {
    setLoader(true);
    axios
      .get(ServiceUrl.WEBSITE_CMS.GET_PAGE + "?id=" + props.match.params.id)
      .then((res) => {
        if (res["data"].status == "1") {
          let d = res["data"].data;
          setTitle(d.title);
          setEditorContent(d.content_html);
          setSelectedCategoryName(d.category);
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

  const getCategoryOptions = () => {
    let rv = [];
    catNames.map((item, i) => {
      rv.push({ value: item.category });
    });
    return rv;
  };

  return (
    <>
      <CardFixedTop title="Edit Page">
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Link to="/app/web/events" className="btn btn-white border-start">
              <i className="fa-solid fa-arrow-left fs-5 px-1"></i> Back to
              Evetns
            </Link>
          </li>
          <li className="list-inline-item">
            <Button
              type="button"
              className="border-start"
              onClick={(e) => buttonRef.current.click()}
            >
              <i className="fa-solid fa-check fs-5 px-1"></i>Update Event
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container ">
        <Spin spinning={loader}>
          <Form
            id="frm_update_Event"
            noValidate
            validated={validated}
            action=""
            method="post"
            encType="mutipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="id" value={field("id")} />
            <input type="hidden" name="type" value="event" />
            <input type="hidden" name="category" value={selectedCategoryName} />

            <Row className="mt-2">
              <Col md={{ span: 10, offset: 1 }}>
                <Row>
                  <Col md={12}>
                    <label>
                      Event Title <span className="text-danger">*</span>
                    </label>
                    <Form.Control
                      type="text"
                      name="title"
                      className="fw-bold mt-2"
                      size="sm"
                      defaultValue={field("title")}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col md={4}>
                    <label>
                      Event Category <span className="text-danger">*</span>
                    </label>
                    <AutoComplete
                      style={{ width: "100%" }}
                      className="form-select form-select-sm"
                      options={getCategoryOptions()}
                      onChange={(v) => setSelectedCategoryName(v)}
                      value={selectedCategoryName}
                      filterOption={(inputValue, option) =>
                        upperCase(option.value).indexOf(
                          upperCase(inputValue)
                        ) !== -1
                      }
                    />
                  </Col>
                  <Col md={4}>
                    <label>
                      Event Start Date <span className="text-danger">*</span>
                    </label>
                    <Form.Control
                      type="date"
                      name="active_from_date"
                      size="sm"
                      className="fw-bold"
                      defaultValue={momentDate(
                        field("active_from_date"),
                        "YYYY-MM-DD"
                      )}
                      required
                    />
                  </Col>
                  <Col md={4}>
                    <label>
                      Event End Date <span className="text-danger">*</span>
                    </label>
                    <Form.Control
                      type="date"
                      name="active_to_date"
                      size="sm"
                      defaultValue={momentDate(
                        field("active_to_date"),
                        "YYYY-MM-DD"
                      )}
                      className="fw-bold"
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col md={12}>
                    <label>
                      Content <span className="text-danger">*</span>
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
                        Update Event
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

export default withRouter(EditWebEvents);
