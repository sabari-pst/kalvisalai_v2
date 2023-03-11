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
  differenceBetweenTwoDates,
  lessThanToday,
  listMonths,
  lowerCase,
  momentDate,
  ParseFloat,
  printDocument,
  semesterValue,
  upperCase,
} from "../../../../utils";
import { TABLE_STYLES } from "../../../../utils/data";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";

const AttendanceMonthlyReport = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState([]);

  const [students, setStudents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [semesterDates, setSemesterDates] = useState([]);

  const [markedStudents, setMarkedStudents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [displayAsNo, setDisplayAsNo] = useState(false);

  const [today, setToday] = useState("");

  const courseDetails = (fieldName) => {
    let s = selectedCourse.course_details;
    if (s) {
      s = JSON.parse(s);
      return s?.[fieldName];
    }
  };

  const [hourCount, setHourCount] = useState(
    context.settingValue("hour_for_attendance_per_day")
  );

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
    loadHolidays();
  }, []);

  useEffect(() => {
    if (selectedCourse.course_id) {
      if (
        courseDetails("att_hour_per_day") &&
        courseDetails("att_hour_per_day") != "0"
      )
        setHourCount(courseDetails("att_hour_per_day"));
      loadStudents();
      listSemesterDates();
    }
  }, [selectedCourse]);

  const loadHolidays = () => {
    setLoader(true);
    listHolidays("1").then((res) => {
      if (res.data) setHolidays(res.data);
      setLoader(false);
    });
  };

  const listSemesterDates = () => {
    setLoader(true);
    getSemesterDates(
      selectedCourse.academic_year,
      selectedCourse.semester
    ).then((res) => {
      if (res) setSemesterDates(res[0]);
      setLoader(false);
    });
  };

  const loadStudents = () => {
    setLoader(true);
    const form = new FormData();
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);

    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        setStudents(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleViewClick = () => {
    if (selectedMonth.length < 4) {
      toast.error("Select a month");
      return;
    }

    loadMarkedAttendance();
  };

  const loadMarkedAttendance = () => {
    setShowReport(false);
    setLoader(true);
    setMarkedStudents([]);

    const form = new FormData();
    form.append("academic_year", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    form.append("attendance_month", selectedMonth);

    axios.post(ServiceUrl.STUDENTS.DATE_WISE_ATTENDANCE, form).then((res) => {
      if (res["data"].status == "1") {
        setMarkedStudents(res["data"].data);
        setToday(res["data"].today);
      }
      setLoader(false);
      setShowReport(true);
    });
  };

  const getTitle = () => {
    return selectedCourse.course_id
      ? `Monthly Report - ${selectedCourse.academic_year} - ${
          selectedCourse.course_name
        } - ${selectedCourse.section} - ${semesterValue(
          selectedCourse.semester
        )}`
      : "Monthly Report";
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

    for (let i = start; i <= end; i++) {
      rv.push(
        <th width="25" style={TABLE_STYLES.borderAll}>
          {("0" + i).slice(-2)}
        </th>
      );
    }

    return rv;
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
    let pcount = s.filter(
      (item) =>
        lowerCase(item.leave_type) == "p" ||
        lowerCase(item.leave_type) == "od" ||
        lowerCase(item.leave_type) == "ml"
    );

    if (asNumber) {
      //if (lt == "LA" || lt == "A") return 0;
      //else {
      // calculate total no of presents

      return ParseFloat(pcount.length / hourCount, 2);
      /*if (pcount.length < 1) return 0;
        else if (pcount.length < hourCount / 2) return 0.5;
        else if (pcount.length == hourCount) return 1;
        else return 1;*/
      //}
    } else {
      //if (lt == "A") return <span style={{ color: "red" }}>A</span>;
      if (lt == "OD") return <span style={{ color: "green" }}>OD</span>;
      else if (lt == "P") return <span style={{ color: "green" }}>P</span>;
      else if (lt == "LA") return <span style={{ color: "red" }}>LA</span>;
      else if (lt == "ML") return <span style={{ color: "green" }}>ML</span>;
      else if (pcount.length <= hourCount / 2)
        return <span style={{ color: "red" }}>A</span>;
      else return <span style={{ color: "red" }}>A</span>;
    }
    //return s?.[0]?.leave_type;
  };

  const dayDataColumns = (stu) => {
    let rv = [];

    for (let i = start; i <= end; i++) {
      let day = selectedMonth + "-" + ("0" + i).slice(-2);

      // to check if the date lesss than the semester start date
      if (moment(day) < moment(semesterDates?.start_date)) {
        rv.push(
          <td width="25" align="center" style={TABLE_STYLES.borderAll}></td>
        );
      } else if (moment(day) > moment(semesterDates?.end_date)) {
        // to check the date greater thean the semster end date
        rv.push(
          <td width="25" align="center" style={TABLE_STYLES.borderAll}></td>
        );
      } else if (differenceBetweenTwoDates(stu.admissiondate, day) > 0) {
        //} else if (lessThanToday(day, false, stu.admissiondate)) {
        //} else if (moment(day).isAfter(stu.admissiondate)) {
        rv.push(
          <td width="25" align="center" style={TABLE_STYLES.borderAll}></td>
        );
      } else if (moment(day) > moment(today)) {
        rv.push(
          <td width="25" align="center" style={TABLE_STYLES.borderAll}></td>
        );
      } else {
        let h = checkHoliday(day); // Check Holiday
        if (h) {
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
              {getAttendanceDayValueForADay(day, stu, displayAsNo)}
            </td>
          );
        }
      }
    }

    return rv;
  };

  const totalDays = (stu) => {
    let days = 0;
    for (let i = start; i <= end; i++) {
      let day = selectedMonth + "-" + ("0" + i).slice(-2);

      if (
        moment(day) >= moment(semesterDates?.start_date) &&
        moment(day) <= moment(semesterDates?.end_date) &&
        moment(day) <= moment(today)
      ) {
        if (differenceBetweenTwoDates(stu.admissiondate, day) <= 0)
          if (!checkHoliday(day)) days = parseInt(days) + 1;
      }
    }
    return days;
  };

  const daysPresent = (stu) => {
    let days = 0;

    let m = markedStudents.filter(
      (item) =>
        item.student_uuid == stu.uuid &&
        (lowerCase(item.leave_type) == "p" ||
          lowerCase(item.leave_type) == "od" ||
          lowerCase(item.leave_type) == "ml")
    );

    days = parseFloat(m.length) / parseFloat(hourCount);
    if (days.toString().indexOf(".") > -1) return ParseFloat(days, 2);
    return days;

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
    printDocument("stu_att_monthly_report_print");
  };

  const newAdmissions = () => {
    let s = students.filter(
      (item) => momentDate(item.admissiondate, "YYYY-MM") == selectedMonth
    );
    let rv = [];
    s.map((item, i) =>
      rv.push(
        <tr style={TABLE_STYLES.borderAll}>
          <td width="40" style={TABLE_STYLES.borderAll}>
            {i + 1}
          </td>
          <td width="100" style={TABLE_STYLES.borderAll}>
            {momentDate(item.admissiondate, "DD/MM/YYYY")}
          </td>
          <td style={TABLE_STYLES.borderAll}>{item.admissionno}</td>
          <td style={TABLE_STYLES.borderAll}>{item.name}</td>
        </tr>
      )
    );

    if (rv.length > 0) {
      return (
        <>
          <br />
          <table width="50%" align="left" style={TABLE_STYLES.tableCollapse}>
            <thead>
              <tr>
                <th colSpan={4}>
                  <b>
                    <i>New Admissions</i>
                  </b>
                </th>
              </tr>
            </thead>
            <tbody>{rv}</tbody>
          </table>
        </>
      );
    }
  };

  return (
    <div>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          <ModuleAccess module="stu_att_monthly_report" action="action_print">
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
        {!selectedCourse.course_id && (
          <div>
            <Row>
              <Col md={6}>
                <SelectRecords
                  withSection={true}
                  onSuccess={(d) => setSelectedCourse(d)}
                />
              </Col>
            </Row>
          </div>
        )}

        {selectedCourse.course_id && (
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
                  <div id="stu_att_monthly_report_print">
                    <table
                      width="100%"
                      align="center"
                      style={TABLE_STYLES.tableCollapse}
                    >
                      <thead>
                        <tr>
                          <th
                            colSpan={end + 5}
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
                          <th
                            colSpan={end - 10 + 5}
                            align="left"
                            className=""
                            height="30"
                          >
                            {selectedCourse.academic_year} /{" "}
                            {selectedCourse.course_name} /{" "}
                            {upperCase(selectedCourse.section)} /{" "}
                            {semesterValue(selectedCourse.semester)}
                          </th>
                          <th colSpan={10} align="right" className="text-end">
                            <span style={{ fontSize: "11px" }}>
                              P-Present, A-Absent, LA-Long Absent, H-Holiday,
                              S-Sunday
                            </span>
                          </th>
                        </tr>
                        <tr style={{ fontSize: "11px" }}>
                          <th width="40" style={TABLE_STYLES.borderAll}>
                            S.No
                          </th>
                          <th style={TABLE_STYLES.borderAll}>
                            Reg.No (OR) Adm.No
                          </th>
                          <th style={TABLE_STYLES.borderAll}>Name</th>
                          {dayTitleColumns()}
                          <th
                            width="60"
                            style={TABLE_STYLES.borderAll}
                            align="center"
                          >
                            Tot.Days
                          </th>
                          <th
                            width="75"
                            style={TABLE_STYLES.borderAll}
                            align="center"
                          >
                            No.of.Days Present
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: "11px" }}>
                        {students.map((item, i) => {
                          return (
                            <tr style={TABLE_STYLES.borderAll}>
                              <td width="40" style={TABLE_STYLES.borderAll}>
                                {i + 1}
                              </td>
                              <td style={TABLE_STYLES.borderAll}>
                                {item.registerno || item.admissionno}
                              </td>
                              <td style={TABLE_STYLES.borderAll}>
                                {item.name} {item.initial}
                              </td>
                              {dayDataColumns(item)}
                              <td
                                width="60"
                                style={TABLE_STYLES.borderAll}
                                align="center"
                              >
                                {totalDays(item)}
                              </td>
                              <td
                                width="75"
                                style={TABLE_STYLES.borderAll}
                                align="center"
                              >
                                {daysPresent(item)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {newAdmissions()}
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

export default AttendanceMonthlyReport;
