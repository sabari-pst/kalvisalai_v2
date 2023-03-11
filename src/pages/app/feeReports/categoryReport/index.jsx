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
import PrintCategoryReport from "./printCategoryReport";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const CategoryReport = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [printModal, setPrintModal] = useState(false);
  const [printReport, setPrintReport] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  useEffect(() => {
    //loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    const form = new FormData();
    form.append("from_date", fromDate);
    form.append("to_date", toDate);
    axios.post(ServiceUrl.FEES.FEE_CATEGORY_REPORT, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        setDataView(res["data"].data);
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
        upperCase(item.category_print_name).indexOf(v) > -1 ||
        upperCase(item.category_name).indexOf(v) > -1
    );
    setDataView(d);
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to delete?")) {
      return false;
    }

    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    axios
      .post(ServiceUrl.FEE_CATEGORY.DELETE_PAYMENT_METHOD, form)
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          setDataView(dataList.filter((obj) => obj.id !== item.id));
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

  const handlePrintClick = (item) => {
    setViewData(item);
    setPrintModal(true);
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Fee Category Report">
          <ul className="list-inline mb-0">
            <ModuleAccess
              module={"fee_report_category_wise"}
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
                  className="tableFixHead ps-table bg-white  "
                  style={{ height: "calc(100vh - 150px)" }}
                >
                  <table>
                    <thead>
                      <tr>
                        <th width="60">S.No</th>
                        <th>Category</th>
                        <th>Account No</th>
                        <th width="150" className="text-center">
                          Amount
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
                            <td className="">{i + 1}</td>
                            <td className="">
                              {item.category_print_name || item.category_name}
                            </td>
                            <td align="center" className="">
                              {item.category_account_no}
                            </td>
                            <td align="right" className="">
                              {item.total_amount || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} align="right" className="">
                          Total :{" "}
                        </td>
                        <td align="right" className="">
                          <b>{getTotalByField("total_amount")}</b>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Spin>
            </Col>
          </Row>
        </div>
      </CashbookLayout>

      {printReport && (
        <PrintCategoryReport
          dataSource={dataView}
          fromDate={fromDate}
          toDate={toDate}
          onSuccess={(e) => setPrintReport(false)}
        />
      )}
    </>
  );
};

export default CategoryReport;
