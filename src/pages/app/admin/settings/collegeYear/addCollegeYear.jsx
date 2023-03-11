import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Form, Row, Col, Button, Card } from "react-bootstrap";
import PsContext from "../../../../../context";
import { ServiceUrl } from "../../../../../utils/serviceUrl";
import axios from "axios";
import { Spin } from "antd";
import toast from "react-hot-toast";
import LoaderSubmitButton from "../../../../../utils/LoaderSubmitButton";

const AddCollegeYear = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  useEffect(() => {}, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setLoader(true);
    axios
      .post(ServiceUrl.SETTINGS.SAVE_COLLEGE_YEAR, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          setStartYear("");
          setEndYear("");
          if (props.afterFinish) props.afterFinish();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <>
      <Spin spinning={loader}>
        <Form
          noValidate
          validated={validated}
          method="post"
          id="frm_Add_CollegeYear_v2"
          onSubmit={handleFormSubmit}
        >
          <Row>
            <Col md={12}>
              <label>
                Start Year <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="number"
                size="sm"
                className="fw-bold"
                name="start_year"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label>
                End Year <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="number"
                size="sm"
                className="fw-bold"
                name="end_year"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label>
                College Year <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                name="college_year"
                value={`${startYear}-${endYear}`}
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label>
                Current Semester <span className="text-danger">*</span>
              </label>
              <Form.Control
                as="select"
                size="sm"
                className="fw-bold form-select form-select-sm"
                name="current_semester"
              >
                <option value="">None</option>
                <option value="1">ODD</option>
                <option value="0">EVEN</option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <div className="text-end">
                <a
                  className="border-end me-2 px-2"
                  onClick={(e) => props.onHide()}
                >
                  Cancel
                </a>
                <LoaderSubmitButton
                  type="submit"
                  text="Save"
                  loading={loader}
                />
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default AddCollegeYear;
