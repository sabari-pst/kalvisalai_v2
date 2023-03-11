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

import PsContext from "../../../../context";

import { capitalizeFirst, CardFixedTop, upperCase } from "../../../../utils";

import { listPaymentMethods } from "../../../../models/fees";
import axios from "axios";
import { formatCountdown } from "antd/lib/statistic/utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import SelectRecords from "../classWiseFeeAssigning/selectRecords";
import { Input, Spin } from "antd";

import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const StudentWiseFeeAssigning = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (context.cashbook.id) {
      if (selectedCourse && selectedCourse.course_id) loadCategories();
    }
  }, [selectedCourse, JSON.stringify(context.cashbook)]);

  const loadCategories = () => {
    setLoader(true);
    const form = new FormData();
    form.append("type", "student");
    for (var key in selectedCourse) form.append(key, selectedCourse[key]);
    axios
      .post(ServiceUrl.FEE_CATEGORY.CATEGORY_LIST_WITH_STUDENT_COUNT, form)
      .then((res) => {
        if (res["data"].status == "1") {
          setCategories(res["data"].data);
          setStudents(res["data"].count);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to remove category from list?")) {
      return;
    }

    let cat = [...dataList];
    let stu = [...students];
    let index = cat.findIndex((obj) => obj.student_uuid == item.uuid);
    if (index > -1) {
      cat.splice(index, 1);
      setDataList(cat);
    }

    let sindex = students.findIndex((obj) => obj.uuid == item.uuid);
    if (sindex > -1) {
      stu.splice(sindex, 1);
      setStudents(stu);
    }
  };

  const handleAmountChange = (student, category, e) => {
    let cat = [...dataList];
    let index = cat.findIndex(
      (obj) =>
        obj.category_id == category.id && obj.student_uuid == student.uuid
    );
    if (index > -1) {
      cat[index]["category_amount"] = e.target.value;
      setDataList(cat);
      return;
    }

    let m = {
      student_uuid: student.uuid,
      category_id: category.id,
      category_amount: e.target.value,
    };
    cat.push(m);
    setDataList(cat);
  };

  const getAmount = (student, category) => {
    let cat = dataList.find(
      (obj) =>
        obj.category_id == category.id && obj.student_uuid == student.uuid
    );
    return (cat && cat.category_amount) || "";
  };

  const categoryInput = (student, category) => {
    return (
      <Form.Control
        type="number"
        size="sm"
        style={{ minWidth: "80px" }}
        className="fw-bold text-end"
        value={getAmount(student, category)}
        onChange={(e) => handleAmountChange(student, category, e)}
      />
    );
  };

  const getTotal = (student) => {
    let total = 0;
    let m = dataList.filter((item) => item.student_uuid == student.uuid);
    m.map(
      (item) => (total = parseFloat(total) + parseFloat(item.category_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  const getAssingnedTotal = () => {
    let total = 0;
    dataList.map(
      (item) => (total = parseFloat(total) + parseFloat(item.category_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (getAssingnedTotal() < 1) {
      toast.error("Pleas enter correct amount to save");
      return;
    }
    if (!window.confirm("Do you want to save?")) {
      return;
    }

    setLoader(true);
    axios
      .post(
        ServiceUrl.FEE_CATEGORY.SAVE_STUDENT_WISE_FEE,
        $("#frm_SaveStudentWiseFeeAssing").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          setSelectedCourse([]);
          setDataList([]);
          setLoader(false);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const resetAll = () => {
    setSelectedCourse([]);
    setDataList([]);
    setLoader(false);
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Student Wise Fee Assigning">
          <ul className="list-inline mb-0">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => resetAll()}
                disabled={selectedCourse && selectedCourse.length < 1}
              >
                <i className="fa-solid fa-xmark fs-5 px-1"></i> Reset
              </Button>
            </li>
          </ul>
        </CardFixedTop>

        <div className="container mt-3">
          <Spin spinning={loader}>
            {selectedCourse && selectedCourse.length < 1 && (
              <Row>
                <Col md={5}>
                  <SelectRecords onSuccess={(dt, e) => setSelectedCourse(dt)} />
                </Col>
              </Row>
            )}

            {selectedCourse && selectedCourse.course_id && (
              <Card>
                <Card.Body>
                  <Form
                    noValidate
                    validated={validated}
                    action=""
                    method="post"
                    id="frm_SaveStudentWiseFeeAssing"
                    onSubmit={handleFormSubmit}
                  >
                    <input
                      type="hidden"
                      name="categories"
                      value={JSON.stringify(dataList)}
                    />
                    <input
                      type="hidden"
                      name="course_id"
                      value={selectedCourse.course_id}
                    />

                    <Row>
                      <Col md={1}>
                        <label>Course Name</label>
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          type="text"
                          size="sm"
                          name="course_name"
                          className="fw-bold"
                          value={selectedCourse.course_name}
                          readOnly
                        />
                      </Col>
                      <Col md={1}>
                        <label>Batch</label>
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          type="text"
                          size="sm"
                          name="academic_year"
                          className="fw-bold"
                          value={selectedCourse.academic_year}
                          readOnly
                        />
                      </Col>
                      <Col md={1}>
                        <label>Semester</label>
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          type="text"
                          size="sm"
                          name="semester"
                          className="fw-bold"
                          value={selectedCourse.semester}
                          readOnly
                        />
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={12}>
                        <div
                          className="tableFixHead table-responsive"
                          style={{ height: "calc(100vh - 240px)" }}
                        >
                          <table className="table">
                            <thead>
                              <tr>
                                <th width="80">S.No</th>
                                <th>Register No</th>
                                <th>Category Name</th>
                                {categories.map((item) => (
                                  <th width="120">{item.category_name}</th>
                                ))}
                                <th width="100" className="text-end">
                                  Total
                                </th>
                                <th width="50" className="text-center">
                                  #
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {students.map((item, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>
                                      {item.registerno || item.admissionno}
                                    </td>
                                    <td>{item.name}</td>
                                    {categories.map((cat) => (
                                      <td>{categoryInput(item, cat)}</td>
                                    ))}
                                    <td align="right">{getTotal(item)}</td>
                                    <td align="center">
                                      <Button
                                        size="sm"
                                        variant="transparent"
                                        title="Delete"
                                        onClick={(e) => handleDelete(item)}
                                      >
                                        <i className="fa-regular fa-trash-can"></i>
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </Row>
                    <Row className="pt-3 border-top">
                      <Col md={2}>
                        <InputGroup size="sm">
                          <InputGroup.Text>Total Students</InputGroup.Text>
                          <Form.Control
                            type="text"
                            size="sm"
                            className="fw-bold text-end"
                            value={students.length}
                          />
                        </InputGroup>
                      </Col>
                      <Col md={2}>
                        <InputGroup size="sm">
                          <InputGroup.Text>Total Amount</InputGroup.Text>
                          <Form.Control
                            type="text"
                            size="sm"
                            className="fw-bold text-end"
                            value={getAssingnedTotal()}
                          />
                        </InputGroup>
                      </Col>
                      <Col md={6}></Col>
                      <Col md={2}>
                        <div className="text-end">
                          <a
                            className="border-end pe-2 me-3 fs-10"
                            onClick={(e) => resetAll()}
                          >
                            <u>Cancel</u>
                          </a>
                          <LoaderSubmitButton
                            text="Save Fees"
                            loading={loader}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Spin>
        </div>
      </CashbookLayout>
    </>
  );
};

export default StudentWiseFeeAssigning;
