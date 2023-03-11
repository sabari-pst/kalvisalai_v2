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

const EditGallery = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const buttonRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [showFileManager, setShowFileManager] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    const form = new FormData();
    form.append("category", props.dataSource.category);
    axios.post(ServiceUrl.WEBSITE_CMS.LIST_GALLERY, form).then((res) => {
      if (res["data"].status == "1") {
        let d = res["data"].data;
        let s = [...selectedFiles];
        d.map((item, i) => {
          s.push({
            id: item.id,
            feature_image: item.feature_image,
            content: item.content,
            row_order: item.row_order,
          });
        });
        setSelectedFiles(s);
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

    if (selectedFiles.length < 1) {
      toast.error("Select a image to save");
      return;
    }

    if (!window.confirm("Do you want to save ?")) return;

    setLoader(true);
    axios
      .post(ServiceUrl.WEBSITE_CMS.UPDATE_GALLERY, new FormData(form))
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
    let s = [...selectedFiles];
    fList.map((item, i) => {
      s.push({
        feature_image: item,
        content: "",
        row_order: s.length + 1,
      });
    });
    setSelectedFiles(s);
  };

  /* useEffect(() => {
    let s = selectedFiles.sort(getAscSortOrder("row_order"));
    setSelectedFiles(s);
  }, [JSON.stringify(selectedFiles)]);*/

  const handleDeleteClick = (item) => {
    if (!window.confirm("Do you want to remove?")) return;
    let s = [...selectedFiles];
    s = s.filter((obj) => obj.feature_image != item.feature_image);
    setSelectedFiles(s);
  };

  const handleOrderChange = (item, e) => {
    let s = [...selectedFiles];
    let index = s.findIndex((obj) => obj.feature_image == item.feature_image);
    if (index > -1) {
      s[index]["row_order"] = e.target.value;
      setSelectedFiles(s);
    }
  };
  const handleTitleChange = (item, e) => {
    let s = [...selectedFiles];
    let index = s.findIndex((obj) => obj.feature_image == item.feature_image);
    if (index > -1) {
      s[index]["content"] = e.target.value;
      setSelectedFiles(s);
    }
  };

  const field = (fieldName) => props.dataSource[fieldName] || "";

  return (
    <>
      <PsModalWindow {...props}>
        <Spin spinning={loader}>
          <Form
            id="frm_update_gallery"
            noValidate
            validated={validated}
            action=""
            method="post"
            encType="mutipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="type" value="gallery" />
            <input type="hidden" name="id" value={field("id")} />
            <input type="hidden" name="category" value={field("category")} />

            <input
              type="hidden"
              name="gallery"
              value={JSON.stringify(selectedFiles)}
            />

            <Row>
              <Col md={10}>
                <Form.Control
                  type="text"
                  name="title"
                  className="fw-bold mt-2"
                  placeholder="Gallery Title"
                  defaultValue={field("title")}
                  required
                />
              </Col>
              <Col md={2}>
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
            <div style={{ minHeight: "200px" }}>
              <Row className="mt-2 bg-light fw-bold">
                <Col md={2}>Image</Col>
                <Col md={8}>Image Title</Col>
                <Col md={1}>Order</Col>
                <Col md={1}>Action</Col>
              </Row>

              {selectedFiles.map((item, i) => {
                return (
                  <Row className="mt-2">
                    <Col md={2} className="text-center">
                      <Image
                        src={getFileLiveUrl(item.feature_image)}
                        style={{ maxHeight: "100px" }}
                        preview={true}
                      />
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="text"
                        className="fw-bold"
                        size="sm"
                        value={item.content}
                        onChange={(e) => handleTitleChange(item, e)}
                      />
                    </Col>
                    <Col md={1}>
                      <Form.Control
                        type="number"
                        className="fw-bold"
                        size="sm"
                        value={item.row_order}
                        onChange={(e) => handleOrderChange(item, e)}
                      />
                    </Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        size="sm"
                        variant="white"
                        onClick={(e) => handleDeleteClick(item)}
                      >
                        <i className="fa-regular fa-trash-can fs-6"></i>
                      </Button>
                    </Col>
                  </Row>
                );
              })}
            </div>
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

export default EditGallery;
