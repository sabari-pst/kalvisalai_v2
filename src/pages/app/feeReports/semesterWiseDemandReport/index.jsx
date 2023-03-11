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
import PrintClassWiseDemand from "./printClassWiseDemand";
import ModuleAccess from "../../../../context/moduleAccess";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const SemesterWiseDemandReport = (props) => {
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
      if (selectedCourse && selectedCourse.semester) loadData();
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

  const getTotalAmount = (item) => {
    let total = 0;
    if (item && item.total_concession)
      total = parseFloat(total) + parseFloat(item.total_concession);
    if (item && item.total_paid)
      total = parseFloat(total) + parseFloat(item.total_paid);
    if (item && item.total_unpaid)
      total = parseFloat(total) + parseFloat(item.total_unpaid);
    return parseFloat(total).toFixed(2);
  };

  const getOverallTotal = () => {
    let total = 0;
    dataView.map((item, i) => {
      if (item && item.total_concession)
        total = parseFloat(total) + parseFloat(item.total_concession);
      if (item && item.total_paid)
        total = parseFloat(total) + parseFloat(item.total_paid);
      if (item && item.total_unpaid)
        total = parseFloat(total) + parseFloat(item.total_unpaid);
    });
    return parseFloat(total).toFixed(2);
  };

  const getTitle = () => {
    if (selectedCourse && selectedCourse.fee_group_name)
      return `Semester Wise Demand Report > ${selectedCourse.fee_group_name}`;
    return "Semester Wise Demand Report";
  };

  const typeChange = (e) => {
    let x = dataList;
    if (e.target.value == "unpaid")
      x = x.filter((item) => parseFloat(item.total_unpaid) > 0);
    else if (e.target.value == "paid")
      x = x.filter((item) => !item.total_unpaid);
    setDataView(x);
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title={getTitle()}>
          <ul className="list-inline mb-0">
            <ModuleAccess
              module={"fee_report_sem_wise"}
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
                    feeGroup={true}
                    onSuccess={(dt, e) => setSelectedCourse(dt)}
                    withAllSem={true}
                    wihtOutProgram={true}
                  />
                </Col>
              </Row>
            )}

            {selectedCourse && selectedCourse.semester && (
              <>
                <Row className="mt-2">
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>View</InputGroup.Text>
                      <Form.Control
                        as="select"
                        className="fw-bold form-select"
                        onChange={typeChange}
                      >
                        <option value="all">All</option>
                        <option value="unpaid">Un-Paid</option>
                        <option value="paid">Paid</option>
                      </Form.Control>
                    </InputGroup>
                  </Col>
                  <Col md={3}>
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
                  <Col md={1}></Col>
                  <Col md={4}>
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
                        className="tableFixHead bg-white ps-table"
                        style={{ height: "calc(100vh - 150px)" }}
                      >
                        <table>
                          <thead>
                            <tr>
                              <th width="60">S.No</th>
                              <th>Reg.No</th>
                              <th>Student Name</th>
                              <th width="120">Course</th>
                              <th>Father Name</th>
                              <th>Address</th>
                              <th width="100" className="text-center">
                                Demand
                              </th>
                              <th width="100" className="text-center">
                                Paid
                              </th>
                              <th width="100" className="text-center">
                                Scholarship
                              </th>
                              <th width="100" className="text-center">
                                Balance
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataView.map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td className="">{i + 1}</td>
                                  <td className="">
                                    {item.registerno || item.admissionno}
                                  </td>
                                  <td className="">{item.name}</td>
                                  <td className="">
                                    {item.degree_name}
                                    {item.course_short_name &&
                                      ` - ${item.course_short_name} `}
                                    {upperCase(item.course_type) == "SELF"
                                      ? "(SF)"
                                      : "(R)"}
                                  </td>
                                  <td className="">{item.fathername}</td>
                                  <td className="">{item.village_permanent}</td>
                                  <td className="" align="right">
                                    {getTotalAmount(item)}
                                  </td>
                                  <td className="" align="right">
                                    {item.total_paid || "-"}
                                  </td>
                                  <td className="" align="right">
                                    {item.total_concession || "-"}
                                  </td>
                                  <td className="" align="right">
                                    {item.total_unpaid || "-"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot className="fw-bold">
                            <tr>
                              <td className="" colSpan={6} align="right">
                                Total :{" "}
                              </td>
                              <td className="" align="right">
                                <b>{getOverallTotal()}</b>
                              </td>
                              <td className="" align="right">
                                <b>{getTotalByField("total_paid")}</b>
                              </td>
                              <td className="" align="right">
                                <b>{getTotalByField("total_concession")}</b>
                              </td>
                              <td className="" align="right">
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
        <PrintClassWiseDemand
          dataSource={dataView}
          onSuccess={(e) => setPrintReport(false)}
          course={selectedCourse}
        />
      )}
    </>
  );
};

export default SemesterWiseDemandReport;
