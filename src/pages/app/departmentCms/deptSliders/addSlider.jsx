import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../../context";
import { CardFixedTop, getFileLiveUrl, upperCase } from "../../../../utils";
import { Spin } from "antd";

import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";
import FileBrowserModal from "../../fileManager/fileBrowserModal";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import ModuleAccess from "../../../../context/moduleAccess";

const AddSlider = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [showFileManager, setShowFileManager] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState("");

  const fileSelectedSuccess = (fList) => {
    setShowFileManager(false);
    setSelectedFiles(fList[0]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (selectedFiles.length < 1) {
      toast.error("Select a image to save");
      return;
    }

    if (!window.confirm("Do you want to save ?")) return;

    setLoader(true);
    axios
      .post(ServiceUrl.DEPT_CMS.SAVE_SLIDER, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          setSelectedFiles("");
          if (props.onSuccess) props.onSuccess();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <div className="">
      <Spin spinning={loader}>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <input
            type="hidden"
            name="academic_department"
            value={context.user.academic_department}
          />
          <input type="hidden" name="file_path" value={selectedFiles} />
          <Row className="mt-2">
            <Col md={4}>
              <ModuleAccess module="cms_file_manager" action="action_list">
                <Button
                  type="button"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => setShowFileManager(true)}
                >
                  <i className="fa-regular fa-folder-open"></i> Open File
                  Manager
                </Button>
              </ModuleAccess>
            </Col>
            <Col md={4}></Col>
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroup.Text>Display Order</InputGroup.Text>
                <Form.Control
                  type="number"
                  size="sm"
                  className="fw-bold"
                  name="display_order"
                  required
                />
              </InputGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={12}>
              <img src={getFileLiveUrl(selectedFiles, true)} />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={12} className="text-end">
              <hr />
              <LoaderSubmitButton
                type="submit"
                size="sm"
                loading={loader}
                text="Save Slider"
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
          onSuccess={fileSelectedSuccess}
        />
      )}
    </div>
  );
};

export default AddSlider;
