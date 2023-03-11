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
import SelectRecords from "./selectRecords";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import FeeTemplateSearch from "../../feeSettings/feeTemplates/feeTemplateSearch";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const ClassWiseFeeAssigning = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showTemplateSearch, setShowTemplateSearch] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesSource, setCategoriesSource] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [saveTemplate, setSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");

  useEffect(() => {
    if (context.cashbook.id) {
      if (selectedCourse && selectedCourse.course_id) {
        loadCategories();

        //setTemplateName(selectedCourse.course_name+'-'+selectedCourse.academic_year+'-'+selectedCourse.semester+' Sem');
      }
    }
  }, [selectedCourse, JSON.stringify(context.cashbook)]);

  const loadCategories = () => {
    setLoader(true);
    const form = new FormData();
    for (var key in selectedCourse) form.append(key, selectedCourse[key]);
    axios
      .post(ServiceUrl.FEE_CATEGORY.CATEGORY_LIST_WITH_STUDENT_COUNT, form)
      .then((res) => {
        if (res["data"].status == "1") {
          //setCategories(res["data"].data);
          setCategoriesSource(res["data"].data);
          setStudentCount(res["data"].count);
          loadFeeFromAssignedTemplate(res["data"].data);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const loadFeeFromAssignedTemplate = (cats) => {
    setLoader(true);
    const form = new FormData();
    form.append("academic_year", selectedCourse.academic_year);
    form.append("course_id", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    axios.post(ServiceUrl.FEES.LIST_TEMPLATES, form).then((res) => {
      let c = cats;
      if (res["data"].status == "1") {
        c.map((item, i) => {
          let f = res["data"].data.find(
            (obj) => obj.fee_category_id == item.id
          );
          if (f && f.fee_category_amount)
            c[i]["category_amount"] = f.fee_category_amount;
        });
      }
      setCategories(c);
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
        ServiceUrl.FEE_CATEGORY.SAVE_COURSE_WISE_FEE,
        $("#frm_SaveCourseWiseFeeAssing").serialize()
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
    setSelectedCourse([]);
    setDataList([]);
    setCategories([]);
    setLoader(false);
  };

  const templateSearchSuccess = (items) => {
    let m = categoriesSource;
    items.map((item, i) => {
      /*m.push({
				id: item.fee_category_id,
				category_amount: item.fee_category_amount,
			});*/
      let index = m.findIndex((obj) => obj.id == item.id);
      if (index > -1) m[index]["category_amount"] = item.fee_category_amount;
    });
    setCategories(m);
    setTemplateName("");
    setSaveTemplate(false);
    setShowTemplateSearch(false);
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Course Wise Fee Assigning">
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
                  <SelectRecords
                    onSuccess={(dt, e) => setSelectedCourse(dt)}
                    withAllSem={true}
                  />
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
                    id="frm_SaveCourseWiseFeeAssing"
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
                      name="save_fee_template"
                      value={saveTemplate ? "1" : "0"}
                    />

                    <Row>
                      <Col md={1}>
                        <label>Course</label>
                      </Col>
                      <Col md={4}>
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
                      <Col md={2}>
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
                      {/*<Col md={2} className="text-end">
                      <span
                        className="btn btn-outline-secondary btn-sm"
                        onClick={(e) => setShowTemplateSearch(true)}
                      >
                        Select From Template
                      </span>
		  </Col>*/}
                    </Row>

                    <Row className="mt-3">
                      <Col md={12}>
                        <div
                          className="tableFixHead"
                          style={{ height: "calc(100vh - 240px)" }}
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
                      {/*<Col md={2}>
								<Form.Check
									type="checkbox"
									label="Save as Fee Template"
									checked={saveTemplate}
									onChange={e => setSaveTemplate(e.target.checked)}
								/>
							</Col>
							<Col md={4}>
								{saveTemplate && (<Form.Control
									type="text"
									size="sm"
									className="fw-bold"	
									placeholder="Fee Template Name"
									name="fee_template_name"
									value={templateName}
									required
									onChange={e => setTemplateName(e.target.value)}
								/>)}
								</Col>*/}
                      <Col md={6}>
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

      {showTemplateSearch && (
        <FeeTemplateSearch
          title="Fee Template Search"
          size="lg"
          show={showTemplateSearch}
          onHide={(e) => setShowTemplateSearch(false)}
          onSuccess={templateSearchSuccess}
        />
      )}
    </>
  );
};

export default ClassWiseFeeAssigning;
