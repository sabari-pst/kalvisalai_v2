import { Spin } from "antd";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";

import PsContext from "../../../../context";
import ModuleAccess from "../../../../context/moduleAccess";
import { listFeeCategoy } from "../../../../models/fees";
import { CardFixedTop, upperCase, yearByBatch } from "../../../../utils";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";

import CashbookLayout from "../../selectCashbook/cashbookLayout";

const AddFineDefinition = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [validated, setValidated] = useState([]);

  const [feeCategories, setFeeCategories] = useState([]);

  useEffect(() => {
    if (context.cashbook.id) loadData();
  }, [JSON.stringify(context.cashbook)]);

  const loadData = () => {
    setLoader(true);
    listFeeCategoy("1").then((res) => {
      if (res) setFeeCategories(res);
      setLoader(false);
    });
  };

  const resetAll = () => {
    setSelectedCourse([]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (!window.confirm("Do you want to save fine ?")) return;
    setLoader(true);
    axios.post(ServiceUrl.FEES.SAVE_FINE, new FormData(form)).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        resetAll();
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Add Fine">
          <ul className="list-inline mb-0">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => resetAll()}
              >
                <i className="fa fa-xmark px-1"></i> Reset
              </Button>
            </li>
          </ul>
        </CardFixedTop>

        <div className="container py-3">
          <Spin spinning={loader}>
            {!selectedCourse.academic_year && (
              <Row>
                <Col md={6}>
                  <SelectRecords
                    wihtOutProgram={true}
                    onSuccess={(d) => setSelectedCourse(d)}
                  />
                </Col>
              </Row>
            )}

            {selectedCourse.academic_year && (
              <>
                <Row>
                  <Col md={7}>
                    <Card>
                      <Card.Header className="fw-bold">Fine</Card.Header>
                      <Card.Body>
                        <Form
                          action=""
                          method="post"
                          noValidate
                          validated={validated}
                          onSubmit={handleFormSubmit}
                        >
                          <Row>
                            <Col md={3}>
                              <label>Course Type</label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="course_type"
                                value={upperCase(selectedCourse.course_type)}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-3">
                            <Col md={3}>
                              <label>Batch</label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="batch"
                                value={selectedCourse.academic_year}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-3">
                            <Col md={3}>
                              <label>Year</label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                value={yearByBatch(
                                  selectedCourse.academic_year
                                )}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-3">
                            <Col md={3}>
                              <label>Semester</label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="semester"
                                value={selectedCourse.semester}
                              />
                            </Col>
                          </Row>

                          <Row className="mt-4">
                            <Col md={3}>
                              <label>
                                Fine Category{" "}
                                <span className="text-danger">*</span>
                              </label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                as="select"
                                size="sm"
                                className="fw-bold"
                                name="fine_category"
                                required
                              >
                                <option value="">-Select-</option>
                                {feeCategories.map((item) => (
                                  <option value={item.id}>
                                    {item.category_name}
                                  </option>
                                ))}
                              </Form.Control>
                            </Col>
                          </Row>
                          <Row className="mt-3">
                            <Col md={3}>
                              <label>
                                Fine Amount{" "}
                                <span className="text-danger">*</span>
                              </label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="number"
                                size="sm"
                                className="fw-bold"
                                name="fine_amount"
                                required
                              />
                            </Col>
                          </Row>
                          <Row className="mt-3">
                            <Col md={12} className="text-end">
                              <LoaderSubmitButton
                                text="Save Fine"
                                loading={loader}
                              />
                            </Col>
                          </Row>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Spin>
        </div>
      </CashbookLayout>
    </>
  );
};

export default AddFineDefinition;
