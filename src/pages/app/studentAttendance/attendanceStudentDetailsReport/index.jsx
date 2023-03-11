import { Spin } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import PsContext from "../../../../context";
import ModuleAccess from "../../../../context/moduleAccess";
import { getSemesterDates } from "../../../../models/academicYears";
import { listHolidays } from "../../../../models/hr";
import {
  CardFixedTop,
  getAscSortOrder,
  groupByMultiple,
  listMonths,
  momentDate,
  printDocument,
  semesterValue,
  upperCase,
} from "../../../../utils";
import { TABLE_STYLES } from "../../../../utils/data";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import SearchStudent from "../../feePayment/newFeePayment/searchStudent";

const AttendanceStudentDetailsReport = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState([]);

  const [students, setStudents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [semesterDates, setSemesterDates] = useState([]);

  const [markedStudentSource, setMarkedStudentSource] = useState([]);
  const [markedStudents, setMarkedStudents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [displayAsNo, setDisplayAsNo] = useState(false);

  const [today, setToday] = useState("");

  const hourCount =
    (selectedCourse.att_hour_per_day &&
      selectedCourse.att_hour_per_day != "0" &&
      selectedCourse.att_hour_per_day) ||
    context.settingValue("hour_for_attendance_per_day");

  const dayOrderCount = context.settingValue("attendance_day_order_count");
  const dayOrderInDayName = context.settingValue(
    "attendance_dayorder_as_day_name"
  );

  const startOfMonth = moment(selectedMonth)
    .startOf("month")
    .format("YYYY-MM-DD");
  const endOfMonth = moment(selectedMonth).endOf("month").format("YYYY-MM-DD");
  let start = momentDate(startOfMonth, "DD");
  let end = momentDate(endOfMonth, "DD");

  useEffect(() => {
    //loadHolidays();
  }, []);

  useEffect(() => {
    if (selectedCourse.uuid) {
      listSemesterDates();
    }
  }, [selectedCourse]);

  const loadHolidays = () => {
    setLoader(true);
    listHolidays("1&month=" + selectedMonth + "-01").then((res) => {
      if (res.data) setHolidays(res.data);
      setLoader(false);
    });
  };

  const listSemesterDates = () => {
    setLoader(true);
    getSemesterDates(selectedCourse.batch, selectedCourse.semester).then(
      (res) => {
        if (res) setSemesterDates(res[0]);
        setLoader(false);
      }
    );
  };

  const handleViewClick = () => {
    if (selectedMonth.length < 4) {
      toast.error("Select a month");
      return;
    }

    loadHolidays();
    loadMarkedAttendance();
  };

  const loadMarkedAttendance = () => {
    setShowReport(false);
    setLoader(true);
    setMarkedStudents([]);

    const form = new FormData();
    form.append("academic_year", selectedCourse.batch);
    form.append("course", selectedCourse.course);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    form.append("student_uuid", selectedCourse.uuid);
    form.append("attendance_month", selectedMonth);

    axios.post(ServiceUrl.STUDENTS.DATE_WISE_ATTENDANCE, form).then((res) => {
      if (res["data"].status == "1") {
        let d = res["data"].data;
        holidays.map((item) =>
          d.push({
            attendance_date: item.holiday_date,
            holiday_type: item.holiday_type,
            holiday_name: item.holiday_name,
          })
        );
        d.sort(getAscSortOrder("attendance_date"));
        let m = groupByMultiple(d, function (obj) {
          return [obj.attendance_date];
        });
        setMarkedStudentSource(res["data"].data);
        setMarkedStudents(m);
        setToday(res["data"].today);
      }
      setLoader(false);
      setShowReport(true);
    });
  };

  const resetAll = () => {
    setShowReport(false);
    setSelectedMonth("");
    setSelectedCourse([]);
    setStudents([]);
  };

  const loadSemesterMonths = () => {
    let rv = [];
    let months = listMonths(semesterDates?.start_date, semesterDates?.end_date);
    if (months && months.length > 0)
      months.map((item) =>
        rv.push(<option value={item}>{momentDate(item, "YYYY-MMM")}</option>)
      );
    return rv;
  };

  const dayTitleColumns = () => {
    let rv = [];

    for (let i = 1; i <= hourCount; i++) {
      rv.push(
        <th width="25" style={TABLE_STYLES.borderAll}>
          H{("0" + i).slice(-2)}
        </th>
      );
    }

    return rv;
  };

  const dayDataColumns = (items) => {
    let rv = [];

    // to check the given day is holiday
    if (items[0]?.holiday_type) {
      let h = items[0].holiday_type;
      for (let i = 1; i <= hourCount; i++) {
        rv.push(
          <td width="25" align="center" style={TABLE_STYLES.borderAll}>
            <span style={{ color: h == "s" ? "#db0e89" : "purple" }}>
              {upperCase(h)}
            </span>
          </td>
        );
      }
      return rv;
    }

    for (let i = 1; i <= hourCount; i++) {
      let item = items.find((obj) => obj.hour_value == i);
      if (item) {
        let h = item.leave_type;
        if (upperCase(item.leave_type) != "P") {
          // Push Holiday Info like Sunday - S, Holiday - H
          rv.push(
            <td width="25" style={TABLE_STYLES.borderAll} align="center">
              <span style={{ color: h == "s" ? "#db0e89" : "purple" }}>
                {upperCase(h)}
              </span>
            </td>
          );
        } else {
          rv.push(
            <td width="25" align="center" style={TABLE_STYLES.borderAll}>
              P
            </td>
          );
        }
      } else {
        rv.push(
          <td width="25" align="center" style={TABLE_STYLES.borderAll}>
            -
          </td>
        );
      }
    }
    return rv;
  };

  const totalDays = () => {
    let days = 0;
    for (let i = start; i <= end; i++) {
      let day = selectedMonth + "-" + ("0" + i).slice(-2);

      if (
        moment(day) >= moment(semesterDates?.start_date) &&
        moment(day) <= moment(semesterDates?.end_date) &&
        moment(day) <= moment(today)
      ) {
        if (!checkHoliday(day)) days = parseInt(days) + 1;
      }
    }
    return days;
  };

  const checkHoliday = (dt) => {
    let m = holidays.find((item) => item.holiday_date == dt);
    return m?.holiday_type;
  };

  // to get Attendace value
  const getAttendanceDayValueForADay = (day, stu, asNumber = false) => {
    // get attendace entry for a day
    let s = markedStudents.filter(
      (item) => item.attendance_date == day && item.student_uuid == stu.uuid
    );

    // Return if attendace not marked for the day
    if (moment(day) > moment(new Date())) return asNumber ? 0 : "";
    if (s.length < 1) return asNumber ? "-" : "-";
    let lt = upperCase(s?.[0]?.leave_type);
    if (asNumber) {
      if (lt == "LA") return 0;
      else {
        // calculate total no of presents
        let pcount = s.filter((item) => item.leave_type == "p");
        if (pcount.length < 1) return 0;
        else if (pcount.length < hourCount / 2) return 0.5;
        else if (pcount.length == hourCount) return 1;
        else return 1;
      }
    } else {
      if (lt == "A") return <span style={{ color: "red" }}>A</span>;
      else if (lt == "OD") return <span style={{ color: "green" }}>OD</span>;
      else if (lt == "P") return <span style={{ color: "green" }}>P</span>;
      else if (lt == "LA") return <span style={{ color: "red" }}>LA</span>;
      else return <span style={{ color: "red" }}>A</span>;
    }
    //return s?.[0]?.leave_type;
  };

  const daysPresent = (stu) => {
    let days = 0;
    for (let i = start; i <= end; i++) {
      let day = selectedMonth + "-" + ("0" + i).slice(-2);

      if (
        moment(day) >= moment(semesterDates?.start_date) &&
        moment(day) <= moment(semesterDates?.end_date) &&
        moment(day) <= moment(today)
      ) {
        if (!checkHoliday(day)) {
          let d = getAttendanceDayValueForADay(day, stu, true);

          if (d && d != "-") days = parseFloat(days) + parseFloat(d);
        }
      }
    }
    return days; //.toFixed();
  };

  const printReport = () => {
    printDocument("stu_att_students_detail_view_print");
  };

  return (
    <div>
      <CardFixedTop title={"Student Detailed Report"}>
        <ul className="list-inline mb-0">
          <ModuleAccess
            module="stu_att_students_detail_view"
            action="action_print"
          >
            {showReport && (
              <li className="list-inline-item border-start">
                <Button
                  size="sm"
                  type="button"
                  variant="transparent"
                  className="fs-6 "
                  onClick={(e) => printReport()}
                >
                  <i className="fa-solid fa-print me-2"></i>Print
                </Button>
              </li>
            )}
          </ModuleAccess>
          <li className="list-inline-item border-start">
            <Button
              size="sm"
              type="button"
              variant="transparent"
              className="fs-6 "
              onClick={(e) => resetAll()}
            >
              <i className="fa-solid fa-xmark me-2"></i>Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>
      <div className="container py-3">
        {!selectedCourse.uuid && (
          <div>
            <Row>
              <Col md={10}>
                <SearchStudent
                  withSection={true}
                  onSuccess={(d) => setSelectedCourse(d)}
                />
              </Col>
            </Row>
          </div>
        )}

        {selectedCourse.uuid && (
          <Spin spinning={loader}>
            <Row className="mb-3">
              <Col md={3}>
                <InputGroup size="sm">
                  <InputGroup.Text>Month</InputGroup.Text>
                  <Form.Control
                    as="select"
                    className="fw-bold form-select form-select-sm"
                    onChange={(e) => {
                      setShowReport(false);
                      setSelectedMonth(e.target.value);
                    }}
                  >
                    <option vaue="">-Select-</option>
                    {loadSemesterMonths()}
                  </Form.Control>
                </InputGroup>
              </Col>
              <Col md={1}>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="w-100"
                  onClick={handleViewClick}
                >
                  <i className="fa-solid fa-magnifying-glass pe-2"></i> VIEW
                </Button>
              </Col>
              <Col md={8}>
                <div className="text-end">
                  <ButtonGroup size="sm">
                    <Button
                      variant={displayAsNo ? "outline-secondary" : "secondary"}
                      onClick={(e) => setDisplayAsNo(false)}
                    >
                      Display As Text
                    </Button>
                    <Button
                      variant={displayAsNo ? "secondary" : "outline-secondary"}
                      onClick={(e) => setDisplayAsNo(true)}
                    >
                      Display As Number
                    </Button>
                  </ButtonGroup>
                </div>
              </Col>
            </Row>
            {showReport && (
              <Card>
                <Card.Body>
                  <div id="stu_att_students_detail_view_print">
                    <table
                      width="100%"
                      align="center"
                      style={TABLE_STYLES.tableCollapse}
                    >
                      <thead>
                        <tr>
                          <th
                            colSpan={hourCount + 2}
                            aling="center"
                            className="text-center"
                            style={TABLE_STYLES.borderBottom}
                          >
                            <b>{context.settingValue("billheader_name")}</b>
                            <br />
                            {context.settingValue(
                              "billheader_addresslineone"
                            ) && (
                              <>
                                {context.settingValue(
                                  "billheader_addresslineone"
                                )}{" "}
                                <br />
                              </>
                            )}
                            {context.settingValue(
                              "billheader_addresslinetwo"
                            ) && (
                              <>
                                {context.settingValue(
                                  "billheader_addresslinetwo"
                                )}{" "}
                                <br />
                              </>
                            )}
                            ATTENDANCE REGISTER - For the Month of{" "}
                            {momentDate(selectedMonth, "MMM YYYY")}
                            <br />
                          </th>
                        </tr>
                        <tr>
                          <th colSpan={2} align="left">
                            Name :
                          </th>
                          <th colSpan={hourCount} align="left">
                            {selectedCourse.name} {selectedCourse.initial}
                          </th>
                        </tr>
                        <tr>
                          <th colSpan={2} align="left">
                            Reg.No (or) Adm.No :
                          </th>
                          <th colSpan={hourCount} align="left">
                            {selectedCourse.registerno ||
                              selectedCourse.admissionno}
                          </th>
                        </tr>
                        <tr>
                          <th colSpan={2} align="left">
                            Course :
                          </th>
                          <th colSpan={hourCount} align="left">
                            {selectedCourse.degree_name}{" "}
                            {selectedCourse.course_name} -{" "}
                            {selectedCourse.dept_type == "aided" ? "R" : "SF"}
                          </th>
                        </tr>
                        <tr>
                          <th colSpan={2} align="left">
                            Batch :
                          </th>
                          <th colSpan={hourCount} align="left">
                            {selectedCourse.batch}
                          </th>
                        </tr>
                        <tr>
                          <th colSpan={2} align="left">
                            Section / Sem :
                          </th>
                          <th colSpan={hourCount} align="left">
                            {upperCase(selectedCourse.section)} /{" "}
                            {semesterValue(selectedCourse.semester)}
                          </th>
                        </tr>
                        <tr>
                          <th
                            colSpan={hourCount + 2}
                            align="right"
                            className=""
                            height="30"
                            style={TABLE_STYLES.borderTop}
                          >
                            <span style={{ fontSize: "11px" }}>
                              P-Present, A-Absent, LA-Long Absent, H-Holiday,
                              S-Sunday
                            </span>
                          </th>
                        </tr>
                      </thead>
                    </table>
                    <table
                      width="100%"
                      align="center"
                      style={TABLE_STYLES.tableCollapse}
                    >
                      <thead>
                        <tr style={TABLE_STYLES.borderAll}>
                          <th width="40" style={TABLE_STYLES.borderAll}>
                            S.No
                          </th>
                          <th style={TABLE_STYLES.borderAll} width="120">
                            Date
                          </th>
                          {dayTitleColumns()}
                        </tr>
                      </thead>
                      <tbody>
                        {markedStudents.map((items, i) => {
                          return (
                            <tr style={TABLE_STYLES.borderAll}>
                              <td width="40" style={TABLE_STYLES.borderAll}>
                                {i + 1}
                              </td>
                              <td style={TABLE_STYLES.borderAll}>
                                {momentDate(
                                  items[0].attendance_date,
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              {dayDataColumns(items)}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Spin>
        )}
      </div>
    </div>
  );
};

export default AttendanceStudentDetailsReport;
