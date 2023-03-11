import { Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { lowerCase, momentDate } from "../../../../utils";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import PsOffCanvasWindow from "../../../../utils/PsOffCanvasWindow";
import { ServiceUrl } from "../../../../utils/serviceUrl";

const MarkLongAbsent = (props) => {
  const [loader, setLoader] = useState(false);
  const [student, setStudent] = useState([]);
  const [validated, setValidated] = useState(false);

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (props.student && props.student.uuid) setStudent(props.student);
  }, [props.student]);

  const field = (fieldName) => {
    if (student[fieldName]) return student[fieldName];
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
      .post(ServiceUrl.STUDENTS.SAVE_LONG_ABSENT_STUDENT, new FormData(form))
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

  return (
    <div>
      <Spin spinning={loader}>
        <Form
          noValidate
          validated={validated}
          action=""
          method="post"
          onSubmit={handleFormSubmit}
        >
          <input type="hidden" name="student_uuid" value={field("uuid")} />
          <input type="hidden" name="course" value={field("course")} />
          <input
            type="hidden"
            name="section"
            value={lowerCase(field("section"))}
          />

          <Row>
            <Col md={6}>
              <label>Reg.No / Adm.No</label>
              <Form.Control
                type="text"
                name="registerno"
                className="fw-bold"
                size="sm"
                value={field("registerno")}
              />
            </Col>
            <Col md={6}>
              <label>Adm.No</label>
              <Form.Control
                type="text"
                name="admissionno"
                className="fw-bold"
                size="sm"
                value={field("admissionno")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label>Student Name</label>
              <Form.Control
                type="text"
                name="student_name"
                className="fw-bold"
                size="sm"
                value={field("name")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={6}>
              <label>Batch</label>
              <Form.Control
                type="text"
                name="academic_year"
                className="fw-bold"
                size="sm"
                value={field("batch")}
              />
            </Col>
            <Col md={6}>
              <label>Semester</label>
              <Form.Control
                type="text"
                name="semester"
                className="fw-bold"
                size="sm"
                value={field("semester")}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label>Course Name</label>
              <Form.Control
                type="text"
                name="course_name"
                className="fw-bold"
                size="sm"
                value={`${field("degree_name")} - ${field("course_name")} (${
                  field("dept_type") == "unaided" ? "SF" : "R"
                })`}
              />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <label>Date From</label>
              <Form.Control
                type="date"
                name="absent_from"
                className="fw-bold"
                size="sm"
                max={toDate}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </Col>
            <Col md={6}>
              <label>To Date</label>
              <Form.Control
                type="date"
                name="absent_to"
                className="fw-bold"
                size="sm"
                min={fromDate}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <label>Reason</label>
              <Form.Control as="textarea" rows="3" name="absent_reason" />
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
    </div>
  );
};
export default MarkLongAbsent;
