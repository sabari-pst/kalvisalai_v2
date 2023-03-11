import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";
import PsContext from "../../../../context";
import {
  CardFixedTop,
  printDocument,
  semesterValue,
  timeTableDayFromNumber,
  upperCase,
} from "../../../../utils";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import { Spin } from "antd";
import ModuleAccess from "../../../../context/moduleAccess";

const styles = {
  tableCollapse: {
    borderCollapse: "collapse",
  },
  borderBottom: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
  },
  borderExceptLeft: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    padding: "3px",
  },
  borderExceptRight: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    borderLeft: "1px solid black",
    padding: "3px",
  },
  borderAll: {
    borderCollapse: "collapse",
    border: "1px solid black",
    padding: "3px",
  },
  borderTopBottom: {
    borderCollapse: "collapse",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    padding: "3px",
  },
};

const Createtable = (props) => {
  const context = useContext(PsContext);
  const [key, setKey] = useState("home");
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [dataListSub, setDataSub] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [dataSource, setdataSource] = useState([]);
  const [printReport, setPrintReport] = useState(false);
  const [editStaffModal, setEditStaffModal] = useState(false);
  const [dataSubView, setSubView] = useState([]);

  const [attendanceData, setAttendanceData] = useState([]);
  const [showSelectStaff, setShowSelectStaff] = useState(false);

  const [editItem, setEditItem] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  const [show, setShow] = useState(false);

  const [hourCount, setHourCount] = useState(
    context.settingValue("hour_for_attendance_per_day")
  );

  const dayOrderCount = context.settingValue("attendance_day_order_count");
  const dayOrderInDayName = context.settingValue(
    "attendance_dayorder_as_day_name"
  );

  useEffect(() => {
    getReport();
    getSubject();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedCourse.course_id) {
      if (
        courseDetails("att_hour_per_day") &&
        courseDetails("att_hour_per_day") != "0"
      )
        setHourCount(courseDetails("att_hour_per_day"));

      getReport();
      getSubject();
      loadTimeTableData();
    }
  }, [selectedCourse]);

  const courseDetails = (fieldName) => {
    let s = selectedCourse.course_details;
    if (s) {
      s = JSON.parse(s);
      return s?.[fieldName];
    }
  };

  const loadTimeTableData = () => {
    setLoader(true);

    const form = new FormData();
    form.append("academic_year", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    axios.post(ServiceUrl.SETTINGS.GET_TIMETABLE, form).then((res) => {
      if (res["data"].status == "1") {
        setAttendanceData(res["data"].data);
        // console.log(res['data'].data)
        setdataSource(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const getReport = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    axios.get(ServiceUrl.HR.LIST_EMPLOYEES).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);

        setDataView(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const getSubject = () => {
    setLoader(true);
    setDataSub([]);
    setSubView([]);

    axios.get(ServiceUrl.SETTINGS.LIST_SUBJECT).then((res) => {
      if (res["data"].status == "1") {
        setDataSub(res["data"].data);

        setSubView(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const resetAll = () => {
    setSelectedCourse([]);
    setDataList([]);
    setAttendanceData([]);
    setLoader(false);
  };

  const getTableHeadRow = () => {
    let rv = [];
    for (let i = 0; i < hourCount; i++) {
      rv.push(
        <td align="center" style={styles.borderAll}>
          Hour {i + 1}
        </td>
      );
    }
    return rv;
  };

  const getTableRow = () => {
    let rv = [];
    for (let j = 1; j <= dayOrderCount; j++) {
      let td = [];
      td.push(
        <td align="center" style={styles.borderAll}>
          {timeTableDayFromNumber(j, dayOrderInDayName)}
        </td>
      );
      for (let i = 0; i < hourCount; i++) {
        let m = getDayValue(j, i + 1);
        if (!m) {
          td.push(<td style={styles.borderAll}></td>);
        } else {
          td.push(
            <td style={styles.borderAll} align="center">
              {m}
            </td>
          );
        }
      }

      rv.push(<tr style={styles.borderAll}>{td}</tr>);
    }
    return rv;
  };

  const getDayValue = (day, hour) => {
    let at = [...attendanceData];
    let dl = at.filter(
      (item) => item.day_value == day && item.hour_value == hour
    );

    if (dl.length < 1) return false;

    let rv = [];

    dl.map((d, i) => {
      let t = dataList.find((item) => item.id == d.teacher);

      //if(t) return t.emp_name;
      let sub = dataListSub.find((item) => item.id == d.subject);

      rv.push(
        <div style={{ borderTop: i && "1px solid gray" }}>
          {(sub && sub.subject_name && (
            <div
              style={{
                textAlign: "center",
                fontSize: "13px",
                padding: "3px",
                fontWeight: "600",
              }}
            >
              {sub.subject_name}
            </div>
          )) ||
            ""}
          <div
            className="text-center"
            style={{ textAlign: "center", fontSize: "11px" }}
          >
            {(t && t.emp_name) || ""}
          </div>
        </div>
      );
    });
    return rv;
  };

  const selectFormSuccess = (d) => {
    let at = [...attendanceData];
    let index = at.findIndex(
      (item) => item.day_value == d.day && item.hour_value == d.hour
    );
    if (index > -1) {
      let emp = dataList.find((item) => item.id == d.staff_id);

      at[index]["day_value"] = d.day;
      at[index]["hour_value"] = d.hour;
      at[index]["subject"] = d.subject_id;
      at[index]["subject_name"] = d.subject_id;
      at[index]["teacher"] = d.staff_id;
      at[index]["teacher_name"] = emp ? emp.emp_name : d.staff_id;
    } else {
      let emp = dataList.find((item) => item.id == d.staff_id);
      at.push({
        day_value: d.day,
        hour_value: d.hour,
        subject: d.subject_id,
        subject_name: d.subject_id,
        teacher: d.staff_id,
        teacher_name: emp ? emp.emp_name : d.staff_id,
      });
    }
    setAttendanceData(at);
    setSelectedDay("");
    setSelectedHour("");
    setShowSelectStaff(false);
  };

  const getTitle = () => {
    if (selectedCourse && selectedCourse.course_id) {
      return `Print Time Table for : ${
        selectedCourse.course_name
      } - (${upperCase(selectedCourse.section)}) - ${
        selectedCourse.academic_year
      } - SEM : ${selectedCourse.semester}`;
    }
    return "Print Time Table";
  };

  // const dayHourCount = context.settingValue("hour_for_attendance_per_day");

  const tdColSpan = parseInt(hourCount) + 1;

  const printClick = () => {
    printDocument("print_cls_time_table");
  };

  return (
    <>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          <ModuleAccess
            module="timetable_class_timetable"
            action="action_print"
          >
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => printClick()}
                disabled={attendanceData.length < 1}
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
      <div className="container mt-3">
        <Spin spinning={loader}>
          <ModuleAccess module="timetable_class_timetable" action="action_list">
            {selectedCourse && selectedCourse.length < 1 && (
              <Row>
                <Col md={6}>
                  <SelectRecords
                    onSuccess={(dt, e) => {
                      setSelectedCourse(dt);
                    }}
                    withSection={true}
                  />
                </Col>
              </Row>
            )}
          </ModuleAccess>

          {selectedCourse && selectedCourse.course_id && (
            <Card>
              <Card.Body>
                <div id="print_cls_time_table">
                  <table
                    width="100%"
                    align="center"
                    style={styles.tableCollapse}
                  >
                    <tr>
                      <td colSpan={tdColSpan} align="center" height="30">
                        <h4>
                          <b>{context.settingValue("billheader_name")}</b>
                        </h4>
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
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={tdColSpan}
                        align="center"
                        style={styles.borderBottom}
                      >
                        <b>Course Time Table</b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={tdColSpan / 2} align="left" height="35">
                        <b>
                          Course & Section :{" "}
                          {`${selectedCourse.course_name} / ${upperCase(
                            selectedCourse.section
                          )}`}
                        </b>
                      </td>
                      <td colSpan={tdColSpan / 2} align="right">
                        <b>
                          Batch & Sem :{" "}
                          {`${selectedCourse.academic_year} / ${semesterValue(
                            selectedCourse.semester
                          )}`}
                        </b>
                      </td>
                    </tr>
                    <tr style={styles.borderAll}>
                      <td className="text-center" style={styles.borderAll}>
                        Day/Hour
                      </td>
                      {getTableHeadRow()}
                    </tr>

                    {getTableRow()}
                  </table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Spin>
      </div>
    </>
  );
};
export default Createtable;
