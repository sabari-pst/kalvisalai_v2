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
  capitalizeFirst,
  CardFixedTop,
  timeTableDayFromNumber,
  upperCase,
} from "../../../../utils";
import { listPaymentMethods } from "../../../../models/fees";
import axios from "axios";
import { formatCountdown } from "antd/lib/statistic/utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import { Input, Spin } from "antd";
import PsModalWindow from "../../../../utils/PsModalWindow";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import Modal from "react-bootstrap/Modal";
import SelectcourseAndStaff from "./selectcourseAndStaff";
import Editcourse from "./editcourse";
import ModuleAccess from "../../../../context/moduleAccess";

const Createtable = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [dataListSub, setDataSub] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dataSource, setdataSource] = useState([]);
  const [students, setStudents] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [editStaffModal, setEditStaffModal] = useState(false);
  const [dataSubView, setSubView] = useState([]);

  const [attendanceData, setAttendanceData] = useState([]);
  const [showSelectStaff, setShowSelectStaff] = useState(false);

  const [editItem, setEditItem] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  const [hourCount, setHourCount] = useState(
    context.settingValue("hour_for_attendance_per_day")
  );

  const [show, setShow] = useState(false);
  useEffect(() => {
    getReport();
    getSubject();
    loadTimeTableData();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedCourse.course_id) {
      getReport();
      getSubject();
      loadTimeTableData();

      if (
        courseDetails("att_hour_per_day") &&
        courseDetails("att_hour_per_day") != "0"
      )
        setHourCount(courseDetails("att_hour_per_day"));
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
      }
      setLoader(false);
    });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const getReport = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    axios.get(ServiceUrl.HR.LIST_EMPLOYEES + "?limit=0").then((res) => {
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
    // let hourCount = context.settingValue("hour_for_attendance_per_day");
    let rv = [];
    for (let i = 0; i < hourCount; i++) {
      rv.push(<th>Hour {i + 1}</th>);
    }
    return rv;
  };

  const getTableRow = () => {
    //let hourCount = context.settingValue("hour_for_attendance_per_day");
    let rv = [];
    let dayOrderCount = context.settingValue("attendance_day_order_count");
    let dayOrderInDayName = context.settingValue(
      "attendance_dayorder_as_day_name"
    );
    for (let j = 1; j <= dayOrderCount; j++) {
      let td = [];
      td.push(<td>{timeTableDayFromNumber(j, dayOrderInDayName)}</td>);
      for (let i = 0; i < hourCount; i++) {
        let m = getDayValue(j, i + 1);
        if (!m) {
          td.push(
            <td>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={(e) => selectButtonClick(j, i + 1)}
              >
                Select
              </Button>
            </td>
          );
        } else {
          td.push(<td align="">{m}</td>);
        }
      }

      rv.push(<tr>{td}</tr>);
    }
    return rv;
  };

  const getForeColor = (c) => {
    return "#000";
    var rgb = parseInt(c, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 40) {
      return "#ffffff";
    }
    return "#000";
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
        <div className={i && "text-center border-top"}>
          {(sub && sub.subject_name && (
            <div
              style={{
                textAlign: "center",
                padding: "3px",
                backgroundColor: "#fff",
                color: getForeColor(sub.subject_color),
              }}
            >
              {sub.subject_name}
            </div>
          )) ||
            ""}
          <div className={"text-center"}>
            {(t && t.emp_name) || ""}
            <ModuleAccess
              module="timetable_create_timetable"
              action="action_update"
            >
              {i == 0 && (
                <Button
                  size="sm"
                  variant="transparent"
                  className="float-start"
                  title="Add"
                  onClick={(e) => selectButtonClick(day, hour)}
                >
                  <i className="fa-solid fa-plus fs-6"></i>
                </Button>
              )}
              <Button
                size="sm"
                variant="transparent"
                className="float-end"
                title="Edit"
                onClick={(e) => editButtonClick(day, hour, d)}
              >
                <i className="fa-solid fa-pen fs-6"></i>
              </Button>
            </ModuleAccess>
          </div>
        </div>
      );
    });

    return rv;
  };

  const editButtonClick = (day, hour, item) => {
    setSelectedDay(day);
    setSelectedHour(hour);
    setEditItem(item);
    setEditStaffModal(true);
  };

  const selectButtonClick = (day, hour) => {
    setSelectedDay(day);
    setSelectedHour(hour);
    setShowSelectStaff(true);
  };

  const selectFormSuccess = (d) => {
    loadTimeTableData();
  };

  const ontimetablesave = () => {
    // console.log('attData',attendanceData)
  };

  const handleFormUpdate = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!window.confirm("Do you want to Update?")) {
      return;
    }

    setLoader(true);
    axios
      .post(
        ServiceUrl.SETTINGS.UPDATE_TIMETABLE,
        $("#frm_Updatetimetable").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          // toast.success(res['data'].message || 'Success');
          setAttendanceData();
          setSelectedCourse();
          setLoader(false);
        } else {
          // toast.error(res['data'].message || 'Error');
        }
        setLoader(false);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!window.confirm("Do you want to save?")) {
      return;
    }

    setLoader(true);
    axios
      .post(
        ServiceUrl.SETTINGS.SAVE_TIMETABLE,
        $("#frm_Savetimetable").serialize()
      )
      .then((res) => {
        if (res["data"].status == "1") {
          // toast.success(res['data'].message || 'Success');
          setAttendanceData();
          setSelectedCourse();
          setLoader(false);
        } else {
          // toast.error(res['data'].message || 'Error');
        }
        setLoader(false);
      });
  };

  const getTitle = () => {
    if (selectedCourse && selectedCourse.course_id) {
      return `Create Time Table for : ${
        selectedCourse.course_name
      } - (${upperCase(selectedCourse.section)}) - ${
        selectedCourse.academic_year
      } - SEM : ${selectedCourse.semester}`;
    }
    return "Create Time Table";
  };

  return (
    <>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
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
          <ModuleAccess
            module="timetable_create_timetable"
            action="action_create"
          >
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
              <Card.Header className="fw-bold">Time Table Settings</Card.Header>

              <Card.Body>
                <Form
                  noValidate
                  validated={validated}
                  action=""
                  method="post"
                  id="frm_Savetimetable"
                  onSubmit={handleFormSubmit}
                >
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        {getTableHeadRow()}
                      </tr>
                    </thead>
                    <tbody>{getTableRow()}</tbody>
                  </table>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Spin>
      </div>

      {showSelectStaff && (
        <SelectcourseAndStaff
          show={showSelectStaff}
          title="Select Staff & Subject"
          size="md"
          onHide={(e) => setShowSelectStaff(false)}
          day={selectedDay}
          hour={selectedHour}
          course={selectedCourse}
          onSuccess={selectFormSuccess}
        />
      )}
      {editStaffModal && (
        <Editcourse
          show={editStaffModal}
          title="Edit Staff & Subject"
          size="md"
          onHide={(e) => setEditStaffModal(false)}
          dataSource={editItem}
          day={selectedDay}
          hour={selectedHour}
          course={selectedCourse}
          onSuccess={selectFormSuccess}
          onDelete={(e) => {
            setEditStaffModal(false);
            loadTimeTableData();
          }}
        />
      )}
    </>
  );
};
export default Createtable;
