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
  groupByMultiple,
  momentDate,
  upperCase,
} from "../../../../utils";

import { listFeeCategoy, listPaymentMethods } from "../../../../models/fees";
import axios from "axios";
import { formatCountdown } from "antd/lib/statistic/utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { Spin } from "antd";
import PrintCourseSummary from "./printCourseSummary";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const CourseSummary = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [printModal, setPrintModal] = useState(false);
  const [printReport, setPrintReport] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  useEffect(() => {
    if (context.cashbook.id)
      listFeeCategoy("1").then((res) => res && setCategories(res));
    //loadData();
  }, [JSON.stringify(context.cashbook)]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    const form = new FormData();
    form.append("from_date", fromDate);
    form.append("to_date", toDate);
    form.append("report_type", "course_summary");
    axios.post(ServiceUrl.FEES.FEE_CATEGORY_SUMMARY, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        setFilteredData(res["data"].data);
        let d = groupByMultiple(res["data"].data, function (obj) {
          return [obj.course];
          //return [obj.student_uuid];
        });
        setDataView(d);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleSearch = (e) => {
    let v = upperCase(e.target.value);
    let d = dataList.filter(
      (item) =>
        upperCase(item.bill_no).indexOf(v) > -1 ||
        upperCase(item.student_name).indexOf(v) > -1 ||
        upperCase(item.registerno).indexOf(v) > -1
    );
    let x = groupByMultiple(d, function (obj) {
      return [obj.bill_uuid];
    });
    setFilteredData(d);
    setDataView(x);
  };

  const getTotalByField = (fieldName) => {
    let total = 0;
    filteredData.map(
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

  const getAccountAmountFromStudent = (categoryId, studentData) => {
    let m = studentData.find((item) => item.fee_category_id == categoryId);

    return m ? m.fee_amount : "-";
  };

  const getStudentsTotal = (studentsData) => {
    let total = 0;
    studentsData.map(
      (item) =>
        item.fee_amount &&
        (total = parseFloat(total) + parseFloat(item.fee_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  const categoryTotal = (categoryId) => {
    let m = filteredData.filter((item) => item.fee_category_id == categoryId);
    let total = 0;
    m.map(
      (item) =>
        item.fee_amount &&
        (total = parseFloat(total) + parseFloat(item.fee_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Course Summary">
          <ul className="list-inline mb-0">
            <ModuleAccess
              module={"fee_report_course_summary"}
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
            <Col md={3}></Col>
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
                  className="tableFixHead bg-white "
                  style={{ height: "calc(100vh - 250px)" }}
                >
                  <table>
                    <thead>
                      <tr>
                        <th width="60">S.No</th>

                        <th>Course</th>
                        <th>Sem</th>
                        {categories.map((item) => (
                          <th align="left">{item.category_account_no}</th>
                        ))}
                        <th width="150" className="text-center">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataView.map((items, i) => {
                        let item = items[0];
                        return (
                          <tr
                            key={i}
                            className={
                              item.active_status == "0" ? "text-danger" : ""
                            }
                          >
                            <td>{i + 1}</td>

                            <td>
                              {item.degree_name}
                              {item.course_short_name &&
                                ` - ${item.course_short_name} `}
                              {upperCase(item.course_type) == "SELF"
                                ? "(SF)"
                                : "(R)"}
                            </td>
                            <td>{item.semester}</td>
                            {categories.map((obj) => (
                              <td align="right">
                                {getAccountAmountFromStudent(obj.id, items)}
                              </td>
                            ))}
                            <td align="right">{getStudentsTotal(items)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} align="right">
                          Total :{" "}
                        </td>
                        {categories.map((obj) => (
                          <td align="right">
                            <b>{categoryTotal(obj.id)}</b>
                          </td>
                        ))}
                        <td align="right">
                          <b>{getTotalByField("fee_amount")}</b>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <Row className="mt-3 ">
                  {categories.map((item) => (
                    <Col md={3} className="py-2">
                      {item.category_account_no} -{" "}
                      {item.category_print_name || item.category_name} -{" "}
                      <b>{categoryTotal(item.id)}</b>
                    </Col>
                  ))}
                </Row>
              </Spin>
            </Col>
          </Row>
        </div>
      </CashbookLayout>

      {printReport && (
        <PrintCourseSummary
          dataSource={dataView}
          dataSourceList={filteredData}
          categories={categories}
          fromDate={fromDate}
          toDate={toDate}
          onSuccess={(e) => setPrintReport(false)}
        />
      )}
    </>
  );
};

export default CourseSummary;
