import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  Alert,
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  getAscSortOrder,
  groupByMultiple,
  jsonToQuery,
  momentDate,
  printDocument,
  semesterValue,
  timeTableDayFromNumber,
  upperCase,
} from "../../../../utils";
import { Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";

import ModuleAccess from "../../../../context/moduleAccess";

import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import { dayOrderByBatch } from "../../../../models/timetable";
import DayOrderRowWithStaff from "./dayOrderRowWithStaff";
import { TABLE_STYLES } from "../../../../utils/data";

const IncompleteEntry = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState([]);

  const [dayOrderListSource, setDayOrderListSource] = useState([]);
  const [dayOrderList, setDayOrderList] = useState([]);
  const [timeTable, setTimeTable] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [statusFilter, setStatusFilter] = useState(-1);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (selectedCourse.course_id) {
      loadDayOrder();
      loadTimeTable();
      loadAttendance();
    }
  }, [selectedCourse]);

  const loadDayOrder = () => {
    setLoader(true);
    setDayOrderList([]);
    dayOrderByBatch(
      "batch=" +
        selectedCourse.academic_year +
        "&semester=" +
        selectedCourse.semester
    ).then((res) => {
      if (res) {
        setDayOrderList(res);
        setDayOrderListSource(res);
      }
      setLoader(false);
    });
  };

  const loadTimeTable = () => {
    setLoader(true);
    setTimeTable([]);
    const form = new FormData();
    form.append("academic_year", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    axios.post(ServiceUrl.SETTINGS.GET_TIMETABLE, form).then((res) => {
      if (res["data"].status == "1") {
        setTimeTable(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const loadAttendance = () => {
    setLoader(true);
    setAttendance([]);
    const form = new FormData();
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    axios
      .post(ServiceUrl.STUDENTS.GET_MARKED_GROUP_BY_DAYHOUR, form)
      .then((res) => {
        if (res["data"].status == "1") {
          setAttendance(res["data"].data);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const resetAll = () => {
    setSelectedCourse([]);
    setDayOrderList([]);
    setTimeTable([]);
    setAttendance([]);
    setStatusFilter(-1);
  };

  const getTitle = () => {
    if (selectedCourse.course_id) {
      return `Day Order Summary > ${selectedCourse.academic_year} > ${
        selectedCourse.course_name
      } > ${selectedCourse.semester} Sem > ${upperCase(
        selectedCourse.section
      )}`;
    } else return "Day Order Summary";
  };

  const handlePrintClick = () => {
    printDocument("prin_attendance_summary_report");
  };

  const printTitle = () => {
    if (selectedCourse.course_id) {
      return `${selectedCourse.academic_year} / ${
        selectedCourse.course_name
      } / ${selectedCourse.semester} Sem / ${upperCase(
        selectedCourse.section
      )}`;
    }
  };

  const dateReset = () => {
    setFromDate("");
    setToDate("");
    setDayOrderList(dayOrderListSource);
  };

  const viewDatefilter = () => {
    if (fromDate.length < 1) {
      toast.error("Select From Date");
      return;
    }
    if (toDate.length < 1) {
      toast.error("Select To Date");
      return;
    }
    let m = dayOrderListSource.filter(
      (item) => item.day_order_date >= fromDate && item.day_order_date <= toDate
    );
    m = groupByMultiple(m, function (obj) {
      return [obj.day_order_date];
    });
    let x = m.map((item) => item[0]);
    setDayOrderList(x);
  };

  return (
    <>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          {dayOrderList.length > 0 &&
            timeTable.length > 0 &&
            attendance.length > 0 && (
              <ModuleAccess
                module="stu_att_dayorder_report"
                action="action_print"
              >
                <li className="list-inline-item">
                  <select
                    className="form-select form-select-sm fw-bold"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option
                      value="-1"
                      selected={statusFilter == -1 ? "selected" : ""}
                    >
                      All
                    </option>
                    <option
                      value="0"
                      selected={statusFilter == 0 ? "selected" : ""}
                    >
                      Pending
                    </option>
                    <option
                      value="1"
                      selected={statusFilter == 1 ? "selected" : ""}
                    >
                      Completed
                    </option>
                  </select>
                </li>
                <li className="list-inline-item">
                  <Button
                    variant="white"
                    className="border-start ms-2"
                    onClick={handlePrintClick}
                  >
                    <i className="fa fa-print fs-5 px-1"></i> Print
                  </Button>
                </li>
              </ModuleAccess>
            )}

          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={resetAll}
            >
              <i className="fa fa-xmark fs-5 px-1"></i> Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container py-3">
        <Spin spinning={loader}>
          <div style={{ minHeight: "250px" }}>
            {!selectedCourse.course_id && (
              <Row className="mt-2">
                <Col md={6}>
                  <SelectRecords
                    onSuccess={(d) => setSelectedCourse(d)}
                    withSection={true}
                  />
                </Col>
              </Row>
            )}

            {dayOrderList.length > 0 &&
              timeTable.length > 0 &&
              attendance.length > 0 && (
                <div style={{ fontSize: "12px" }}>
                  <Row>
                    <Col md={2}>
                      <InputGroup size="sm">
                        <InputGroup.Text>From</InputGroup.Text>
                        <Form.Control
                          type="date"
                          size="sm"
                          className="fw-bold"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={2}>
                      <InputGroup size="sm">
                        <InputGroup.Text>To</InputGroup.Text>
                        <Form.Control
                          type="date"
                          size="sm"
                          className="fw-bold"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        size="sm"
                        className="w-100"
                        onClick={viewDatefilter}
                      >
                        View
                      </Button>
                    </Col>
                    {(fromDate || toDate) && (
                      <Col md={1}>
                        <Button
                          type="button"
                          size="sm"
                          className="w-100"
                          variant="danger"
                          onClick={dateReset}
                        >
                          Reset
                        </Button>
                      </Col>
                    )}
                  </Row>
                  <Card className="mt-3">
                    <Card.Body>
                      <DayOrderRowWithStaff
                        dayOrderSource={dayOrderList}
                        timeTableSource={timeTable}
                        attendanceSource={attendance}
                        status={statusFilter}
                      />
                    </Card.Body>
                  </Card>
                </div>
              )}
          </div>
        </Spin>

        <div id="prin_attendance_summary_report" style={{ display: "none" }}>
          <div style={{ fontSize: "11px" }}>
            <table
              width="100%"
              align="center"
              style={TABLE_STYLES.tableCollapse}
            >
              <tr style={{ fontSize: "12px" }}>
                <td align="center">
                  <b>
                    {context.settingValue("billheader_name")}
                    <br />
                    {context.settingValue("billheader_addresslineone") && (
                      <>
                        {context.settingValue("billheader_addresslineone")}{" "}
                        <br />
                      </>
                    )}
                    {context.settingValue("billheader_addresslinetwo") && (
                      <>
                        {context.settingValue("billheader_addresslinetwo")}{" "}
                        <br />
                      </>
                    )}
                  </b>
                  <br />
                  Attendance Day Order Summary
                  {statusFilter == 0 && " - In-Complete Entry"}
                  {statusFilter == 1 && " - Completed Entries"}
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: "12px" }}>
                  <b>{printTitle()}</b>
                </td>
              </tr>
              <tr>
                <td>
                  <DayOrderRowWithStaff
                    dayOrderSource={dayOrderList}
                    timeTableSource={timeTable}
                    attendanceSource={attendance}
                    status={statusFilter}
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(IncompleteEntry);
