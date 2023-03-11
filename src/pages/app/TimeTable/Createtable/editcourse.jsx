import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  formToObject,
  groupByMultiple,
  timeTableDayFromNumber,
  upperCase,
} from "../../../../utils";
import { Input, Spin } from "antd";
import PsModalWindow from "../../../../utils/PsModalWindow";
import { lisstafftsubject } from "../../../../models/hr";

import axios from "axios";
const Editcourse = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [staffDataSource, setStaffDataSource] = useState([]);
  const [staffs, setStaffs] = useState([]);

  const [subjectDataSource, setSubjectDataSource] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  useEffect(() => {
    listStaffs();
  }, []);

  useEffect(() => {
    // handleStaffChange(field('teacher'));
  }, [subjectList]);

  const listStaffs = () => {
    setLoader(true);
    setStaffDataSource([]);
    setStaffs([]);
    lisstafftsubject(
      "1&academic_year=" +
        props.course.academic_year +
        "&academic_department=" +
        props.course.academic_department
    ).then((res) => {
      if (res) {
        setStaffDataSource(res.data);
        setSubjectList(res.data);
        let m = groupByMultiple(res.data, function (obj) {
          return [obj.staff_id];
        });
        setStaffs(m);
      }
      setLoader(false);
    });
  };
  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
  };
  const handleFormUpdate = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoader(true);
    axios
      .post(
        ServiceUrl.SETTINGS.UPDATE_TIMETABLE,
        $("#frm_updatetimetable_2").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          let d = formToObject(form);

          if (props.onSuccess) props.onSuccess(d);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const handleStaffChange = (v) => {
    let m = staffDataSource.filter((item) => item.staff_id == v);
    setSubjectList(m);
  };

  const handleDelete = () => {
    if (!window.confirm("Do you want to Delete ?")) return;
    setLoader(true);
    const form = new FormData();
    form.append("id", field("id"));
    axios.post(ServiceUrl.SETTINGS.REMOVE_TIMETABLE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        if (props.onDelete) props.onDelete();
      } else {
        toast.error(res["data"].message || "Error");
      }
    });
  };

  return (
    <>
      <PsModalWindow {...props}>
        <Spin spinning={loader}>
          <Form
            noValidate
            validated={validated}
            action=""
            method="post"
            id="frm_updatetimetable_2"
            onSubmit={handleFormUpdate}
          >
            {" "}
            <input type="hidden" name="id" value={props.dataSource.id} />
            <input
              type="hidden"
              name="course_id"
              value={props.course.course_id}
            />
            <input
              type="hidden"
              name="course_type"
              value={props.course.course_type}
            />
            <input
              type="hidden"
              name="semester"
              value={props.course.semester}
            />
            <input
              type="hidden"
              name="academic_year"
              value={props.course.academic_year}
            />
            <input
              type="hidden"
              name="academic_department"
              value={props.course.academic_department}
            />
            <input
              type="hidden"
              name="course_name"
              value={props.course.course_name}
            />
            <input type="hidden" name="section" value={props.course.section} />
            <input type="hidden" name="day" value={props.day} />
            <input type="hidden" name="hour" value={props.hour} />
            <Row>
              <Col md={12}>
                <label>
                  Day <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="text"
                  name="day_value"
                  defaultValue={field("day_value")}
                  size="sm"
                  className="fw-bold"
                  value={timeTableDayFromNumber(props.day)}
                  readOnly
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={12}>
                <label>
                  Hour <span className="text-danger">*</span>
                </label>
                <Form.Control
                  type="text"
                  name="hour_value"
                  size="sm"
                  className="fw-bold"
                  defaultValue={field("hour_value")}
                  value={`Hour ${props.hour}`}
                  readOnly
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={12}>
                <label>
                  Staff Name <span className="text-danger">*</span>
                </label>
                <Form.Control
                  as="select"
                  name="staff_id"
                  size="sm"
                  defaultValue={field("staff_id")}
                  className="fw-bold form-select form-select-sm"
                  onChange={(e) => handleStaffChange(e.target.value)}
                  required
                >
                  <option value="">-Select-</option>
                  {staffs.map((item) => (
                    <option
                      value={item[0].staff_id}
                      selected={
                        item[0].staff_id == field("teacher") ? "selected" : ""
                      }
                    >
                      {item[0].emp_name}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={12}>
                <label>
                  Subject Name <span className="text-danger">*</span>
                </label>
                <Form.Control
                  as="select"
                  name="subject_id"
                  size="sm"
                  className="fw-bold form-select form-select-sm"
                  required
                >
                  <option value="">-Select-</option>
                  {subjectList.map((item) => (
                    <option
                      value={item.subject_id}
                      selected={
                        item.subject_id == field("subject") ? "selected" : ""
                      }
                    >
                      {item.subject_name}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={12}>
                <div className="float-start">
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={(e) => handleDelete()}
                  >
                    Delete
                  </Button>
                </div>
                <div className="float-end">
                  <Button
                    variant="secondary"
                    type="reset"
                    onClick={(e) => `props.onHide` && props.onHide()}
                    size="sm"
                    className="me-2"
                  >
                    Close
                  </Button>
                  <Button variant="primary" type="submit" size="sm">
                    Update
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </PsModalWindow>
    </>
  );
};
export default Editcourse;
