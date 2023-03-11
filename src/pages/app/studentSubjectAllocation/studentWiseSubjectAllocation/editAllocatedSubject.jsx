import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Dropdown,
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";
import { upperCase } from "../../../../utils";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";

const EditAllocatedSubject = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  const [searchCode, setSearchCode] = useState("");
  const [newSubject, setNewSubject] = useState([]);
  const [otherDept, setOtherDept] = useState(false);

  const field = (fieldName) => {
    return props.dataSource?.[fieldName];
  };

  const handleFindClick = (e) => {
    if (searchCode.length < 1) {
      toast.error("Enter Subject code to search");
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("semester", field("semester"));
    form.append("batch", field("batch"));
    form.append("code", searchCode);
    form.append("same_semester", otherDept ? "1" : "0");
    axios.post(ServiceUrl.STUDENTS.FIND_COURSE_SUBJECT, form).then((res) => {
      if (res["data"].status == "1") {
        setNewSubject(res["data"].data[0]);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleformSubmit = (e) => {
    e.preventDefault();
    if (!window.confirm("Do you want to update?")) return;
    setLoader(true);
    axios
      .post(
        ServiceUrl.STUDENTS.UPDATE_STUDENT_ALLOCATED_SUBJECT,
        new FormData(e.currentTarget)
      )
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
    <>
      <PsModalWindow {...props}>
        <Spin spinning={loader}>
          <Row>
            <Col md={2}>
              <label>Reg.No</label>
            </Col>
            <Col md={10}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                value={field("registerno") || field("rollno")}
                disabled
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}>
              <label>Name</label>
            </Col>
            <Col md={10}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                value={upperCase(field("name"))}
                disabled
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={2}>
              <label>Code</label>
            </Col>
            <Col md={10}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                value={upperCase(field("subject_code"))}
                disabled
              />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={2}>
              <label>Name</label>
            </Col>
            <Col md={10}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                value={upperCase(field("subject_name"))}
                disabled
              />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={12} className="bg-silver fw-bold">
              <label>Alternate Subject</label>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={2}>
              <label>Code</label>
            </Col>
            <Col md={8}>
              <Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
              <Form.Check
                type="checkbox"
                label="Other Department Subjects"
                checked={otherDept}
                onChange={(e) => setOtherDept(!otherDept)}
              />
            </Col>
            <Col md={2}>
              <Button
                type="button"
                size="sm"
                className="w-100"
                onClick={(e) => handleFindClick()}
              >
                <i className="fa fa-search me-2"></i>Find
              </Button>
            </Col>
          </Row>
          {newSubject && newSubject.id && (
            <Form action="" method="post" onSubmit={handleformSubmit}>
              <input type="hidden" name="id" value={field("id")} />
              <input type="hidden" name="subject_id" value={newSubject.id} />
              <Row className="mt-2">
                <Col md={2}>
                  <label>Name</label>
                </Col>
                <Col md={10}>
                  <Form.Control
                    type="text"
                    name="subject_name"
                    className="fw-bold"
                    size="sm"
                    value={upperCase(newSubject.subject_name)}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={2}>
                  <label>Type</label>
                </Col>
                <Col md={10}>
                  <Form.Control
                    type="text"
                    name="subject_type"
                    className="fw-bold"
                    size="sm"
                    value={upperCase(newSubject.subject_type)}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={2}>
                  <label>Part</label>
                </Col>
                <Col md={10}>
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
                </Col>
              </Row>

              <Row className="mt-2">
                <Col md={12}>
                  <div className="text-end">
                    <LoaderSubmitButton
                      type="submit"
                      loading={loader}
                      text="Update"
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Spin>
      </PsModalWindow>
    </>
  );
};

export default EditAllocatedSubject;
