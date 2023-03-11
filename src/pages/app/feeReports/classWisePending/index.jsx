import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import $ from "jquery";
import {
  Badge,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import ModuleAccess from "../../../../context/moduleAccess";

import {
  capitalizeFirst,
  CardFixedTop,
  momentDate,
  upperCase,
} from "../../../../utils";

import { listPaymentMethods } from "../../../../models/fees";
import axios from "axios";
import { formatCountdown } from "antd/lib/statistic/utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { Spin } from "antd";

import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import PrintClassWisePending from "./printClassWisePending";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const ClassWisePending = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [printModal, setPrintModal] = useState(false);
  const [printReport, setPrintReport] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);

  useEffect(() => {
    if (context.cashbook.id)
      if (selectedCourse && selectedCourse.course_id) loadData();
  }, [selectedCourse, JSON.stringify(context.cashbook)]);

  const loadData = () => {
    setLoader(true);
    //CLASS_WISE_PENDING
    const form = new FormData();
    for (var key in selectedCourse) form.append(key, selectedCourse[key]);
    axios.post(ServiceUrl.FEES.CLASS_WISE_PENDING, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        setDataView(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const resetAll = () => {
    setDataList([]);
    setDataView([]);
    setSelectedCourse([]);
    setLoader(false);
  };

  const handlePrintClick = (item) => {
    setViewData(item);
    setPrintModal(true);
  };

  const getTotalByField = (fieldName) => {
    let total = 0;
    dataView.map(
      (item) =>
        item[fieldName] &&
        (total = parseFloat(total) + parseFloat(item[fieldName]))
    );
    return parseFloat(total).toFixed(2);
  };

  const handleSearch = (e) => {
    let v = upperCase(e.target.value);
    let d = dataList.filter(
      (item) =>
        upperCase(item.name).indexOf(v) > -1 ||
        upperCase(item.registerno).indexOf(v) > -1
    );
    setDataView(d);
  };

  const handleTypeChange = (e) => {
    let v = e.target.value;
    let m = dataList;
    if (v == "paid")
      m = dataList.filter((item) => item.total_unpaid && item.total_unpaid < 1);
    if (v == "unpaid")
      m = dataList.filter((item) => item.total_unpaid && item.total_unpaid > 0);

    setDataView(m);
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Class Wise Pending">
          <ul className="list-inline mb-0">
            <ModuleAccess
              module={"fee_report_class_wise_pending"}
              action={"action_print"}
            >
              <li className="list-inline-item">
                <Button
                  variant="white"
                  className="border-start ms-2"
                  onClick={(e) => setPrintReport(true)}
                  disabled={dataView.length < 1}
                >
                  <i className="fa-solid fa-print pe-1"></i> Print
                </Button>
              </li>
            </ModuleAccess>
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

        <div className="container mt-2">
          <Spin spinning={loader}>
            {selectedCourse && selectedCourse.length < 1 && (
              <Row>
                <Col md={6}>
                  <SelectRecords
                    onSuccess={(dt, e) => setSelectedCourse(dt)}
                    withAllSem={true}
                  />
                </Col>
              </Row>
            )}

            {selectedCourse && selectedCourse.course_id && (
              <>
                <Row className="mt-2">
                  <Col md={4}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Course</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={selectedCourse.course_name}
                        className="fw-bold"
                      />
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Academic</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={selectedCourse.academic_year}
                        className="fw-bold"
                      />
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Semester</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={selectedCourse.semester}
                        className="fw-bold"
                      />
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Type</InputGroup.Text>
                      <Form.Control
                        as="select"
                        className="fw-bold"
                        onChange={(e) => handleTypeChange(e)}
                      >
                        <option value="0">All</option>
                        <option value="unpaid">Un-Paid</option>
                        <option value="paid">Paid</option>
                      </Form.Control>
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search..."
                        className="fw-bold"
                        onChange={(e) => handleSearch(e)}
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col md={12}>
                    <Spin spinning={loader}>
                      <div
                        className="tableFixHead bg-white ps-table "
                        style={{ height: "calc(100vh - 150px)" }}
                      >
                        <table>
                          <thead>
                            <tr>
                              <th width="60">S.No</th>
                              <th>Reg.No</th>
                              <th>Student Name</th>
                              <th>Father Name</th>
                              <th>Address</th>
                              <th width="150" className="text-center">
                                Balance
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataView.map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>{item.registerno || item.admissionno}</td>
                                  <td>{item.name}</td>
                                  <td>{item.fathername}</td>
                                  <td>{item.village_permanent}</td>
                                  <td align="right">
                                    {item.total_unpaid || "-"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={5} align="right">
                                Total :{" "}
                              </td>
                              <td align="right">
                                <b>{getTotalByField("total_unpaid")}</b>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </Spin>
                  </Col>
                </Row>
              </>
            )}
          </Spin>
        </div>
      </CashbookLayout>

      {printReport && (
        <PrintClassWisePending
          dataSource={dataView}
          onSuccess={(e) => setPrintReport(false)}
          course={selectedCourse}
        />
      )}
    </>
  );
};

export default ClassWisePending;
