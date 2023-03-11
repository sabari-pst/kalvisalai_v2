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
  groupByMultiple,
  momentDate,
  semesterValue,
  upperCase,
} from "../../../../utils";

import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { Spin } from "antd";

import ModuleAccess from "../../../../context/moduleAccess";
import SearchStudent from "../../feePayment/newFeePayment/searchStudent";
import PrintStudentDemanReport from "./printStudentDemanReport";
import { TABLE_STYLES } from "../../../../utils/data";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const StudentWiseDemandReport = (props) => {
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

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (context.cashbook.id)
      if (selectedCourse && selectedCourse.uuid) loadData();
  }, [selectedCourse, JSON.stringify(context.cashbook)]);

  const loadData = () => {
    setLoader(true);
    //CLASS_WISE_PENDING

    const form = new FormData();
    form.append("student_uuid", selectedCourse.student_uuid);
    form.append("type", "all");
    //for (var key in selectedCourse) form.append(key, selectedCourse[key]);
    axios.post(ServiceUrl.FEES.LIST_PAYMENT, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        let m = groupByMultiple(res["data"].data, function (obj) {
          return [obj.semester];
        });
        setDataView(m);
        setBalance(res["data"].balance);
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

  const getTitle = () => {
    if (selectedCourse && selectedCourse.fee_group_name)
      return `Student Wise Demand Report > ${selectedCourse.fee_group_name}`;
    return "Student Wise Demand Report";
  };

  const field = (fieldName) => {
    if (dataList.length > 0) return dataList[0]?.[fieldName];
  };

  const getAmount = (item, type = "paid") => {
    let rv = false;
    if (type == "paid") {
      if (item.bill_id != null && item.is_cancelled == 0) rv = item.fee_amount;
    } else if (type == "balance") {
      if (item.bill_id == null && item.is_cancelled == 0) rv = item.fee_amount;
    } else if (type == "demand") {
      rv = item.fee_amount;
      let amt = item.part_type == "concession" ? item.part_amount : false;
      if (amt) {
        rv = rv ? parseFloat(rv) + parseFloat(amt) : amt;
      }
    } else if (type == "concession") {
      let amt = item.part_type == "concession" ? item.part_amount : false;
      if (amt) {
        rv = amt;
      }
    }
    return rv ? parseFloat(rv).toFixed(2) : "";
  };

  const innerRow = (items) => {
    return items.map((item, i) => {
      return (
        <tr>
          <td>{item.category_name}</td>
          <td align="right">{getAmount(item, "demand")}</td>
          <td align="right">{getAmount(item, "paid")}</td>
          <td align="right">{getAmount(item, "concession")}</td>
          <td align="right">{getAmount(item, "balance")}</td>
        </tr>
      );
    });
  };

  const rowsTotal = (items, type = "paid") => {
    let rv = 0;
    if (type == "paid") {
      items.map(
        (item) =>
          item.bill_id != null &&
          item.is_cancelled == 0 &&
          (rv = parseFloat(rv) + parseFloat(item.fee_amount))
      );
    } else if (type == "balance") {
      items.map(
        (item) =>
          item.bill_id == null &&
          item.is_cancelled == 0 &&
          (rv = parseFloat(rv) + parseFloat(item.fee_amount))
      );
    } else if (type == "total") {
      items.map((item) => (rv = parseFloat(rv) + parseFloat(item.fee_amount)));
      items.map(
        (item) =>
          item.part_type == "concession" &&
          (rv = parseFloat(rv) + parseFloat(item.part_amount))
      );
    } else if (type == "concession") {
      items.map(
        (item) =>
          item.part_type == "concession" &&
          (rv = parseFloat(rv) + parseFloat(item.part_amount))
      );
    }
    return rv ? parseFloat(rv).toFixed(2) : "";
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title={getTitle()}>
          <ul className="list-inline mb-0">
            <ModuleAccess
              module={"fee_report_class_wise_demand"}
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
                <Col md={10}>
                  <SearchStudent
                    feeGroup={true}
                    onSuccess={(dt, e) => setSelectedCourse(dt)}
                    withAllSem={true}
                  />
                </Col>
              </Row>
            )}

            {selectedCourse && selectedCourse.uuid && (
              <>
                <Row className="mt-2">
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Reg.no</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={
                          selectedCourse.registerno ||
                          selectedCourse.admissionno
                        }
                        className="fw-bold"
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Name</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={selectedCourse.name}
                        className="fw-bold"
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Course</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={`${selectedCourse.degree_name}-${
                          selectedCourse.course_name
                        } - ${
                          selectedCourse.dept_type == "unaided" ? "SF" : "R"
                        }`}
                        className="fw-bold"
                      />
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Bal.</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={balance}
                        className={`fw-bold ${
                          balance > 0 ? "text-danger" : ""
                        } text-end `}
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col md={12}>
                    <Spin spinning={loader}>
                      <div
                        className="tableFixHead bg-white ps-table "
                        style={{ height: "calc(100vh - 160px)" }}
                      >
                        <table>
                          <thead>
                            <tr>
                              <th>Category</th>
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
                                <>
                                  <tr>
                                    <td colSpan={5}>
                                      <b>{semesterValue(item[0].semester)}</b>
                                    </td>
                                  </tr>
                                  {innerRow(item)}
                                  <tr className="">
                                    <td align="right">Total</td>
                                    <td align="right">
                                      <b>{rowsTotal(item, "total")}</b>
                                    </td>
                                    <td align="right">
                                      <b>{rowsTotal(item, "paid")}</b>
                                    </td>
                                    <td align="right">
                                      <b>{rowsTotal(item, "concession")}</b>
                                    </td>
                                    <td align="right">
                                      <b>{rowsTotal(item, "balance")}</b>
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                          </tbody>
                          <tfoot className="fw-bold">
                            <tr>
                              <td className="" align="right">
                                Total
                              </td>
                              <td className="" align="right">
                                <b>{rowsTotal(dataList, "total")}</b>
                              </td>
                              <td className="" align="right">
                                <b>{rowsTotal(dataList, "paid")}</b>
                              </td>
                              <td className="" align="right">
                                <b>{rowsTotal(dataList, "concession")}</b>
                              </td>
                              <td className="" align="right">
                                <b>{rowsTotal(dataList, "balance")}</b>
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
        <PrintStudentDemanReport
          dataSource={dataList}
          dataSourceView={dataView}
          balance={balance}
          onSuccess={(e) => setPrintReport(false)}
          course={selectedCourse}
        />
      )}
    </>
  );
};

export default StudentWiseDemandReport;
