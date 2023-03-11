import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import { Spin, Tabs } from "antd";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { listAcademicYears } from "../../../../models/academicYears";
import { formToObject, groupByMultiple, upperCase } from "../../../../utils";
import { listAllCourses } from "../../../../models/courses";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import axios from "axios";
import SearchByStudentName from "./searchByStudentName";
import StudentFilter from "./studentFilter";

const SearchStudent = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validatedTwo, setValidatedTwo] = useState(false);

  const [academics, setAcademics] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedAcademic, setSelectedAcademic] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    loadAcademics();
  }, []);

  const loadAcademics = () => {
    setLoader(true);
    listAcademicYears().then((res) => {
      if (res) {
        let d = groupByMultiple(res, function (obj) {
          return [obj.type];
        });
        setAcademics(res);
        setCourseTypes(d);
      }
      setLoader(false);
    });

    setLoader(true);
    listAllCourses().then((res) => {
      if (res) {
        setCourses(res);
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

    let v = formToObject(form);

    if (props.onSuccess) props.onSuccess(v);
  };

  const courseTypeChange = (e) => {
    let m = academics.filter(
      (item) => upperCase(item.type) == upperCase(e.target.value)
    );
    setAcademicYear(m);
    setSelectedType(e.target.value);
  };

  const loadSemester = () => {
    let rv = [];
    let m = academics.find((item) => item.value == selectedAcademic);

    if (m)
      rv.push(<option value={m.semester}>{m.semester} (Current Sem)</option>);
    if (upperCase(selectedType) == "UG") {
      Array.from({ length: 6 }, (v, i) => {
        rv.push(<option value={i + 1}>{i + 1}</option>);
      });
    }
    if (upperCase(selectedType) == "PG") {
      Array.from({ length: 4 }, (v, i) => {
        rv.push(<option value={i + 1}>{i + 1}</option>);
      });
    }
    return rv;
  };

  const loadPrograms = () => {
    let m = courses.filter(
      (item) => upperCase(item.type) == upperCase(selectedType)
    );

    return m.map((item) => (
      <option value={item.id}>
        {item.degreename} - {item.name} (
        {upperCase(item.coursetype) == "SELF" ? "SF" : "R"})
      </option>
    ));
  };

  const gtCourseName = () => {
    let m = courses.find((item) => item.id == selectedCourse);
    if (m) {
      let t = upperCase(m.coursetype) == "SELF" ? "SF" : "R";
      return m.degreename + " - " + m.name + " (" + t + ")";
    }
  };

  const handleFormSubmit_Two = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidatedTwo(true);
      return;
    }
    setLoader(true);
    axios
      .post(
        ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO,
        $("#frm_SearchByRegisterNo").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          if (props.onSuccess) props.onSuccess(res["data"].data[0]);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <>
      <Spin spinning={loader}>
        <Card>
          <Card.Header className="fw-bold">Search Student</Card.Header>
          <Card.Body>
            <Tabs size="small">
              <Tabs.TabPane tab="Search By Register No" key="item-1">
                <Form
                  action=""
                  method="post"
                  noValidate
                  validated={validatedTwo}
                  id="frm_SearchByRegisterNo"
                  onSubmit={handleFormSubmit_Two}
                >
                  <Row className="mt-3">
                    <Col md={4}>
                      <label>
                        Reg. No / Adm. No <span className="text-danger">*</span>
                      </label>
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="text"
                        className="fw-bold"
                        size="sm"
                        name="register_no"
                        autoFocus={true}
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={12}>
                      <div className="text-end">
                        <LoaderSubmitButton text="Search" />
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Student Filter" key="item-2">
                <Row>
                  <Col md={8}>
                    <StudentFilter {...props} />
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Search By Student Name" key="item-3">
                <SearchByStudentName {...props} />
              </Tabs.TabPane>

              {/*<Tabs.TabPane tab="Student Filter" key="item-2">

						
					<Form
						noValidate
						validated={validated}
						action=""
						method="post"
						id="frm_SearchCourse"
						onSubmit={handleFormSubmit}
					>
						<input type="hidden" name="course_name" value={gtCourseName()} />
						
						<Row className="mt-3">
							<Col md={4}>
								<label>Course Type <span className="text-danger">*</span></label>
							</Col>
							<Col md={8}>
								<Form.Control
									as="select"
									className="fw-bold form-select form-select-sm"
									onChange={e => courseTypeChange(e)}
									name="course_type"
									required
								>
									<option value="">-Select-</option>
									{courseTypes.map(item => <option value={item[0].type}>{item[0].type}</option>)}
								</Form.Control>
							</Col>
						</Row>
						
						<Row className="mt-3">
							<Col md={4}>
								<label>Academic Year <span className="text-danger">*</span></label>
							</Col>
							<Col md={8}>
								<Form.Control
									as="select"
									className="fw-bold form-select form-select-sm"
									onChange={e => setSelectedAcademic(e.target.value)}
									name="academic_year"
									required
								>
									<option value="">-Select-</option>
									{academicYear.map(item => <option value={item.value}>{item.value}</option>)}
								</Form.Control>
							</Col>
						</Row>
												
						<Row className="mt-3">
							<Col md={4}>
								<label>Program <span className="text-danger">*</span></label>
							</Col>
							<Col md={8}>
								<Form.Control
									as="select"
									className="fw-bold form-select form-select-sm"
									name="course_id"
									onChange={e => setSelectedCourse(e.target.value)}
									required
								>
									<option value="">-Select-</option>
									{loadPrograms()}
								</Form.Control>
							</Col>
						</Row>
					
						<Row className="mt-3">
							<Col md={12}>
								<div className='text-end'>

									<LoaderSubmitButton
										text="Search"
									/>
								</div>
							</Col>
						</Row>


					</Form>
	</Tabs.TabPane>*/}
            </Tabs>
          </Card.Body>
        </Card>
      </Spin>
    </>
  );
};

export default SearchStudent;
