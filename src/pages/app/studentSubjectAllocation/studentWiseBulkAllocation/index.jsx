import { Spin } from "antd";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import PsContext from "../../../../context";
import ModuleAccess from "../../../../context/moduleAccess";
import { CardFixedTop, upperCase } from "../../../../utils";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";

const StudentWiseBulkAllocation = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);

  const [otherDept, setOtherDept] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [newSubject, setNewSubject] = useState([]);

  const [subjects, setSubjects] = useState([]);

  const getTitle = () => {
    if (selectedCourse && selectedCourse.course_id) {
      return `Student Wise Subject Allocation > ${
        selectedCourse.academic_year
      } > ${selectedCourse.course_name} > ${
        selectedCourse.semester
      } Sem > ${upperCase(selectedCourse.section)}`;
    }
    return "Student Wise Subject Allocation";
  };

  const selectCourseSuccess = (co) => {
    setSelectedCourse(co);
  };

  const resetAll = () => {
    setSelectedCourse([]);
    setStudents([]);
    setSelectedStudent([]);
    setOtherDept(false);
    setSearchCode("");
    setNewSubject([]);
  };

  useEffect(() => {
    if (selectedCourse.course_id) loadStudents();
  }, [selectedCourse]);

  const loadStudents = () => {
    setLoader(true);
    setStudents([]);
    const form = new FormData();
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    form.append("left", "0");

    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        setStudents(res["data"].data);
      }
      setLoader(false);
    });
  };

  const checkSelected = (item) => {
    let m = selectedStudent.find((obj) => obj.uuid == item.uuid);
    return m ? true : false;
  };

  const handleSelectChange = (item) => {
    let m = [...selectedStudent];
    let exist = m.find((obj) => obj.uuid == item.uuid);

    if (exist) {
      m = m.filter((obj) => obj.uuid != item.uuid);
    } else {
      m.push({ uuid: item.uuid });
    }
    setSelectedStudent(m);
  };

  const handleFindClick = (e) => {
    if (searchCode.length < 1) {
      toast.error("Enter Subject code to search");
      return;
    }
    setLoader(true);
    setNewSubject([]);
    const form = new FormData();
    form.append("semester", selectedCourse.semester);
    form.append("batch", selectedCourse.academic_year);
    form.append("code", searchCode);
    form.append("same_semester", otherDept ? "1" : "0");
    axios.post(ServiceUrl.STUDENTS.FIND_COURSE_SUBJECT, form).then((res) => {
      if (res["data"].status == "1") {
        setSubjects(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleSubjectChange = (e) => {
    let m = subjects.find((item) => item.id == e.target.value);
    if (m) setNewSubject(m);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (selectedStudent.length < 1) {
      toast.error("Please Select Students to save");
      return;
    }

    if (!window.confirm("Do you want to save ?")) return;
    axios
      .post(
        ServiceUrl.STUDENTS.SAVE_STUDENT_ALLOCATED_SUBJECT,
        new FormData(form)
      )
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          resetAll();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const checkAllClicked = (e) => {
    let s = [...selectedStudent];
    if (e.target.checked) {
      s = [];
      students.map((item) => s.push({ uuid: item.uuid }));
    } else {
      s = [];
    }
    setSelectedStudent(s);
  };

  return (
    <div>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          <ModuleAccess
            module={"student_sub_alloc_bystudent"}
            action={"action_list"}
          >
            <li className="list-inline-item">
              <Link
                to="/app/stu-subjects/studentwise-allocation"
                className="btn btn-transparent border-start ms-2"
              >
                <i className="fa fa-arrow-left fs-5 px-1"></i> Back
              </Link>
            </li>
          </ModuleAccess>

          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={(e) => resetAll()}
              disabled={!selectedCourse.course_id}
            >
              <i className="fa fa-xmark fs-5 px-1"></i> Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container py-3">
        <Spin spinning={loader}>
          {(!selectedCourse || !selectedCourse.course_id) && (
            <Row className="mt-2">
              <ModuleAccess
                module={"student_sub_alloc_bystudent"}
                action={"action_list"}
              >
                <Col md={6}>
                  <SelectRecords onSuccess={selectCourseSuccess} withSection />
                </Col>
              </ModuleAccess>
            </Row>
          )}

          {selectedCourse.course_id && (
            <div>
              <Card>
                <Card.Body className="px-0 py-0">
                  <div
                    className="tableFixHead ps-table"
                    style={{ maxHeight: "calc(100vh - 160px)" }}
                  >
                    <table>
                      <thead>
                        <tr>
                          <th className="text-center">
                            <input
                              type="checkbox"
                              onClick={(e) => checkAllClicked(e)}
                            />
                          </th>
                          <th>Reg.No</th>
                          <th>Adm.No</th>
                          <th>Student Name</th>
                          <th>Father Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((item, i) => {
                          return (
                            <tr>
                              <td align="center">
                                <input
                                  type="checkbox"
                                  checked={checkSelected(item)}
                                  onClick={(e) => handleSelectChange(item)}
                                />
                              </td>
                              <td>{item.registerno}</td>
                              <td>{item.admissionno}</td>
                              <td>
                                {item.name} {item.initital}
                              </td>
                              <td>{item.fathername}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleFormSubmit}
              >
                <input
                  type="hidden"
                  name="student_uuid"
                  value={JSON.stringify(selectedStudent)}
                />
                <input type="hidden" name="subject_id" value={newSubject.id} />
                <input
                  type="hidden"
                  name="subject_type"
                  value={newSubject.subject_type}
                />
                <input
                  type="hidden"
                  name="batch"
                  value={selectedCourse.academic_year}
                />
                <input
                  type="hidden"
                  name="college_year"
                  value={context.user.college_year}
                />
                <input
                  type="hidden"
                  name="semester"
                  value={selectedCourse.semester}
                />

                <Row className="mt-2">
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Subject Code</InputGroup.Text>
                      <Form.Control
                        type="text"
                        size="sm"
                        className="fw-bold"
                        required
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                      />
                      <InputGroup.Text className="px-0 py-0">
                        <Button
                          type="button"
                          size="sm"
                          className="w-100"
                          onClick={(e) => handleFindClick()}
                        >
                          <i className="fa fa-search me-2"></i>Find
                        </Button>
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Sub. Name</InputGroup.Text>
                      <Form.Control
                        as="select"
                        className="fw-bold form-select form-select-sm"
                        size="sm"
                        onChange={(e) => handleSubjectChange(e)}
                        required
                      >
                        <option value="">-Select-</option>
                        {subjects.map((item) => (
                          <option value={item.id}>
                            {upperCase(item.subject_name) +
                              " - " +
                              upperCase(item.subject_type)}
                          </option>
                        ))}
                      </Form.Control>
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Part</InputGroup.Text>
                      <Form.Control
                        as="select"
                        name="subject_part_type"
                        className="fw-bold form-select form-select-sm"
                        size="sm"
                      >
                        <option
                          value="1"
                          selected={newSubject.part == "1" ? "selected" : ""}
                        >
                          1
                        </option>
                        <option
                          value="2"
                          selected={newSubject.part == "2" ? "selected" : ""}
                        >
                          2
                        </option>
                        <option
                          value="3"
                          selected={newSubject.part == "3" ? "selected" : ""}
                        >
                          3
                        </option>
                        <option
                          value="4"
                          selected={newSubject.part == "4" ? "selected" : ""}
                        >
                          4
                        </option>
                        <option
                          value="5"
                          selected={newSubject.part == "5" ? "selected" : ""}
                        >
                          5
                        </option>
                      </Form.Control>
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Selected Students</InputGroup.Text>
                      <Form.Control
                        type="text"
                        size="sm"
                        className="fw-bold"
                        required
                        value={selectedStudent.length}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={1}>
                    <LoaderSubmitButton
                      type="submit"
                      text="Update"
                      loading={loader}
                      className="w-100"
                    />
                  </Col>
                </Row>
              </Form>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default StudentWiseBulkAllocation;
