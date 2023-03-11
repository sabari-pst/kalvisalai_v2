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
  semesterValue,
  upperCase,
} from "../../../../utils";

import { listPaymentMethods } from "../../../../models/fees";
import axios from "axios";
import { formatCountdown } from "antd/lib/statistic/utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { Spin } from "antd";

import { CustomDropDown } from "../../components";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import PrintClassWisePending from "./printClassWisePending";
import { listVehicles } from "../../../../models/transport";
import ModuleAccess from "../../../../context/moduleAccess";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const TransportPendingReport = (props) => {
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

  const [vehicles, setVechicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  useEffect(() => {
    if (context.cashbook.id)
      if (selectedCourse && selectedCourse.course_id) loadData();
  }, [selectedCourse, JSON.stringify(context.cashbook)]);

  useEffect(() => {
    if (context.cashbook.id) {
      loadData();
      listVehicles().then((res) => res && setVechicles(res));
    }
  }, [JSON.stringify(context.cashbook)]);

  const loadData = () => {
    setLoader(true);
    //CLASS_WISE_PENDING
    const form = new FormData();
    form.append("type", "unpaid");
    form.append("report_type", "transport");
    form.append("fee_category_id", context.settingValue("bus_fee_category_id"));

    axios.post(ServiceUrl.FEES.CUSTOM_FEE_REPORT, form).then((res) => {
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
        upperCase(item.student_name).indexOf(v) > -1 ||
        upperCase(item.registerno).indexOf(v) > -1
    );
    setDataView(d);
  };

  const vehicleChange = (v, dt) => {
    let d = dataList;
    if (v != "0") {
      d = dataList.filter((item) => item.vehicle_no == dt.vehicle_no);
      setSelectedVehicle(dt.vehicle_no);
    }
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

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Transport Fee Pending">
          <ul className="list-inline mb-0">
            <ModuleAccess
              module={"transport_fee_pending_list"}
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
                <i className="fa-solid fa-rotate fs-5 px-1"></i> Reload
              </Button>
            </li>
          </ul>
        </CardFixedTop>

        <div className="container mt-2">
          <Spin spinning={loader}>
            <Row className="mt-2">
              <Col md={4}>
                <CustomDropDown
                  value="id"
                  dataSource={vehicles}
                  placeholder={"Select Vehicle"}
                  displayField={(item) => `${item.vehicle_no}`}
                  defaultOption={true}
                  onChange={vehicleChange}
                />
              </Col>
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
                    className="tableFixHead bg-white ps-table "
                    style={{ height: "calc(100vh - 150px)" }}
                  >
                    <table>
                      <thead>
                        <tr>
                          <th width="60">S.No</th>
                          <th>Reg.No</th>
                          <th>Student Name</th>
                          <th>Program</th>
                          <th>SEM</th>
                          <th>Father Name</th>
                          <th>Address</th>
                          <th>Vehicle/Route</th>
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
                              <td>{i + 1}</td>
                              <td>{item.registerno || item.admissionno}</td>
                              <td>{item.student_name}</td>
                              <td>
                                {item.degree_name}-{item.course_name} (
                                {upperCase(item.course_type) == "SELF"
                                  ? "SF"
                                  : "R"}
                                )
                              </td>
                              <td>{semesterValue(item.semester)}</td>
                              <td>{item.fathername}</td>
                              <td>{item.village_permanent}</td>
                              <td>
                                {upperCase(item.vehicle_no)}
                                <br />
                                {upperCase(item.destination_name)}
                              </td>
                              <td align="right">{getTotalAmount(item)}</td>
                              <td align="right">{item.total_paid || "-"}</td>
                              <td align="right">
                                {item.total_concession || "-"}
                              </td>
                              <td align="right">{item.total_unpaid || "-"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={8} align="right">
                            Total :{" "}
                          </td>
                          <td align="right">
                            <b>{getOverallTotal()}</b>
                          </td>
                          <td align="right">
                            <b>{getTotalByField("total_paid")}</b>
                          </td>
                          <td align="right">
                            <b>{getTotalByField("total_concession")}</b>
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
          </Spin>
        </div>
      </CashbookLayout>

      {printReport && (
        <PrintClassWisePending
          dataSource={dataView}
          onSuccess={(e) => setPrintReport(false)}
          course={selectedCourse}
          selectedVehicle={selectedVehicle}
        />
      )}
    </>
  );
};

export default TransportPendingReport;
