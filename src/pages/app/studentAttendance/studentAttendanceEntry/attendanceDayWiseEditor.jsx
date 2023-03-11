import React, { useCallback, useContext, useEffect, useState } from "react";
import moment from "moment";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import axios from "axios";
import PsContext from "../../../../context";
import {
  CardFixedTop,
  differenceBetweenTwoDates,
  lessThanToday,
  momentDate,
  semesterValue,
  upperCase,
} from "../../../../utils";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { Spin } from "antd";
import { listHolidays } from "../../../../models/hr";
import { toast } from "react-hot-toast";
import { getSemesterDates } from "../../../../models/academicYears";

const AttendanceDayWiseEditor = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(props.selectedCourse);

  const [semesterDates, setSemesterDates] = useState([]);
  const [state, setState] = useState([]);

  const [attendanceDate, setAttendanceDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );

  const [todayDayOrder, setTodayDayOrder] = useState("");

  const [students, setStudents] = useState([]);
  const [markedData, setMarkedData] = useState([]);
  const [markedStudents, setMarkedStudents] = useState([]);

  const [holidays, setHolidays] = useState([]);

  const hourCount =
    (students?.[0]?.att_hour_per_day &&
      students[0].att_hour_per_day != "0" &&
      students[0].att_hour_per_day) ||
    context.settingValue("hour_for_attendance_per_day");
  let dayOrderCount = context.settingValue("attendance_day_order_count");
  let dayOrderInDayName = context.settingValue(
    "attendance_dayorder_as_day_name"
  );

  useEffect(() => {
    if (selectedCourse.course_id) listSemesterDates();
  }, [selectedCourse]);

  const resetAll = () => {
    setMarkedData([]);
    setStudents([]);
    setMarkedStudents([]);
    setSelectedCourse([]);
  };

  const loadStudents = () => {
    setLoader(true);
    setStudents([]);

    const form = new FormData();
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    form.append("left", "0");

    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        let d = res["data"].data;
        let s = d.filter(
          (item) =>
            differenceBetweenTwoDates(item.admissiondate, attendanceDate) <= 0
        );
        setStudents(s);
      }
      setLoader(false);
    });
  };

  const loadDayOrder = () => {
    setLoader(true);
    axios
      .get(ServiceUrl.DASHBOARD.TODAY_DAY_ORDER + "?date=" + attendanceDate)
      .then((res) => {
        if (res["data"].status == "1") {
          setTodayDayOrder(res["data"].data);
        } else {
          toast.error("Day order not found");
        }
        setLoader(false);
      });
  };

  useEffect(() => {
    if (props.allowAdd && markedStudents.length < 1) {
      let d = students;
      let m = [];

      d.map((item, i) => {
        for (let j = 1; j <= hourCount; j++) {
          //modifyAttendance(item, j, "p");
          m.push({
            course: item.course,
            college_year: item.college_year,
            academic_year: item.batch,
            semester: item.semester,
            section: item.section,
            day_value: todayDayOrder,
            hour_value: j,
            student_uuid: item.uuid,
            leave_type: "p",
            subject: context.settingValue("global_general_subject_id"),
            teacher: context.user.id,
            //subject: getAttField("subject", item.uuid),
            //teacher: getAttField("teacher"),
          });
        }
      });
      setMarkedData(m);
      setMarkedStudents(m);
    }
  }, [students]);

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

  const loadMarkedAttendance = () => {
    setLoader(true);
    setMarkedStudents([]);

    const form = new FormData();
    form.append("academic_year", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    form.append("attendance_date", attendanceDate);

    axios.post(ServiceUrl.STUDENTS.DATE_WISE_ATTENDANCE, form).then((res) => {
      if (res["data"].status == "1") {
        if (props.allowAdd && res["data"].data.length > 0) {
          toast.error("Attendance already marked");
          setMarkedData([]);
          setStudents([]);
          setMarkedStudents([]);
          setTodayDayOrder("");
          setLoader(false);
        } else {
          loadStudents();
          setMarkedStudents(res["data"].data);
        }
      } else {
        loadStudents();
        //setMarkedStudents(res["data"].data);
      }
      setLoader(false);
    });
  };

  const loadHolidays = () => {
    setLoader(true);
    listHolidays(
      "1&from_date=" + attendanceDate + "&to_date=" + attendanceDate
    ).then((res) => {
      if (res.data) setHolidays(res.data);
      setLoader(false);
    });
  };

  const handleViewClick = () => {
    loadDayOrder();
    setMarkedData([]);
    setStudents([]);
    setMarkedStudents([]);
    loadHolidays();

    loadMarkedAttendance();
  };

  const getTableHeadRow = () => {
    let rv = [];
    for (let i = 0; i < hourCount; i++) {
      rv.push(
        <th width="60">
          H {i + 1} &nbsp;
          {props.allowEdit && (
            <input
              type="checkbox"
              onChange={(e) => markBulkPresent(i + 1, e)}
            />
          )}
        </th>
      );
    }
    return rv;
  };

  const markBulkPresent = (ho, e) => {
    let sta = e.target.checked ? "p" : "a";

    for (let i = 0; i < students.length; i++) {
      //console.table(students[i]);
      modifyAttendance(students[i], ho, sta);
    }

    //students.map((item) => modifyAttendance(item, ho, sta));
  };

  const checkAttendanceStatus = (item, hour) => {
    let m = markedData.find(
      (obj) => obj.student_uuid == item.uuid && obj.hour_value == hour
    );
    if (!m)
      m = markedStudents.find(
        (obj) => obj.student_uuid == item.uuid && obj.hour_value == hour
      );

    return m;
  };

  const checkIsHoliday = (date) => {
    let x = holidays.find((item) => item.holiday_date == date);
    return x && x?.holiday_type;
  };

  const getTableRow = (item) => {
    let rv = [];
    for (let i = 0; i < hourCount; i++) {
      let m = checkAttendanceStatus(item, i + 1);

      let sta = m?.leave_type;
      let hd = checkIsHoliday(attendanceDate);

      rv.push(
        <td
          width="60"
          align="center"
          className={
            sta == "a" ? "bg-red-100" : sta == "od" ? "bg-orange-100" : ""
          }
        >
          {hd ? (
            <span>{upperCase(hd)}</span>
          ) : (
            <select
              className="att_opt_select"
              onChange={(e) => modifyAttendance(item, i + 1, e.target.value)}
            >
              <option value=""></option>
              {context.allowedAccess(
                "stu_attendance_bulk_p",
                "action_create"
              ) && (
                <option value="p" selected={sta == "p" ? "selected" : ""}>
                  P
                </option>
              )}
              {context.allowedAccess(
                "stu_attendance_bulk_ab",
                "action_create"
              ) && (
                <option value="a" selected={sta == "a" ? "selected" : ""}>
                  A
                </option>
              )}
              {context.allowedAccess(
                "stu_attendance_bulk_ml",
                "action_create"
              ) && (
                <option value="ml" selected={sta == "ml" ? "selected" : ""}>
                  ML
                </option>
              )}
              {context.allowedAccess(
                "stu_attendance_bulk_od",
                "action_create"
              ) && (
                <option value="od" selected={sta == "od" ? "selected" : ""}>
                  OD
                </option>
              )}
            </select>
          )}
        </td>
      );
    }
    return rv;
  };

  const getAttField = (fieldName, uuid) => {
    let x = markedStudents.find(
      (item) =>
        item.day_value.length > 0 &&
        item.hour_value.length > 0 &&
        item.subject.length > 0 &&
        item.teacher.length > 0 &&
        item.student_uuid == uuid
    );
    return x && x[fieldName];
  };

  const markBulkAbsent = (stu, e) => {
    let sta = e.target.checked ? "a" : "p";

    for (let i = 1; i <= hourCount; i++) {
      modifyAttendance(stu, i, sta);
    }
  };

  const forceUpdate = useCallback(() => setState({}), []);

  const modifyAttendance = (item, hour, status) => {
    let m = [];
    let md = markedData;

    let index = md.findIndex(
      (obj) => obj.student_uuid == item.uuid && obj.hour_value == hour
    );
    if (index > -1) {
      md[index]["leave_type"] = status;

      setMarkedData((oldData) => [...md]);
      return;
    } else if (props.allowEdit) {
      let x = markedStudents.find(
        (obj) => obj.student_uuid == item.uuid && obj.hour_value == hour
      );
      if (x) {
        x.leave_type = status;
        //m.push(x);
        setMarkedData((oldData) => [...oldData, x]);
        return;
      }
    }
    if (
      !context.settingValue("global_general_subject_id") ||
      context.settingValue("global_general_subject_id") == ""
    ) {
      toast.error("General Subject Id not set in master settings.");
      return;
    }
    let stu = students.find((__item) => __item.uuid == item.uuid);
    if (stu) {
      let dv = getAttField("day_value", item.uuid);
      if (!dv || dv == "" || dv.length < 1) dv = todayDayOrder;
      let __m = {
        course: item.course,
        college_year: stu.college_year,
        academic_year: item.batch,
        semester: item.semester,
        section: stu.section,
        day_value: dv,
        hour_value: hour,
        student_uuid: item.uuid,
        leave_type: status,
        subject: context.settingValue("global_general_subject_id"),
        teacher: context.user.id,
        name: stu.name,
      };
      setMarkedData((oldData) => [...oldData, __m]);
    }
  };

  const modifyAttendance_old = (item, hour, sta) => {
    let m = [...markedData];

    let index = m.findIndex(
      (obj) => obj.student_uuid == item.uuid && obj.hour_value == hour
    );

    if (index > -1) {
      markedData[index]["leave_type"] = sta;
    } else {
      let x = markedStudents.find(
        (obj) => obj.student_uuid == item.uuid && obj.hour_value == hour
      );

      if (x) {
        if (props.allowEdit) {
          m.push({
            id: x?.id,
            course: x?.course,
            academic_year: x?.academic_year,
            college_year: x?.college_year,
            semester: x?.semester,
            section: x?.section,
            day_value: x.day_value || todayDayOrder,
            hour_value: hour,
            student_uuid: x.student_uuid,
            leave_type: sta,
            subject: x?.subject,
            teacher: x?.teacher,
          });
        }
      } else {
        if (props.allowAdd || props.allowEdit) {
          if (
            !context.settingValue("global_general_subject_id") ||
            context.settingValue("global_general_subject_id") == ""
          ) {
            toast.error("General Subject Id not set in master settings.");
            return;
          }
          let stu = students.find((__item) => __item.uuid == item.uuid);

          if (stu) {
            let dv = getAttField("day_value", item.uuid);
            if (!dv || dv == "" || dv.length < 1) dv = todayDayOrder;
            let __m = {
              course: item.course,
              college_year: stu.college_year,
              academic_year: item.batch,
              semester: item.semester,
              section: stu.section,
              day_value: dv,
              hour_value: hour,
              student_uuid: item.uuid,
              leave_type: sta,
              subject: context.settingValue("global_general_subject_id"),
              teacher: context.user.id,
              name: stu.name,
              //subject: getAttField("subject", item.uuid),
              //teacher: getAttField("teacher"),
            };

            m.push(__m);
          }
        }
      }
    }

    setMarkedData(m);
    //setMarkedData((prev) => m);
  };

  const stateField = (fieldName) => {
    let m = markedStudents;
    if (m.length > 0 && m[0][fieldName]) return m[0][fieldName];
  };

  const handleUpdateClick = () => {
    if (!window.confirm("Do you want to update ?")) return;

    setLoader(true);
    let dv = stateField("day_value");
    if (dv == "" || dv.length < 1) dv = todayDayOrder;
    if (dv.length < 1) {
      toast.error("Day order value missing--");
      return;
    }

    const form = new FormData();
    form.append("students", JSON.stringify(markedData));
    form.append("attendance_date", attendanceDate);
    form.append("day_value", dv);
    form.append("hour_value", stateField("hour_value"));
    form.append("teacher", stateField("teacher"));
    form.append("subject", stateField("subject"));
    form.append("course", stateField("course"));
    form.append("college_year", stateField("college_year"));
    form.append("academic_year", stateField("academic_year"));
    form.append("semester", stateField("semester"));
    form.append("section", stateField("section"));
    axios.post(ServiceUrl.STUDENTS.UPDATE_DAY_ATTENDANCE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        setMarkedData([]);
        if (props.allowAdd) {
          resetAll();
          if (props.onSuccess) props.onSuccess();
        }
        if (props.allowEdit) loadMarkedAttendance();
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  return (
    <div>
      {selectedCourse.course_id && (
        <div>
          <Spin spinning={loader}>
            <Row>
              <Col md={3}>
                <InputGroup size="sm">
                  <InputGroup.Text>Attendace Date</InputGroup.Text>
                  <Form.Control
                    type="date"
                    size="sm"
                    className="fw-bold"
                    min={semesterDates.start_date}
                    max={
                      moment(semesterDates.end_date) < moment(new Date())
                        ? momentDate(semesterDates.end_date, "YYYY-MM-DD")
                        : momentDate(new Date(), "YYYY-MM-DD")
                    }
                    value={attendanceDate}
                    onChange={(e) => {
                      setAttendanceDate(e.target.value);
                      setTodayDayOrder("");
                      setStudents([]);
                    }}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <Button
                  type="button"
                  size="sm"
                  onClick={(e) => handleViewClick()}
                >
                  <i className="fa-regular fa-eye me-2"></i>View
                </Button>
              </Col>
              {markedData && markedData.length > 0 && (
                <>
                  <Col md={3}></Col>
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Edited Count</InputGroup.Text>
                      <Form.Control
                        type="text"
                        className="fw-bold text-end"
                        value={markedData.length}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      size="sm"
                      className="btn-block"
                      onClick={(e) => handleUpdateClick()}
                    >
                      <i className="fa-solid fa-check me-2"></i>Update
                      Attendance
                    </Button>
                  </Col>
                </>
              )}
            </Row>
            {students.length > 0 && (
              <Row className="mt-2">
                <Col md={12}>
                  <div
                    className="tableFixHead ps-table"
                    style={{ maxHeight: "calc(100vh - 150px)" }}
                  >
                    <table>
                      <thead>
                        <tr>
                          <th width="60">S.No</th>
                          <th>Reg.No</th>
                          <th>Student Name</th>
                          <th width="60">Absent</th>
                          {getTableHeadRow()}
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item.registerno || item.admissionno}</td>
                              <td>{item.name}</td>

                              <td align="center">
                                <input
                                  type="checkbox"
                                  onChange={(e) => markBulkAbsent(item, e)}
                                />
                              </td>

                              {getTableRow(item)}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>
            )}
          </Spin>
        </div>
      )}
    </div>
  );
};
export default AttendanceDayWiseEditor;
