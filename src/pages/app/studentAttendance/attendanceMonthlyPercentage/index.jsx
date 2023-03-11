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
import {
  getSemesterDates,
  listAttendancePercentages,
} from "../../../../models/academicYears";
import { listHolidays } from "../../../../models/hr";
import {
  CardFixedTop,
  groupByMultiple,
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

const AttendanceMonthlyPercentage = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState([]);

  const [students, setStudents] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const [markedStudents, setMarkedStudents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attMonths, setAttMonths] = useState([]);
  const [dayOrders, setDayOrders] = useState([]);

  const [percentageInfo, setPercentageInfo] = useState([]);
  const [studentPercentage, setStudentPercentage] = useState([]);

  const [reportDays, setReportDays] = useState("");

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
    loadPercentageData();
  }, []);

  useEffect(() => {
    if (selectedCourse.course_id) {
      if (
        courseDetails("att_hour_per_day") &&
        courseDetails("att_hour_per_day") != "0"
      )
        setHourCount(courseDetails("att_hour_per_day"));
      loadStudents();
      loadMarkedAttendance();
    }
  }, [selectedCourse]);

  const loadHolidays = () => {
    setLoader(true);
    listHolidays("1").then((res) => {
      if (res.data) setHolidays(res.data);
      setLoader(false);
    });
  };

  const loadPercentageData = () => {
    setLoader(true);
    listAttendancePercentages("1").then((res) => {
      if (res) setPercentageInfo(res);
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
    form.append("left", "0");

    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        setStudents(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const loadMarkedAttendance = () => {
    setLoader(true);
    setMarkedStudents([]);
    setDayOrders([]);

    const form = new FormData();
    form.append("academic_year", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    if (reportDays) form.append("limit", reportDays);
    form.append("type", "month");

    axios
      .post(ServiceUrl.STUDENTS.ATTENDANCE_COUNT_REPORT, form)
      .then((res) => {
        if (res["data"].status == "1") {
          let d = res["data"].data;
          d = groupByMultiple(d, function (obj) {
            return [obj.attendance_date];
          });
          let x = d.map((item) => item[0]);
          setAttMonths(x);
          setMarkedStudents(res["data"].data);
          setDayOrders(res["data"].dayorders);
          //setReportDays("");
        }
        setLoader(false);
      });
  };

  const getTitle = () => {
    return selectedCourse.course_id
      ? `Percentage Report - ${selectedCourse.academic_year} - ${
          selectedCourse.course_name
        } - ${selectedCourse.section} - ${semesterValue(
          selectedCourse.semester
        )}`
      : "Percentage Report";
  };

  const resetAll = () => {
    setSelectedMonth("");
    setSelectedCourse([]);
    setStudents([]);
  };

  const checkHoliday = (dt) => {
    let m = holidays.find((item) => item.holiday_date == dt);
    return m?.holiday_type;
  };

  const getDaysPresentInMonth = (item, attDate) => {
    let x = markedStudents.find(
      (obj) => obj.student_uuid == item.uuid && obj.attendance_date == attDate
    );
    if (x) return ParseFloat(x.days, 2);
    else return "-";
  };

  const getTotalDaysPresent = (stu) => {
    let x = markedStudents.filter((item) => item.student_uuid == stu.uuid);
    let total = 0;
    x.map((item) => (total = ParseFloat(total, 2) + ParseFloat(item.days, 2)));

    return ParseFloat(total, 2); //.toFixed(2);
  };

  const getTotalPercentage = (stu) => {
    let daysPresent = getTotalDaysPresent(stu);
    let totalDays = dayOrders.length;
    return ParseFloat(
      (parseFloat(daysPresent) / parseFloat(totalDays)) * 100,
      2
    );
  };

  const daysInMonth = (month) => {
    let x = dayOrders.filter(
      (item) => momentDate(item.day_order_date, "YYYY-MM") == month
    );
    return x.length;
  };

  /*useEffect(() => {
    loadStudentPercentage();
  }, [students, markedStudents]);*/

  const loadStudentPercentage = () => {
    let stu = [];
    students.map((item, i) => {
      stu.push({
        uuid: item.uuid,
        total_days: getTotalDaysPresent(item),
        percentage: getTotalPercentage(item),
      });
    });
    return stu;
  };

  const printReport = () => {
    printDocument("stu_att_sem_month_per_report_print");
  };

  const getStudentsPercentageLessThan = (per) => {
    let rv = [];
    let studentPercentage = loadStudentPercentage();
    let s = studentPercentage.filter(
      (item) =>
        parseFloat(item.percentage) >= parseFloat(per.percentage_from) &&
        parseFloat(item.percentage) <= parseFloat(per.percentage_to)
    );

    s.map((item, i) => {
      let stu = students.find((obj) => obj.uuid == item.uuid);
      rv.push(
        <tr style={TABLE_STYLES.borderAll}>
          <td style={TABLE_STYLES.borderAll} width="60">
            {i + 1}
          </td>
          <td style={TABLE_STYLES.borderAll}>{stu?.name}</td>
          <td style={TABLE_STYLES.borderAll} align="right">
            {item.percentage}
          </td>
        </tr>
      );
    });
    if (s.length > 0) return rv;
  };

  return (
    <div>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          <ModuleAccess
            module="stu_att_sem_month_per_report"
            action="action_print"
          >
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
            <Row className="mt-2 mb-2">
              <Col md={2}>
                <InputGroup size="sm">
                  <InputGroup.Text>Days</InputGroup.Text>
                  <Form.Control
                    type="number"
                    className="fw-bold"
                    value={reportDays}
                    onChange={(e) => setReportDays(e.target.value)}
                  />
                  <InputGroup.Text className="px-0 py-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={(e) => loadMarkedAttendance()}
                    >
                      View Report
                    </Button>
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
            <Card>
              <Card.Body>
                <div id="stu_att_sem_month_per_report_print">
                  <table
                    width="100%"
                    align="center"
                    style={TABLE_STYLES.tableCollapse}
                  >
                    <thead style={{ fontSize: "12px" }}>
                      <tr>
                        <th
                          colSpan={dayOrders.length + 5}
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
                          ATTENDANCE PERCENTAGE - For{" "}
                          {semesterValue(selectedCourse.semester)}
                          <br />
                        </th>
                      </tr>
                      <tr>
                        <th
                          colSpan={dayOrders.length + 5}
                          align="left"
                          className=""
                          height="30"
                        >
                          {selectedCourse.academic_year} /{" "}
                          {selectedCourse.course_name} /{" "}
                          {upperCase(selectedCourse.section)} /{" "}
                          {semesterValue(selectedCourse.semester)}
                        </th>
                      </tr>
                      <tr style={TABLE_STYLES.borderAll}>
                        <th width="40" style={TABLE_STYLES.borderAll}>
                          S.No
                        </th>
                        <th style={TABLE_STYLES.borderAll}>
                          Reg.No (OR) Adm.No
                        </th>
                        <th style={TABLE_STYLES.borderAll}>Name</th>
                        {attMonths.map((item) => (
                          <th
                            style={TABLE_STYLES.borderAll}
                            width="60"
                            align="center"
                            className="text-center"
                          >
                            {momentDate(item.attendance_date, "MMM-YY")}
                            <br />({daysInMonth(item.attendance_date)})
                          </th>
                        ))}
                        <th
                          style={TABLE_STYLES.borderAll}
                          width="60"
                          align="center"
                          className="text-center"
                        >
                          Total
                          <br />({dayOrders.length})
                        </th>
                        <th
                          style={TABLE_STYLES.borderAll}
                          width="60"
                          align="center"
                          className="text-center"
                        >
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "12px" }}>
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
                            {attMonths.map((obj) => (
                              <td style={TABLE_STYLES.borderAll} align="right">
                                {getDaysPresentInMonth(
                                  item,
                                  obj.attendance_date
                                )}
                              </td>
                            ))}
                            <td style={TABLE_STYLES.borderAll} align="right">
                              {getTotalDaysPresent(item)}
                            </td>
                            <td style={TABLE_STYLES.borderAll} align="right">
                              {getTotalPercentage(item)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <br />
                  <table
                    width="60%"
                    align="left"
                    style={TABLE_STYLES.tableCollapse}
                  >
                    <thead style={{ fontSize: "12px" }}>
                      <tr>
                        <th colSpan={2}>Attendance Shortage</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "12px" }}>
                      {percentageInfo.map((item, i) => {
                        return (
                          <>
                            <tr style={TABLE_STYLES.borderAll}>
                              <td
                                style={TABLE_STYLES.borderAll}
                                colSpan={2}
                                align="center"
                              >
                                <b>
                                  <i>
                                    {item.name} (Less than {item.percentage_to}{" "}
                                    %)
                                  </i>
                                </b>
                              </td>
                              <td
                                width="60"
                                style={TABLE_STYLES.borderAll}
                                align="center"
                              >
                                %
                              </td>
                            </tr>
                            {getStudentsPercentageLessThan(item)}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Spin>
        )}
      </div>
    </div>
  );
};

export default AttendanceMonthlyPercentage;
