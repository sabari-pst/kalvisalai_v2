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
  getFileLiveUrl,
  makeUrl,
  momentDate,
  siteUrl,
} from "../../../../utils";
import { Spin, Image } from "antd";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import ContentEditor from "../contentEditor";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";
import PsModalWindow from "../../../../utils/PsModalWindow";
import FileBrowserModal from "../../fileManager/fileBrowserModal";

const EditSlider = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const buttonRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [showFileManager, setShowFileManager] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState("");

  useEffect(() => {
    setSelectedFiles(props.dataSource.feature_image);
  }, []);

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
      .post(ServiceUrl.WEBSITE_CMS.UPDATE_PAGE, new FormData(form))
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

  const fileSelectedSuccess = (fList) => {
    setShowFileManager(false);
    setSelectedFiles(fList[0]);
  };

  const field = (fieldName) => props.dataSource[fieldName] || "";

  return (
    <>
      <PsModalWindow {...props}>
        <Spin spinning={loader}>
          <Form
            id="frm_update_slider"
            noValidate
            validated={validated}
            action=""
            method="post"
            encType="mutipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="type" value="slider" />
            <input type="hidden" name="id" value={field("id")} />

            <input type="hidden" name="feature_image" value={selectedFiles} />

            <Row>
              <Col md={10}>
                <label>
                  Title <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="text"
                  name="title"
                  className="fw-bold mt-2"
                  placeholder="Slider Title"
                  defaultValue={field("title")}
                  required
                />
              </Col>
              <Col md={2}>
                <label>
                  Order <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="number"
                  name="row_order"
                  className="fw-bold mt-2"
                  placeholder="Slider Order"
                  defaultValue={field("row_order")}
                  required
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={4}>
                <Button
                  type="button"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => setShowFileManager(true)}
                >
                  <i className="fa-regular fa-folder-open"></i> Open File
                  Manager
                </Button>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12}>
                <Image
                  src={getFileLiveUrl(selectedFiles)}
                  style={{ maxHeight: "220px" }}
                  preview={true}
                />
              </Col>
            </Row>

            <Row className="mt-3 mb-4">
              <Col md={12}>
                <div className="text-end">
                  <Button type="submit" className="" ref={buttonRef}>
                    <i className="fa-solid fa-check me-2 fs-6"></i>Update
                    Gallery
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </PsModalWindow>

      {showFileManager && (
        <FileBrowserModal
          title="Fiel Manager"
          size="xl"
          show={showFileManager}
          onHide={(e) => setShowFileManager(false)}
          multipleSelect={true}
          onSuccess={fileSelectedSuccess}
        />
      )}
    </>
  );
};

export default EditSlider;
