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
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { Spin } from "antd";
import PrintCategoryReport from "./printCategoryReport";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const FeeSemYearCollectionReport = (props) => {
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

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  useEffect(() => {
    if (context.cashbook.id)
      if (selectedCourse && selectedCourse.academic_year) loadData();
  }, [selectedCourse, JSON.stringify(context.cashbook)]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    const form = new FormData();
    form.append("academic_year", selectedCourse.academic_year);
    form.append("course_type", selectedCourse.course_type);
    form.append("fee_group_id", selectedCourse.fee_group_id);
    form.append("fee_category_id_list", selectedCourse.fee_category_id_list);
    form.append("semester", selectedCourse.semester);

    axios.post(ServiceUrl.FEES.CUSTOM_FEE_CATEGORY_REPORT, form).then((res) => {
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

  const resetAll = () => {
    setDataList([]);
    setDataView([]);
    setSelectedCourse([]);
    setLoader(false);
  };

  const getTitle = () => {
    if (!selectedCourse.academic_year)
      return `${capitalizeFirst(
        props.match.params.type
      )} Wise Collection Report`;
    return `${capitalizeFirst(
      props.match.params.type
    )} Wise Collection Report > ${upperCase(selectedCourse.course_type)} - ${
      selectedCourse.academic_year
    } ${selectedCourse.semester && " - Sem " + selectedCourse.semester} - ${
      selectedCourse.fee_group_name
    }`;
  };

  const reportRightTitle = () => {
    return `${upperCase(selectedCourse.course_type)} / ${
      selectedCourse.academic_year
    } ${selectedCourse.semester && " / Sem " + selectedCourse.semester} / ${
      selectedCourse.fee_group_name
    }`;
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title={getTitle()}>
          <ul className="list-inline mb-0">
            <ModuleAccess
              module={"fee_report_sem_collection"}
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

          {selectedCourse && selectedCourse.academic_year && (
            <>
              <Row className="">
                <Col md={8}></Col>
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
                                  {item.category_print_name ||
                                    item.category_name}
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
            </>
          )}
        </div>
      </CashbookLayout>

      {printReport && (
        <PrintCategoryReport
          dataSource={dataView}
          fromDate={fromDate}
          toDate={toDate}
          onSuccess={(e) => setPrintReport(false)}
          title={`${capitalizeFirst(
            props.match.params.type
          )} Wise Collection Report`}
          rightTitle={reportRightTitle()}
        />
      )}
    </>
  );
};

export default FeeSemYearCollectionReport;
