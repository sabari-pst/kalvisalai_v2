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
import { Input, Spin } from "antd";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { CustomDropDown } from "../../components";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const StudentWiseFeeAdjusting = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [saveTemplate, setSaveTemplate] = useState(true);
  const [templateName, setTemplateName] = useState("");

  const [selectedStudent, setSelectedStudent] = useState([]);

  useEffect(() => {
    if (context.cashbook.id) {
      if (selectedCourse && selectedCourse.course_id) {
        loadStudents();
      }
    }
  }, [selectedCourse, JSON.stringify(context.cashbook)]);

  useEffect(() => {
    if (context.cashbook.id) {
      if (selectedStudent && selectedStudent.course) {
        loadCategories();
      }
    }
  }, [selectedStudent, JSON.stringify(context.cashbook)]);

  const loadCategories = () => {
    setLoader(true);
    setCategories([]);
    const form = new FormData();
    for (var key in selectedCourse) form.append(key, selectedCourse[key]);
    form.append("student_uuid", selectedStudent.uuid);
    axios
      .post(ServiceUrl.FEE_CATEGORY.CATEGORY_LIST_WITH_STUDENT_COUNT, form)
      .then((res) => {
        if (res["data"].status == "1") {
          let __categories = res["data"].data;
          let response = res["data"].data;
          let assinged = res["data"].assigned;
          if (assinged && assinged.length > 0) {
            __categories = [];
            response.map((item, i) => {
              let assignedFee = assinged.find(
                (assignedItem) => assignedItem.fee_category_id == item.id
              );
              if (assignedFee && assignedFee.fee_amount)
                item["category_amount"] = assignedFee.fee_amount;

              __categories.push(item);
            });
          }
          setCategories(__categories);
          setStudentCount(res["data"].count);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const loadStudents = () => {
    setLoader(true);
    setStudents([]);

    const form = new FormData();
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        setStudents(res["data"].data);
      }
      setLoader(false);
    });
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to remove category from list?")) {
      return;
    }

    let cat = [...categories];
    let index = cat.findIndex((obj) => obj.id == item.id);
    if (index < 0) return;
    cat.splice(index, 1);
    setCategories(cat);
  };

  const handleAmountChange = (item, e) => {
    let cat = [...categories];
    let index = cat.findIndex((obj) => obj.id == item.id);
    if (index < 0) return;
    cat[index]["category_amount"] = e.target.value;
    setCategories(cat);
  };

  const getTotal = () => {
    let total = 0;
    categories.map(
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

    if (getTotal() < 1) {
      toast.error("Please enter valid amount for all the categories");
      return;
    }
    if (!window.confirm("Do you want to save?")) {
      return;
    }

    setLoader(true);
    axios
      .post(
        ServiceUrl.FEE_CATEGORY.SAVE_STUDENT_WISE_FEE_ADJUST,
        $("#frm_SaveStudentWiseFeeAdjust").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          setSelectedCourse([]);
          setLoader(false);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const resetAll = () => {
    setCategories([]);
    setSelectedCourse([]);
    setDataList([]);
    setLoader(false);
  };

  const handleStudentChange = (selectedValue, selectedItem) => {
    setSelectedStudent(selectedItem);
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Student Wise Fee Adjustment">
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
                    id="frm_SaveStudentWiseFeeAdjust"
                    onSubmit={handleFormSubmit}
                  >
                    <input
                      type="hidden"
                      name="categories"
                      value={JSON.stringify(categories)}
                    />
                    <input
                      type="hidden"
                      name="course_id"
                      value={selectedCourse.course_id}
                    />
                    <input
                      type="hidden"
                      name="student_uuid"
                      value={selectedStudent.uuid}
                    />
                    <input
                      type="hidden"
                      name="registerno"
                      value={selectedStudent.registerno}
                    />
                    <input
                      type="hidden"
                      name="save_fee_template"
                      value={saveTemplate ? "1" : "0"}
                    />

                    <Row>
                      <Col md={1}>
                        <label>Course</label>
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
                      <Col md={1} className="px-0">
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
                      <Col md={1}>
                        <Form.Control
                          type="text"
                          size="sm"
                          name="semester"
                          className="fw-bold"
                          value={selectedCourse.semester}
                          readOnly
                        />
                      </Col>
                      <Col md={4}>
                        <CustomDropDown
                          dataSource={students}
                          displayField={(item) =>
                            `${item.registerno} - ${item.name}`
                          }
                          placeholder="Select a Student"
                          value="uuid"
                          onChange={handleStudentChange}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={12}>
                        <div
                          className="tableFixHead"
                          style={{ height: "calc(100vh - 230px)" }}
                        >
                          <table>
                            <thead>
                              <tr>
                                <th width="80">S.No</th>
                                <th>Category Name</th>
                                <th>Print Name</th>
                                <th width="150" className="text-end">
                                  Amount
                                </th>
                                <th width="80" className="text-center">
                                  #
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {categories.map((item, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{item.category_name}</td>
                                    <td>{item.category_print_name}</td>
                                    <td>
                                      <Form.Control
                                        type="number"
                                        size="sm"
                                        className="fw-bold text-end"
                                        value={item.category_amount}
                                        onChange={(e) =>
                                          handleAmountChange(item, e)
                                        }
                                      />
                                    </td>
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
                      <Col md={3}>
                        <InputGroup size="sm">
                          <InputGroup.Text>Total Students</InputGroup.Text>
                          <Form.Control
                            type="number"
                            size="sm"
                            className="fw-bold text-end"
                            value={studentCount}
                          />
                        </InputGroup>
                      </Col>
                      <Col md={3}>
                        <InputGroup size="sm">
                          <InputGroup.Text>Total Amount</InputGroup.Text>
                          <Form.Control
                            type="number"
                            size="sm"
                            className="fw-bold text-end"
                            name="fee_template_amount"
                            value={getTotal()}
                          />
                        </InputGroup>
                      </Col>
                      <Col md={6}>
                        <div className="text-end">
                          <a
                            className="border-end pe-2 me-3 fs-10"
                            onClick={(e) => resetAll()}
                          >
                            <u>Cancel</u>
                          </a>

                          <LoaderSubmitButton
                            text="Update Un Paid Categories"
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

export default StudentWiseFeeAdjusting;
