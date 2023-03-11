import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../../context";
import { CardFixedTop, getFileLiveUrl, upperCase } from "../../../../utils";
import { Image, Spin } from "antd";

import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";
import DepartmentCmsLayout from "../departmentCmsLayout";

import ModuleAccess from "../../../../context/moduleAccess";
import ContentEditor from "../../website/contentEditor";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { getDepartmentPage } from "../../../../models/cms";
import FileBrowserModal from "../../fileManager/fileBrowserModal";

const DeptAwards = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [editorContent, setEditorContent] = useState("");
  const [showFileManager, setShowFileManager] = useState(false);
  const pageId = "awards";

  useEffect(() => {
    if (context.user.academic_department) loadData();
  }, [JSON.stringify(context.user)]);

  const loadData = () => {
    setLoader(true);
    setEditorContent("");
    getDepartmentPage(
      "academic_department=" +
        context.user.academic_department +
        "&page_id=" +
        pageId
    ).then((res) => {
      console.log(res);
      if (res.status == "1") {
        setDataList(res.data);
        setEditorContent(res.data.page_content);
      }
      setLoader(false);
    });
  };

  const field = (fieldName) => {
    return dataList?.[fieldName];
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!context.allowedAccess("dept_cms_awards", "action_update")) return;

    if (!window.confirm("Do you want to save ?")) return;
    setLoader(true);
    axios
      .post(ServiceUrl.DEPT_CMS.SAVE_PAGE, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <DepartmentCmsLayout>
      <CardFixedTop title="Awards">
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={(e) => loadData()}
            >
              <i className="fa-solid fa-rotate-right fs-6 px-1"></i> Refresh
            </Button>
          </li>
        </ul>
      </CardFixedTop>
      <div className="container py-3">
        <Spin spinning={loader}>
          <Form onSubmit={handleFormSubmit}>
            <input
              type="hidden"
              name="academic_department"
              value={context.user.academic_department}
            />
            <input type="hidden" name="page_id" value={pageId} />
            <Row className="mt-2">
              <Col md={6}>
                <label>Title</label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold"
                  name="page_title"
                  defaultValue={field("page_title")}
                  required
                />
              </Col>
              <Col md={3} className="mt-4">
                <Form.Check
                  type="checkbox"
                  label="Display in website"
                  name="show_in_page"
                />
              </Col>
              <Col md={3} className="mt-4">
                <div className="text-end">
                  <ModuleAccess module="dept_cms_awards" action="action_update">
                    <LoaderSubmitButton
                      type="submit"
                      loading={loader}
                      text={
                        <>
                          <i className="fa-solid fa-check me-2"></i> Save
                          Content
                        </>
                      }
                    />
                  </ModuleAccess>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <label>
                  Content
                  <ModuleAccess module="cms_file_manager" action="action_list">
                    <Button
                      size="sm"
                      type="button"
                      variant="outline-secondary"
                      className="ms-3"
                      onClick={(e) => setShowFileManager(true)}
                    >
                      <i className="fa-regular fa-folder-open me-2"></i> Open
                      File Manager
                    </Button>
                  </ModuleAccess>
                </label>
              </Col>
              <Col md={12} className="mt-3">
                <ContentEditor
                  content={editorContent}
                  onEditorChange={(html) => setEditorContent(html)}
                />
                <input
                  type="hidden"
                  name="page_content"
                  value={editorContent}
                />
              </Col>
            </Row>
          </Form>
        </Spin>

        {showFileManager && (
          <FileBrowserModal
            title="Fiel Manager"
            size="xl"
            show={showFileManager}
            onHide={(e) => setShowFileManager(false)}
          />
        )}
      </div>
    </DepartmentCmsLayout>
  );
};

export default withRouter(DeptAwards);
