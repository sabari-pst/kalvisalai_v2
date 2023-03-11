import { Image, Spin } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import {
  getFileLiveUrl,
  momentDate,
  semesterValue,
  upperCase,
} from "../../../../utils";
import { SELECT_USER_PHOTO } from "../../../../utils/data";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import SearchStudent from "../../feePayment/newFeePayment/searchStudent";

const HostelAdmission = (props) => {
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState([]);

  const onStudentSelectSuccess = (stu) => {
    if (stu.is_hosteller == "1") {
      toast.error("Student already in hostel");
      return;
    }
    setSelectedStudent(stu);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() == false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (!window.confirm("Do you want to save ?")) return;
    setLoader(true);
    axios
      .post(ServiceUrl.STUDENTS.SAVE_HOSTEL_ADMISSION, new FormData(form))
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

  return (
    <>
      {!selectedStudent.uuid && (
        <SearchStudent onSuccess={(s) => onStudentSelectSuccess(s)} />
      )}

      {selectedStudent.uuid && (
        <>
          <Spin spinning={loader}>
            <Form
              action=""
              method="post"
              noValidate
              validated={validated}
              onSubmit={handleFormSubmit}
              className="mb-5"
            >
              <input type="hidden" name="uuid" value={selectedStudent.uuid} />
              <input
                type="hidden"
                name="semester"
                value={selectedStudent.semester}
              />

              <Row>
                <Col md={9}>
                  <Row>
                    <Col md={3}>
                      <label>Reg. No / Adm. No</label>
                    </Col>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="registerno"
                        value={
                          selectedStudent.registerno ||
                          selectedStudent.admissionno
                        }
                        className="fw-bold"
                        size="sm"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col md={3}>
                      <label>Student Name</label>
                    </Col>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="name"
                        size="sm"
                        value={`${selectedStudent.name} ${
                          selectedStudent.initial || ""
                        }`}
                        className="fw-bold"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col md={3}>
                      <label>Course</label>
                    </Col>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="course_name"
                        size="sm"
                        value={`${selectedStudent.degree_name}-${
                          selectedStudent.course_name
                        } (${
                          selectedStudent.dept_type == "aided" ? "R" : "SF"
                        })`}
                        className="fw-bold"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col md={3}>
                      <label>Batch / Sem</label>
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        type="text"
                        name="batch"
                        size="sm"
                        value={upperCase(selectedStudent.batch)}
                        className="fw-bold"
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        name="sem"
                        size="sm"
                        value={semesterValue(selectedStudent.semester)}
                        className="fw-bold"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col md={3}>
                      <label>Gender / DOB</label>
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        type="text"
                        name="gender"
                        value={upperCase(selectedStudent.gender)}
                        className="fw-bold"
                        size="sm"
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        name="dob"
                        size="sm"
                        value={momentDate(selectedStudent.dob, "DD/MMM/YYYY")}
                        className="fw-bold"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col md={3}>
                      <label>Father Name</label>
                    </Col>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="fathername"
                        size="sm"
                        value={selectedStudent.fathername}
                        className="fw-bold"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col md={3}>
                      <label>Address</label>
                    </Col>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="address"
                        size="sm"
                        value={`${selectedStudent.street_permanent || ""}${
                          selectedStudent.village_permanent || ""
                        }
                          ${selectedStudent.district_permanent || ""}`}
                        className="fw-bold"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={3}>
                      <label>
                        Joining Date <span className="text-danger">*</span>
                      </label>
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        type="date"
                        max={momentDate(new Date(), "YYYY-MM-DD")}
                        name="joining_date"
                        className="fw-bold"
                        size="sm"
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col md={3}>
                      <label>
                        Floor / Room <span className="text-danger">*</span>
                      </label>
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        type="text"
                        name="floor_no"
                        className="fw-bold"
                        placeholder="Floor No"
                        size="sm"
                      />
                    </Col>
                    <Col md={4} className="text-end">
                      <Form.Control
                        type="text"
                        name="room_no"
                        className="fw-bold"
                        placeholder="Room No"
                        size="sm"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col md={8}></Col>
                    <Col md={4} className="text-end">
                      <LoaderSubmitButton
                        type="submit"
                        text="Save Hostel Admission"
                        loading={loader}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col md={3}>
                  <Image
                    src={getFileLiveUrl(selectedStudent.profile_photo)}
                    fallback={SELECT_USER_PHOTO}
                  />
                </Col>
              </Row>
            </Form>
          </Spin>
        </>
      )}
    </>
  );
};

export default HostelAdmission;
