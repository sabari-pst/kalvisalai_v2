import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";
import { liststDepartments } from "../../../../models/hr";
import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  upperCase,
} from "../../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { listCriteriaGroup } from "../../../../models/naac";
import { CustomDropDown } from "../../components";
import ContentEditor from "../../website/contentEditor";
import ModuleAccess from "../../../../context/moduleAccess";
import FileBrowserModal from "../../fileManager/fileBrowserModal";

const AddNaacSsrReport = (props) => {
  const context = useContext(PsContext);
  const buttonRef = useRef(null);

  const [stdepartments, setstDepartments] = useState([]);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [ssrGroups, setSsrGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);

  const [editorContent, setEditorContent] = useState("");

  const [showFileManager, setShowFileManager] = useState(false);

  useEffect(() => {
    setLoader(true);
    listCriteriaGroup("1").then((res) => {
      if (res) setSsrGroups(res.data);
      setLoader(false);
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setLoader(true);
    axios.post(ServiceUrl.NAAC.SAVE_REPORT, new FormData(form)).then((res) => {
      if (res["data"].status == "1") {
        document.getElementById("frm_save_naac_report").reset();
        if (props.onSuccess) props.onSuccess();

        toast.success(res["data"].message || "Success");
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const getInnerOptions = (items) => {
    let rv = [];
    items.map((item, i) => {
      rv.push({
        label: `${item.criteria_group_code}. - ${item.criteria_group_title}`,
        value: item.id,
      });
    });
    return rv;
  };
  const getOptions = () => {
    let s = groupByMultiple(ssrGroups, function (obj) {
      return [obj.criteria_id];
    });
    let rv = [];
    s.map((item, i) => {
      rv.push({
        label: `${upperCase(item[0].criteria_code)}. ${item[0].criteria_title}`,
        options: getInnerOptions(item),
      });
    });

    return rv;
  };

  const groupTitleChange = (v, l) => {
    setSelectedGroup(l);
  };

  return (
    <>
      <CardFixedTop title="Add SSR Report">
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Link
              className="btn btn-sm border-start ms-2 fs-6"
              to="/app/naac/ssr-report"
            >
              <i className="fa fa-xmark fs-6 px-1"></i> Cancel
            </Link>
          </li>

          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2 text-success"
              onClick={(e) => buttonRef.current.click()}
            >
              <i className="fa fa-check fs-6 px-1"></i> Save Report
            </Button>
          </li>
        </ul>
      </CardFixedTop>
      <div className="container py-3">
        <Spin spinning={loader}>
          <Form
            method="post"
            noValidate
            validated={validated}
            id="frm_save_naac_report"
            onSubmit={handleFormSubmit}
          >
            <input
              type="hidden"
              name="criteria_id"
              value={selectedGroup.criteria_id}
            />
            <input
              type="hidden"
              name="criteria_group_id"
              value={selectedGroup.id}
            />

            <Card>
              <Card.Header className="fw-bold">SSR Report Header</Card.Header>
              <Card.Body>
                <Row className="">
                  <Col md={2}>
                    <label>
                      Type <span className="text-danger">*</span>
                    </label>
                    <Form.Control
                      as="select"
                      name="report_type"
                      className="fw-bold form-select form-select-sm text-uppercase"
                      size="sm"
                      required
                    >
                      <option value="">-Select-</option>
                      <option value="qnm">qnm</option>
                      <option value="qlm">qlm</option>
                    </Form.Control>
                  </Col>
                  <Col md={10}>
                    <label>
                      Group Title <span className="text-danger">*</span>
                    </label>
                    <CustomDropDown
                      dataSource={ssrGroups}
                      options={getOptions()}
                      value="id"
                      displayField={(item) =>
                        `${item.degreename} - ${item.name}`
                      }
                      onChange={groupTitleChange}
                      defaultOption={false}
                      className="fw-bold"
                      style={{ fontSize: "15px" }}
                    />
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col md={2}>
                    <label>
                      Code <span className="text-danger">*</span>
                    </label>
                    <Form.Control
                      type="text"
                      name="report_code"
                      className="fw-bold"
                      step="any"
                      size="sm"
                      placeholder="1.1.1"
                      required
                    />
                  </Col>
                  <Col md={10}>
                    <label>
                      Report Title<span className="text-danger">*</span>
                    </label>
                    <Form.Control
                      type="text"
                      name="report_title"
                      size="sm"
                      className="fw-bold"
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col md={2}>
                    <label>
                      Show in Menu<span className="text-danger"></span>
                    </label>
                    <Form.Control
                      as="select"
                      size="sm"
                      className="fw-bold form-select form-select-sm"
                      name="show_in_menu"
                      required
                    >
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </Form.Control>
                  </Col>
                  <Col md={10}>
                    <label>
                      Page Title<span className="text-danger"></span>
                    </label>
                    <Form.Control
                      type="text"
                      name="page_title"
                      size="sm"
                      className="fw-bold"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mt-3">
              <Card.Header className="fw-bold ">
                SSR Content
                <div className="float-end">
                  <ModuleAccess module="cms_file_manager" action="action_list">
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => setShowFileManager(true)}
                      className="mb-2 mx-3"
                    >
                      Open File Manager
                    </Button>
                  </ModuleAccess>
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mt-2">
                  <Col md={12}>
                    <ContentEditor
                      initialValue={editorContent}
                      onEditorChange={(html) => setEditorContent(html)}
                    />
                    <input
                      type="hidden"
                      name="report_content"
                      value={editorContent}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Row className="mt-4">
              <Col md={12}>
                <div className="text-end">
                  <a
                    onClick={(e) => props.onHide()}
                    className="me-2 border-end pe-2"
                  >
                    Cancel
                  </a>
                  <Button type="submit" size="sm" ref={buttonRef}>
                    Save Report
                  </Button>
                </div>
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

export default withRouter(AddNaacSsrReport);
