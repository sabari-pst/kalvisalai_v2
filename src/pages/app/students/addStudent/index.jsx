import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { Spin } from "antd";
import { CardFixedTop } from "../../../../utils";
import PersonalInfo from "./personalInfo";
import AdmissionDetails from "./admissionDetails";
import FamilyDetails from "./familyDetails";
import PresentAddress from "./presentAddress";
import PermanentAddress from "./permanentAddress";
import GuardianDetails from "./guardianDetails";
import OtherDetails from "./otherDetails";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import StudentPhoto from "./studentPhoto";

const AddStudent = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState("single");
  const [pAddress, setPreAddress] = useState({});

  const [selectedCourse, setSelectedCourse] = useState([]);

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (props.location.params && props.location.params.selectedCourse)
      setSelectedCourse(props.location.params.selectedCourse);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!window.confirm("Do you want to save student admission?")) return;
    setLoader(true);
    axios
      .post(ServiceUrl.STUDENTS.SAVE_STUDENT, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          document.getElementById("frm_add_Student").reset();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const resetAll = () => {
    document.getElementById("frm_add_Student").reset();
  };

  return (
    <>
      <CardFixedTop title="Add Student">
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Link
              className="btn btn-white border-start ms-2"
              to={{
                pathname: "/app/students",
                params: { selectedCourse },
              }}
            >
              <i className="fa fa-arrow-left fs-5 px-1"></i> Back to List
            </Link>
          </li>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={resetAll}
            >
              <i className="fa fa-xmark fs-5 px-1"></i> Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container mt-3">
        <Spin spinning={loader}>
          <Form
            noValidate
            validated={validated}
            id="frm_add_Student"
            action=""
            method="post"
            encType="multipart/form-data"
            onSubmit={handleFormSubmit}
          >
            <Row>
              <Col md={9}>
                <AdmissionDetails />
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <StudentPhoto />
                </div>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={9}>
                <PersonalInfo onMaritalStatus={setMaritalStatus} />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <FamilyDetails married={maritalStatus == "married"} />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={6}>
                <PresentAddress
                  onAddressChange={(s) => {
                    console.log(s);
                    setPreAddress(s);
                  }}
                />
              </Col>
              <Col md={6}>
                <PermanentAddress />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={6}>
                <GuardianDetails />
              </Col>
              <Col md={6}>
                <OtherDetails />
              </Col>
            </Row>

            <Card className="card__fixed__bottom">
              <Card.Body>
                <div className="float-start text-danger">
                  Fields marked with (*) are required
                </div>
                <div className="float-end">
                  <a href="javascript:;" className="me-3 border-end pe-2">
                    Cancel
                  </a>
                  <LoaderSubmitButton
                    text="Save Student"
                    type="submit"
                    loading={loader}
                  />
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Spin>
      </div>
    </>
  );
};

export default withRouter(AddStudent);
