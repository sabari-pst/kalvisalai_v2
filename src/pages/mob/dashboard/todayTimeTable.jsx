import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import PsContext from "../../../context";

import { Card, Col, Form, Row } from "react-bootstrap";
import { momentDate, timeTableDayFromNumber, yearBySem } from "../../../utils";
import { ServiceUrl } from "../../../utils/serviceUrl";
import { DotLoading, List, Popup, Tag } from "antd-mobile";
import { Redirect } from "react-router-dom";
import { Button } from "antd-mobile";
import { currentSemesterStartAndEndDate } from "../../../models/academicYears";

const TodayTimeTable = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [redirect, setRedirect] = useState([]);

  const [holiday, setHoliday] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [semDate, setSemDate] = useState([]);

  const getAttendanceDate = () => {
    let x = context.getStorage("mob_attendance_date");
    return x && x != null ? x : momentDate(new Date(), "YYYY-MM-DD");
  };

  const [attendanceDate, setAttendaceDate] = useState(getAttendanceDate());

  useEffect(() => {
    currentSemesterStartAndEndDate().then((res) => res && setSemDate(res));
    if (attendanceDate && attendanceDate != undefined) loadData();
  }, [attendanceDate]);

  const loadData = () => {
    setLoader(true);
    setHoliday([]);
    setDataList([]);
    const form = new FormData();
    form.append("type", "today");
    form.append("date", attendanceDate); //momentDate(new Date(), "YYYY-MM-DD"));
    axios.post(ServiceUrl.MOB.MY_TIME_TABLE, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
      } else {
        if (res["data"].data) setHoliday(res["data"].data);
      }
      setLoader(false);
    });
  };

  const timeTableClick = (item) => {
    setRedirect(item);
  };

  if (redirect && redirect.id) {
    //setRedirect(false);
    return (
      <Redirect
        to={{
          pathname: "/mob/app/attendancentry",
          state: redirect,
        }}
      />
    );
  }

  const getTodayDayOrder = () => {
    if (dataList.length < 1) return "";
    return (
      <Tag color="primary" fill="outline">{` ${timeTableDayFromNumber(
        dataList[0].day_value
      )}`}</Tag>
    );
  };

  const onDaySelect = () => {
    context.setStorage("mob_attendance_date", selectedDate);
    setAttendaceDate(selectedDate);
    setShowPopUp(false);
  };

  return (
    <div className="">
      <Card>
        <Card.Header className="fw-bold">
          Today Time Table
          <Button
            size="small"
            className="ms-2"
            onClick={(e) => setShowPopUp(true)}
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </Button>
          <span className="float-end">{getTodayDayOrder()}</span>
        </Card.Header>
        <Card.Body>
          {loader && (
            <div className="text-center py-3 fs-4">
              <DotLoading />
            </div>
          )}
          <div className="text-center mb-2">
            <Tag
              color="success"
              fill="outline"
              style={{ "--background-color": "#c8f7c5", fontSize: "14px" }}
            >
              Date : {momentDate(attendanceDate, "DD-MMM-YYYY")}
            </Tag>
          </div>
          {dataList.length > 0 && (
            <List>
              {dataList.map((item, i) => {
                return (
                  <List.Item
                    onClick={(e) => timeTableClick(item)}
                    prefix={
                      item.attendace_marked_cout > 0 ? (
                        <i className="fa-solid fa-circle-check text-success"></i>
                      ) : (
                        ""
                      )
                    }
                  >
                    <div style={{ fontSize: "11px", fontWeight: "bold" }}>
                      {item.subject_name} - {`H${item.hour_value}`}
                    </div>
                    <small className="text-silver-200">
                      {item.degreename}-{item.coursename} (
                      {yearBySem(item.semester)})
                    </small>
                  </List.Item>
                );
              })}
            </List>
          )}
          {holiday && holiday.id && (
            <div className="text-center ">
              <Tag color="danger" fill="outline">
                <b>{holiday.holiday_name}</b>
              </Tag>
            </div>
          )}
        </Card.Body>
      </Card>

      <Popup
        visible={showPopUp}
        showCloseButton
        onClose={() => {
          setShowPopUp(false);
        }}
        bodyStyle={{ height: "40vh" }}
        onMaskClick={() => {
          setShowPopUp(false);
        }}
      >
        <div
          className="text-center "
          style={{ marginTop: "80px", padding: "20px" }}
        >
          <label className="mb-3">Select Date</label>
          <Form.Control
            type="date"
            max={momentDate(new Date(), "YYYY-MM-DD")}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={semDate?.start_date}
          />
          <br />
          <Button color="primary" onClick={(e) => onDaySelect()}>
            Set Date
          </Button>
        </div>
      </Popup>
    </div>
  );
};

export default TodayTimeTable;
