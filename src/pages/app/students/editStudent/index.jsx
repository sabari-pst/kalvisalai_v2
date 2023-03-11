import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { Spin } from "antd";
import { CardFixedTop, upperCase } from "../../../../utils";

import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";

import PersonalInfo from "../addStudent/personalInfo";
import FamilyDetails from "../addStudent/familyDetails";
import PresentAddress from "../addStudent/presentAddress";
import PermanentAddress from "../addStudent/permanentAddress";
import GuardianDetails from "../addStudent/guardianDetails";
import OtherDetails from "../addStudent/otherDetails";
import AdmissionDetails from "./admissionDetails";
import { Field } from "rc-field-form";
import StudentPhoto from "../addStudent/studentPhoto";

const EditStudent = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState("single");
  const [pAddress, setPreAddress] = useState({});

  const [selectedCourse, setSelectedCourse] = useState([]);

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setMaritalStatus(field("maritalstatus"));
  }, []);

  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!window.confirm("Do you want to save save changes?")) return;
    setLoader(true);
    axios
      .post(ServiceUrl.STUDENTS.UPDATE_STUDENT, new FormData(form))
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

  const resetAll = () => {
    document.getElementById("frm_edit_Student").reset();
  };

  return (
    <>
      <Spin spinning={loader}>
        <Form
          noValidate
          validated={validated}
          id="frm_edit_Student"
          action=""
          method="post"
          encType="multipart/form-data"
          onSubmit={handleFormSubmit}
        >
          <input type="hidden" name="id" value={field("id")} />
          <input type="hidden" name="uuid" value={field("uuid")} />
          <Row>
            <Col md={9}>
              <AdmissionDetails {...props} />
            </Col>
            <Col md={3}>
              <div className="text-center">
                <StudentPhoto profilePhoto={field("profile_photo")} />
              </div>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={9}>
              <PersonalInfo onMaritalStatus={setMaritalStatus} {...props} />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <FamilyDetails married={maritalStatus == "married"} {...props} />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <PresentAddress
                onAddressChange={(s) => {
                  setPreAddress(s);
                }}
                {...props}
              />
            </Col>
            <Col md={6}>
              <PermanentAddress {...props} />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <GuardianDetails {...props} />
            </Col>
            <Col md={6}>
              <OtherDetails {...props} />
            </Col>
          </Row>

          <Card className="card__fixed__bottom">
            <Card.Body>
              <div className="float-start text-danger">
                Fields marked with (*) are required
              </div>
              <div className="float-end">
                <a
                  href="javascript:;"
                  className="me-3 border-end pe-2"
                  onClick={() => {
                    if (props.onHide) props.onHide();
                  }}
                >
                  Cancel
                </a>
                <LoaderSubmitButton
                  text="Update Changes"
                  type="submit"
                  loading={loader}
                />
              </div>
            </Card.Body>
          </Card>
        </Form>
      </Spin>
    </>
  );
};

export default withRouter(EditStudent);
