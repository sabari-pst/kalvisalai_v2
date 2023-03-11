import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../../context";
import {
  CardFixedTop,
  customSorting,
  getFileLiveUrl,
  groupByMultiple,
  upperCase,
  yearByBatch,
} from "../../../../utils";
import { Image, Spin } from "antd";

import {
  Card,
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  ButtonGroup,
} from "react-bootstrap";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";

import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { listBatches } from "../../../../models/academicYears";
import { COURSE_TYPE_SORT_ORDER } from "../../../../utils/data";
import FileBrowserModal from "../../fileManager/fileBrowserModal";
import ModuleAccess from "../../../../context/moduleAccess";
import PsModalWindow from "../../../../utils/PsModalWindow";

const AddSyllabus = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [academics, setAcademics] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedAcademic, setSelectedAcademic] = useState("");

  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState("");

  useEffect(() => {
    loadAcademics();
  }, []);

  const fileSelectedSuccess = (fList) => {
    setShowFileManager(false);
    setSelectedFiles(fList[0]);
  };

  const loadAcademics = () => {
    setLoader(true);

    listBatches("1").then((res) => {
      if (res) {
        res = customSorting(res, COURSE_TYPE_SORT_ORDER, "type");

        let d = groupByMultiple(res, function (obj) {
          return [obj.type];
        });
        setAcademics(res);
        setCourseTypes(d);
      }
      setLoader(false);
    });
  };

  const courseTypeChange = (e) => {
    let m = academics.filter(
      (item) => upperCase(item.type) == upperCase(e.target.value)
    );
    setAcademicYear(m);
    setSelectedType(e.target.value);
  };

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
      .post(ServiceUrl.DEPT_CMS.SAVE_FILE, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          setSelectedFiles("");
          form.reset();

          if (props.onSuccess) props.onSuccess();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <div>
      <PsModalWindow {...props}>
        <Spin spinning={loader}>
          <Form
            action=""
            method="post"
            noValidate
            validated={validated}
            onSubmit={handleFormSubmit}
          >
            <input type="hidden" name="row_type" value={props.rowType} />
            <input
              type="hidden"
              name="academic_department"
              value={context.user.academic_department}
            />
            <Row>
              <Col md={12}>
                <label>Department </label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold"
                  value={`${context.user.academic_department_name} - ${
                    context.user.academic_department_type == "aided"
                      ? "R"
                      : "SF"
                  }`}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={6}>
                <label>
                  Course Type <span className="text-danger">*</span>
                </label>
                <Form.Control
                  as="select"
                  className="fw-bold form-select form-select-sm"
                  onChange={(e) => courseTypeChange(e)}
                  name="course_type"
                  required
                >
                  <option value="">-Select-</option>
                  {courseTypes.map((item) => (
                    <option value={item[0].type}>
                      {upperCase(item[0].type)}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col md={6}>
                <label>
                  Batch <span className="text-danger">*</span>
                </label>
                <Form.Control
                  as="select"
                  className="fw-bold form-select form-select-sm"
                  onChange={(e) => setSelectedAcademic(e.target.value)}
                  name="batch"
                  required
                >
                  <option value="">-Select-</option>
                  {academicYear.map((item) => (
                    <option value={item.batch}>
                      {yearByBatch(item.batch, item.no_of_semesters)}{" "}
                      {item.batch}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12}>
                <label>
                  File Title <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold"
                  name="file_title"
                  required
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={12}>
                <label>
                  File Path <span className="text-danger">*</span>
                  <ModuleAccess module="cms_file_manager" action="action_list">
                    <Button
                      size="sm"
                      type="button"
                      className="ms-2"
                      onClick={(e) => setShowFileManager(true)}
                    >
                      Open file manager
                    </Button>
                  </ModuleAccess>
                </label>
                <InputGroup size="sm" className="mt-2">
                  <Form.Control
                    type="text"
                    size="sm"
                    className="fw-bold"
                    name="file_path"
                    value={selectedFiles}
                    required
                  />
                  <InputGroup.Text className="cursor-pointer">
                    <i className="fa-solid fa-download"></i>
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12} className="text-end">
                <hr />
                <a
                  onClick={(e) => props.onHide()}
                  className="pe-2 me-2 border-end"
                >
                  Cancel
                </a>
                <LoaderSubmitButton
                  type="submit"
                  loading={loader}
                  text="Save Data"
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
      </PsModalWindow>
    </div>
  );
};

export default withRouter(AddSyllabus);
