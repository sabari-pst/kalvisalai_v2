import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  Alert,
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../context";

import { Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../utils/serviceUrl";

import SearchStudent from "../feePayment/newFeePayment/searchStudent";
import StudentFilter from "../feePayment/newFeePayment/studentFilter";
import { MOB_ICONS } from "../../../utils/data";
import { getFileLiveUrl, momentDate } from "../../../utils";
import LoaderSubmitButton from "../../../utils/LoaderSubmitButton";

const LeftStudentEntry = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState([]);

  useEffect(() => {
    if (selectedStudent.uuid) {
      if (selectedStudent.isleft == "1") {
        toast.error("Student already marked as left");
        setSelectedStudent([]);
      }
    }
  }, [selectedStudent]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (!window.confirm("Do you want to save left entry ?")) return;
    setLoader(true);
    axios
      .post(ServiceUrl.STUDENTS.UPDATE_LEFT, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          setSelectedStudent([]);
          if (props.onSuccess) props.onSuccess();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const inputField = (label, name, value) => {
    return (
      <Row className="mt-2">
        <Col md={3}>
          <label>{label}</label>
        </Col>
        <Col md={9}>
          <Form.Control
            type="text"
            size="sm"
            className="fw-bold"
            name={name}
            value={value}
          />
        </Col>
      </Row>
    );
  };

  const studentPhoto = () => {
    if (selectedStudent.profile_photo)
      return getFileLiveUrl(selectedStudent.profile_photo);
    else return MOB_ICONS.NO_PHOTO_256.default;
  };

  return (
    <>
      {!selectedStudent.uuid && (
        <Row>
          <Col md={12}>
            <SearchStudent onSuccess={(d) => setSelectedStudent(d)} />
          </Col>
        </Row>
      )}

      {selectedStudent.uuid && (
        <Spin spinning={loader}>
          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <input type="hidden" name="id" value={selectedStudent.id} />
            <input type="hidden" name="uuid" value={selectedStudent.uuid} />
            <Row>
              <Col md={9}>
                {inputField(
                  "Register No",
                  "registerno",
                  selectedStudent.registerno
                )}

                {inputField(
                  "Admission No",
                  "admissionno",
                  selectedStudent.admissionno
                )}

                {inputField("Roll No", "rollno", selectedStudent.rollno)}
                {inputField(
                  "Name",
                  "name",
                  `${selectedStudent.name} ${
                    selectedStudent.initial != null
                      ? selectedStudent.initial
                      : ""
                  }`
                )}
                {inputField(
                  "Course",
                  "course",
                  `${selectedStudent.degree_name} - ${
                    selectedStudent.course_name
                  } (${selectedStudent.depty_type == "unaided" ? "SF" : "R"})`
                )}

                {inputField(
                  "Current Semester",
                  "semester",
                  selectedStudent.semester
                )}

                {inputField(
                  "Father Name",
                  "fathername",
                  selectedStudent.fathername
                )}

                <Row className="mt-3">
                  <Col md={3}>Left On</Col>
                  <Col md={9}>
                    <Form.Control
                      type="date"
                      size="sm"
                      name="lefton"
                      className="fw-bold"
                      max={momentDate(new Date(), "YYYY-MM-DD")}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col md={3}>Left Reason</Col>
                  <Col md={9}>
                    <Form.Control
                      as="textarea"
                      size="sm"
                      name="left_reason"
                      className="fw-bold"
                      rows="4"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={3}></Col>
                  <Col md={9}>
                    <LoaderSubmitButton
                      type="submit"
                      loading={loader}
                      size="md"
                      className="w-100"
                      text="Save Left Entry"
                    />
                  </Col>
                </Row>
              </Col>
              <Col md={3}>
                <img src={studentPhoto()} className="w-100 border" />
              </Col>
            </Row>
          </Form>
        </Spin>
      )}
    </>
  );
};

export default withRouter(LeftStudentEntry);
