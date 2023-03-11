import {
  Button,
  Dialog,
  List,
  Mask,
  Toast,
  SwipeAction,
  Footer,
} from "antd-mobile";
import Item from "antd-mobile/es/components/dropdown/item";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-hot-toast";

import { Redirect, withRouter } from "react-router-dom";

import PsContext from "../../../context";
import { momentDate, sleep } from "../../../utils";
import { ServiceUrl } from "../../../utils/serviceUrl";

import HeaderBar from "../layout/headerBar";

const MarkAttendance = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [longAbsentee, setLongAbsentee] = useState([]);

  const [markedData, setMarkedData] = useState([]);

  const [markedStudents, setMarkedStudents] = useState([]);

  const getAttendanceDate = () => {
    let x = context.getStorage("mob_attendance_date");
    return x && x != null ? x : momentDate(new Date(), "YYYY-MM-DD");
  };

  const [attendaceDate, setAttendaceDate] = useState(getAttendanceDate());

  useEffect(() => {
    if (stateField("course") != undefined) {
      loadLongAbsenteeData();
      loadData();
      loadMarkedAttendance();
    }
  }, []);

  useEffect(() => {
    mergeData();
  }, [dataList, markedData]);

  const loadMarkedAttendance = () => {
    context.setLoader(true);
    const form = new FormData();
    form.append("attendance_date", attendaceDate);
    form.append("day_value", stateField("day_value"));
    form.append("hour_value", stateField("hour_value"));
    form.append("teacher", stateField("teacher"));
    form.append("subject", stateField("subject"));
    form.append("course", stateField("course"));
    form.append("college_year", stateField("college_year"));
    form.append("academic_year", stateField("academic_year"));
    form.append("semester", stateField("semester"));
    form.append("section", stateField("section"));
    axios.post(ServiceUrl.MOB.LIST_STUDENTS_ATTENDANCE, form).then((res) => {
      if (res["data"].status == "1") {
        setMarkedData(res["data"].data);
      }
      context.setLoader(false);
    });
  };

  const loadData = () => {
    context.setLoader(true);
    const form = new FormData();
    form.append("course", stateField("course"));
    form.append("semester", stateField("semester"));
    form.append("section", stateField("section"));
    form.append("college_year", stateField("college_year"));
    form.append("batch", stateField("academic_year"));
    axios.post(ServiceUrl.MOB.SEARCH_STUDENT, form).then((res) => {
      if (res["data"].status == "1") {
        let d = res["data"].data;

        setDataList(d);
        setDataView(d);
      } else {
        toast.error(res["data"].message || "Error");
      }
      context.setLoader(false);
    });
  };

  const loadLongAbsenteeData = () => {
    context.setLoader(true);
    const form = new FormData();
    form.append("course", stateField("course"));
    form.append("semester", stateField("semester"));
    form.append("section", stateField("section"));
    form.append("college_year", stateField("college_year"));
    form.append("academic_year", stateField("academic_year"));
    form.append("attendance_date", attendaceDate);

    axios.post(ServiceUrl.MOB.LIST_LONG_ABSENTEE, form).then((res) => {
      if (res["data"].status == "1") {
        let d = res["data"].data;

        setLongAbsentee(d);
      } else {
        toast.error(res["data"].message || "Error");
      }
      context.setLoader(false);
    });
  };

  const checkMarkedAttendaceStatus = (item) => {
    let m = markedData.find(
      (obj) => obj.student_uuid == item.uuid && obj.course == item.course
      //obj.day_value == item.day_value &&
      //obj.hour_value == item.hour_value &&
      //obj.semester == item.semester &&
      //obj.subject == item.subject &&
      //obj.teacher == item.teacher
    );
    return m;
  };

  const checkLongAbsentee = (uuid) => {
    let x = longAbsentee.findIndex((obj) => obj.student_uuid == uuid);
    return x > -1 ? true : false;
  };

  const mergeData = () => {
    let d = dataList;
    let x = [];
    d.map((item, i) => {
      let m = checkMarkedAttendaceStatus(item);
      let la = checkLongAbsentee(item.uuid);
      x.push({
        id: m?.id || "",
        course: item.course,
        academic_year: item.batch,
        semester: item.semester,
        day_value: m?.day_value || "",
        hour_value: m?.hour_value || "",
        student_uuid: item.uuid,
        leave_type: la ? "la" : m?.leave_type || "p",
        subject: stateField("subject"),
        teacher: stateField("teacher"),
      });
    });
    setMarkedStudents(x);
  };

  const confirmClick = () => {
    Dialog.confirm({
      content: "Do you want to Save Attendance ?",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: () => saveAttendance(),
    });
  };

  const stateField = (fieldName) => {
    return props.location?.state?.[fieldName];
  };

  if (stateField("id") === undefined) {
    return <Redirect to={"/mob/app"} />;
  }

  const absendClick = (item, ltype = "a") => {
    let m = [...markedStudents];
    let index = m.findIndex((obj) => obj.student_uuid == item.uuid);

    if (index > -1) {
      let lt = m[index]["leave_type"];
      if (lt == ltype) m[index]["leave_type"] = "";
      else m[index]["leave_type"] = ltype;
      setMarkedStudents(m);
    }
  };

  const checkStudentMarked = (item) => {
    let m = markedStudents;
    let index = m.findIndex((obj) => obj.student_uuid == item.uuid);
    return index > -1 && m[index]["leave_type"];
  };

  const markedCount = (ltype) => {
    let m = markedStudents.filter((item) => item.leave_type == ltype);
    return m.length;
  };

  const saveAttendance = () => {
    context.setLoader(true);
    const form = new FormData();
    form.append("students", JSON.stringify(markedStudents));
    form.append("attendance_date", attendaceDate);
    form.append("day_value", stateField("day_value"));
    form.append("hour_value", stateField("hour_value"));
    form.append("teacher", stateField("teacher"));
    form.append("subject", stateField("subject"));
    form.append("course", stateField("course"));
    form.append("college_year", stateField("college_year"));
    form.append("academic_year", stateField("academic_year"));
    form.append("semester", stateField("semester"));
    form.append("section", stateField("section"));
    axios.post(ServiceUrl.MOB.SAVE_STUDENT_ATTENDANCE, form).then((res) => {
      if (res["data"].status == "1") {
        Toast.show({
          icon: "success",
          content: res["data"].message || "Success",
        });
      } else {
        Toast.show({
          icon: "error",
          content: res["data"].message || "Error",
        });
      }
      context.setLoader(false);
    });
  };

  const swipeActionList = (item) => {
    if (checkLongAbsentee(item.uuid)) return [];
    let rv = [
      {
        key: "od",
        text: "OD",
        color: "primary",
        onClick: () => absendClick(item, "od"),
      },
      {
        key: "ab",
        text: "AB",
        color: "danger",
        onClick: () => absendClick(item),
      },
    ];

    if (checkStudentMarked(item) != "p")
      rv.push({
        key: "p",
        text: "P",
        color: "success",
        onClick: () => absendClick(item, "p"),
      });

    return rv;
  };

  return (
    <div>
      <HeaderBar title="Attendance Entry"></HeaderBar>

      <div className="mt-50">
        <div className="bg-light border-all py-3 px-2 text-center fw-bold fixed-top mt-50 ">
          {stateField("subject_code")}-{stateField("subject_name")}
        </div>
        <div className="container mt-120 mb-100">
          <List>
            {dataView.map((item, i) => {
              let sta = checkStudentMarked(item);
              return (
                <SwipeAction key={item.id} rightActions={swipeActionList(item)}>
                  <List.Item
                    extra={item.registerno || item.admissionno}
                    className={
                      sta == "a" || sta == "la"
                        ? "border-left-danger"
                        : sta == "od"
                        ? "border-left-blue"
                        : null
                    }
                  >
                    {item.name}
                    {checkLongAbsentee(item.uuid) && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "10px" }}
                      >
                        <br />
                        Long Absent
                      </span>
                    )}
                  </List.Item>
                </SwipeAction>
              );
            })}
          </List>
        </div>

        <div className="pt-3 pb-2 px-3 fixed-bottom bg-light">
          <span className="float-state">
            <Button
              size="middle"
              color="danger"
              fill="none"
              style={{ fontSize: "12px" }}
            >
              <span className="border-bottom">AB</span>
              <br />
              <span>{markedCount("a")}</span>
            </Button>
            <Button
              size="middle"
              color="primary"
              fill="none"
              style={{ fontSize: "12px" }}
            >
              <span className="border-bottom">OD</span>
              <br />
              <span>{markedCount("od")}</span>
            </Button>
            <Button
              size="middle"
              color="danger"
              fill="none"
              style={{ fontSize: "12px" }}
            >
              <span className="border-bottom">LA</span>
              <br />
              <span>{markedCount("la")}</span>
            </Button>
            <Button
              size="middle"
              color="success"
              fill="none"
              style={{ fontSize: "12px" }}
            >
              <span className="border-bottom">P</span>
              <br />
              <span>{markedCount("p")}</span>
            </Button>
          </span>
          <span className="float-end">
            <Button
              size="middle"
              color="primary"
              onClick={(e) => confirmClick()}
            >
              <i className="fa-sharp fa-solid fa-share-from-square"></i> Save
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default withRouter(MarkAttendance);
