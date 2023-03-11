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

import FeeReceiptPrintA5 from "../feeReceiptPrintA5";
import PrintPaymentReport from "./printPaymentReport";
import { NoDataFound } from "../../components";
import ModuleAccess from "../../../../context/moduleAccess";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const FeePaymentList = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [printModal, setPrintModal] = useState(false);
  const [printReport, setPrintReport] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [cancelledBills, setCancelledBills] = useState([]);

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  useEffect(() => {
    if (context.cashbook.id) {
      listPaymentMethods("1").then((res) => {
        if (res) setPaymentMethods(res);
      });
      loadData();
    }
  }, [JSON.stringify(context.cashbook)]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    const form = new FormData();
    form.append("from_date", fromDate);
    form.append("to_date", toDate);
    form.append("type", "paid");
    form.append("group_by", "a.bill_id");
    axios.post(ServiceUrl.FEES.LIST_STUDENT_PAYMENT, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        setDataView(res["data"].data);
        setCancelledBills(res["data"].cancelled);
      }
      setLoader(false);
    });
  };

  const handleSearch = (e) => {
    let v = upperCase(e.target.value);
    let d = dataList.filter(
      (item) =>
        upperCase(item.student_name).indexOf(v) > -1 ||
        upperCase(item.bill_no).indexOf(v) > -1
    );
    setDataView(d);
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to cancel bill?")) {
      return false;
    }

    setLoader(true);
    const form = new FormData();
    form.append("bill_id", item.bill_id);
    form.append("bill_date", item.bill_date);
    form.append("bill_uuid", item.bill_uuid);

    axios.post(ServiceUrl.FEES.CANCEL_BILL, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        loadData();
        //setDataView(dataList.filter( obj => obj.id !== item.id));
      } else toast.error(res["data"].message || "Error");

      setLoader(false);
    });
  };

  const handleEdit = (item) => {
    setViewData(item);
    setEditModal(true);
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

  const getTotalByFieldAndMethodId = (fieldName, methodId) => {
    let total = 0;
    let dv = dataView.filter((item) => item.payment_method_id == methodId);
    dv.map(
      (item) =>
        item[fieldName] &&
        (total = parseFloat(total) + parseFloat(item[fieldName]))
    );
    return parseFloat(total).toFixed(2);
  };

  const handlePrintClick = (item) => {
    setViewData(item);
    setPrintModal(true);
  };

  useEffect(() => {
    let dl = dataList;
    if (selectedPaymentMethod && selectedPaymentMethod != "0")
      dl = dl.filter((item) => item.payment_method_id == selectedPaymentMethod);
    setDataView(dl);
  }, [selectedPaymentMethod]);

  const getSelectedPaymentMethodName = () => {
    let x = paymentMethods.find((item) => item.id == selectedPaymentMethod);
    return x && x.method_name ? x.method_name : "";
  };
  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Fee Payment List">
          <ul className="list-inline mb-0">
            <ModuleAccess module={"fees_new_payment"} action={"action_create"}>
              <li className="list-inline-item">
                <Link
                  to="/app/fee-payment/new-payment"
                  className="btn btn-transparent border-start ms-2"
                >
                  <i className="fa-solid fa-plus pe-1"></i> New
                </Link>
              </li>
            </ModuleAccess>
            <ModuleAccess module={"fee_payment_list"} action={"action_print"}>
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
                onClick={(e) => loadData()}
              >
                <i className="fa fa-rotate fs-5 px-1"></i>
              </Button>
            </li>
          </ul>
        </CardFixedTop>

        <div className="container mt-2">
          <Row className="">
            <Col md={2}>
              <InputGroup size="sm">
                <InputGroup.Text>From</InputGroup.Text>
                <Form.Control
                  type="date"
                  max={momentDate(new Date(), "YYYY-MM-DD")}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="fw-bold"
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <InputGroup size="sm">
                <InputGroup.Text>To</InputGroup.Text>
                <Form.Control
                  type="date"
                  max={momentDate(new Date(), "YYYY-MM-DD")}
                  min={fromDate}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="fw-bold"
                />
              </InputGroup>
            </Col>
            <Col md={1}>
              <Button
                size="sm"
                className="btn-block"
                onClick={(e) => loadData()}
              >
                View
              </Button>
            </Col>
            <Col md={3}>
              <InputGroup size="sm">
                <InputGroup.Text>Payment Type</InputGroup.Text>

                <Form.Control
                  as="select"
                  size="sm"
                  className="fw-bold form-select form-select-sm"
                  name="payment_method_id"
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                >
                  <option value="0">All</option>
                  {paymentMethods.map((item) => (
                    <option value={item.id}>{item.method_name}</option>
                  ))}
                </Form.Control>
              </InputGroup>
            </Col>
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroup.Text>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search..."
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
                        <th width="100">Date</th>
                        <th width="100">Bill No</th>
                        <th>Name of the Student</th>
                        <th>Register No</th>
                        <th>Course</th>
                        <th width="60">Sem</th>
                        <th className="text-center">Type</th>
                        <th width="100" className="text-center">
                          Amount
                        </th>
                        <th width="100" className="text-center">
                          Concession
                        </th>
                        {/*<th width="100" className="text-center" >Discount</th>*/}
                        <th width="100" className="text-center">
                          Total
                        </th>
                        <th width="100" className="text-center">
                          #
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataView.map((item, i) => {
                        return (
                          <tr
                            key={i}
                            className={
                              item.active_status == "0" ? "text-danger" : ""
                            }
                          >
                            <td>{i + 1}</td>
                            <td>{momentDate(item.bill_date, "DD-MM-YYYY")}</td>
                            <td>{item.bill_no}</td>
                            <td align="left">{item.student_name}</td>
                            <td align="left">
                              {item.registerno || item.admissionno}
                            </td>
                            <td>
                              {item.degree_name}
                              {item.course_short_name &&
                                ` - ${item.course_short_name} `}
                              {upperCase(item.course_type) == "SELF"
                                ? "(SF)"
                                : "(R)"}
                            </td>
                            <td>{item.semester}</td>
                            <td>{item.payment_method_name}</td>
                            <td align="right">{item.bill_grand_total}</td>
                            <td align="right">
                              {item.part_type == "concession" &&
                                item.total_concession}
                            </td>
                            {/*<td align="right">{item.bill_discount}</td>*/}
                            <td align="right">{item.bill_amount}</td>
                            <td align="center">
                              <ModuleAccess
                                module={"fee_payment_list"}
                                action={"action_print"}
                              >
                                <Button
                                  size="sm"
                                  variant="transparent"
                                  title="Edit"
                                  onClick={(e) => handlePrintClick(item, e)}
                                >
                                  <i className="fa-solid fa-print"></i>
                                </Button>
                              </ModuleAccess>
                              <ModuleAccess
                                module={"fee_cancel"}
                                action={"action_create"}
                              >
                                <Button
                                  size="sm"
                                  variant="transparent"
                                  title="Cancel"
                                  onClick={(e) => handleDelete(item)}
                                >
                                  <i className="fa-solid fa-ban"></i>
                                </Button>
                              </ModuleAccess>
                            </td>
                          </tr>
                        );
                      })}
                      {!loader && dataView.length < 1 && (
                        <tr>
                          <td colSpan={12}>
                            <NoDataFound className="my-4" />
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={8} align="right">
                          Total :{" "}
                        </td>
                        <td align="right">
                          <b>{getTotalByField("bill_grand_total")}</b>
                        </td>
                        <td align="right">
                          <b>{getTotalByField("total_concession")}</b>
                        </td>
                        {/*<td align="right">
                        <b>{getTotalByField("bill_discount")}</b>
					</td>*/}
                        <td align="right">
                          <b>{getTotalByField("bill_amount")}</b>
                        </td>
                        <td align="right"></td>
                      </tr>
                      {paymentMethods.map((item, i) => {
                        return (
                          <tr>
                            <td colSpan={8} align="right">
                              {item.method_name}
                            </td>
                            <td align="right">
                              <b>
                                {getTotalByFieldAndMethodId(
                                  "bill_grand_total",
                                  item.id
                                )}
                              </b>
                            </td>
                            <td align="right">
                              <b>
                                {getTotalByFieldAndMethodId(
                                  "total_concession",
                                  item.id
                                )}
                              </b>
                            </td>
                            {/*<td align="right">
                            <b>
                              {getTotalByFieldAndMethodId(
                                "bill_discount",
                                item.id
                              )}
                            </b>
							  </td>*/}
                            <td align="right">
                              <b>
                                {getTotalByFieldAndMethodId(
                                  "bill_amount",
                                  item.id
                                )}
                              </b>
                            </td>
                            <td align="right"></td>
                          </tr>
                        );
                      })}
                    </tfoot>
                  </table>
                </div>
              </Spin>
            </Col>
          </Row>
        </div>
      </CashbookLayout>
      {printModal && (
        <FeeReceiptPrintA5
          onSuccess={(e) => {
            setPrintModal(false);
            setViewData([]);
          }}
          dataSource={viewData}
        />
      )}

      {printReport && (
        <PrintPaymentReport
          dataSource={dataView}
          paymentListSource={paymentMethods}
          cancelledSource={cancelledBills}
          fromDate={fromDate}
          toDate={toDate}
          onSuccess={(e) => setPrintReport(false)}
          paymentMethodName={getSelectedPaymentMethodName()}
        />
      )}
    </>
  );
};

export default FeePaymentList;
