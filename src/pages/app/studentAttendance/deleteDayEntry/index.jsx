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
  semesterValue,
  timeTableDayFromNumber,
  upperCase,
} from "../../../../utils";
import { Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";

import ModuleAccess from "../../../../context/moduleAccess";
import { formatTimeStr } from "antd/lib/statistic/utils";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";

const DeleteDayEntry = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [attendaceDate, setAttendanceDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [selectedHour, setSelectedHour] = useState("");

  const [selectedId, setSelectedId] = useState("");
  let dayOrderInDayName = context.settingValue(
    "attendance_dayorder_as_day_name"
  );

  const attendance_hour_per_day = context.settingValue(
    "hour_for_attendance_per_day"
  );

  const handleDeleteClick = (item) => {
    if (!window.confirm("Do you want to delete?")) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    form.append("student_uuid", item.student_uuid);
    axios
      .post(ServiceUrl.STUDENTS.DELETE_LONG_ABSENT_STUDENT, form)
      .then((res) => {
        if (res["data"].status == "1") {
          let m = dataList.filter((obj) => obj.id != item.id);
          setDataList(m);
          setDataView(m);
          toast.success(res["data"].message || "Success");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const loadData = () => {
    setLoader(true);
    const form = new FormData();
    form.append("attendance_date", attendaceDate);
    form.append("course", selectedCourse.course_id);
    form.append("batch", selectedCourse.academic_year);
    form.append("section", selectedCourse.section);
    form.append("semester", selectedCourse.semester);

    axios.post(ServiceUrl.STUDENTS.DAy_WISE_ENTRY_RECORDS, form).then((res) => {
      if (res["data"].status == "1") {
        let m = groupByMultiple(res["data"].data, function (obj) {
          return [obj.student_uuid];
        });
        setDataList(res["data"].data);
        setDataView(m);
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
    setAttendanceDate(momentDate(new Date(), "YYYY-MM-DD"));
    setSelectedHour("");
  };

  const arrowClick = (item) => {
    if (selectedId == item.student_uuid) setSelectedId("");
    else setSelectedId(item.student_uuid);
  };

  const getInnerRows = (items) => {
    let rv = [];

    items = items.sort(getAscSortOrder("hour_value"));
    items.map((item, i) => {
      rv.push(
        <tr>
          <td>{timeTableDayFromNumber(item.day_value, dayOrderInDayName)}</td>
          <td>{item.hour_value}</td>
          <td>{item.subject_name}</td>
          <td>
            {item.emp_name} {item.emp_initial}
          </td>
          <td align="center">{upperCase(item.leave_type)}</td>
          <td align="center">
            <ModuleAccess
              module={"stu_att_delete_day_entry"}
              action={"action_delete"}
            >
              <Button
                size="sm"
                variant="transparent"
                onClick={(e) => singleDelete(item)}
              >
                <i className="fa-solid fa-trash-can fs-7"></i>
              </Button>
            </ModuleAccess>
          </td>
        </tr>
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Hour</th>
            <th>Subject</th>
            <th>Staff</th>
            <th width="80">Status</th>
            <th width="60">#</th>
          </tr>
        </thead>
        <tbody>{rv}</tbody>
      </table>
    );
  };

  const studentWiseDelete = (items) => {
    if (!window.confirm("Do you want to delete ?")) return;
    let item = items[0];
    const form = new FormData();
    form.append("attendance_date", item.attendance_date);
    form.append("college_year", item.college_year);
    form.append("day_value", item.day_value);
    form.append("student_uuid", item.student_uuid);
    form.append("course", selectedCourse.course_id);
    form.append("batch", selectedCourse.academic_year);
    form.append("section", selectedCourse.section);
    form.append("semester", selectedCourse.semester);

    confirmDelete(form, item);
  };

  const singleDelete = (item) => {
    if (!window.confirm("Do you want to delete ?")) return;

    const form = new FormData();
    form.append("attendance_date", item.attendance_date);
    form.append("college_year", item.college_year);
    form.append("course", item.course);
    form.append("day_value", item.day_value);
    form.append("id", item.id);

    confirmDelete(form, item);
  };

  const deleteAll = () => {
    if (!window.confirm("Do you want to delete all records?")) return;

    let item = dataList[0];
    const form = new FormData();
    form.append("attendance_date", item.attendance_date);
    form.append("college_year", item.college_year);
    form.append("course", selectedCourse.course_id);
    form.append("batch", selectedCourse.academic_year);
    form.append("section", selectedCourse.section);
    form.append("semester", selectedCourse.semester);
    if (selectedHour && selectedHour.length > 0)
      form.append("hour_value", selectedHour);

    confirmDelete(form, false);
  };

  const confirmDelete = (form, items) => {
    setLoader(true);
    axios.post(ServiceUrl.STUDENTS.DELETE_DAY_ENTRY, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");

        if (items) {
          /*  let m = dataList.filter((item) =>
            items.length > 0
              ? item.student_uuid != items.student_uuid
              : item.id != items.id
          );
          //m.sort(getAscSortOrder("id"));
          setDataList(m);
          m = groupByMultiple(m, function (obj) {
            return [obj.student_uuid];
          });
          setDataView(m);*/

          loadData();
        } else {
          resetAll();
          setLoader(false);
        }
      } else {
        toast.error(res["data"].message || "Error");
        setLoader(false);
      }
    });
  };

  const getTitle = () => {
    if (selectedCourse.course_id) {
      return `Delete Day Entry > ${selectedCourse.academic_year} > ${
        selectedCourse.course_name
      } > ${selectedCourse.semester} Sem > ${upperCase(
        selectedCourse.section
      )}`;
    } else return "Delete Day Entry";
  };

  return (
    <>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          {dataList.length > 0 && (
            <ModuleAccess
              module="stu_att_delete_day_entry"
              action="action_delete"
            >
              <li className="list-inline-item">
                <select
                  className="form-select form-select-sm fw-bold"
                  onChange={(e) => setSelectedHour(e.target.value)}
                >
                  <option value="">All</option>
                  {Array.from({ length: attendance_hour_per_day }, (v, i) => (
                    <option
                      value={i + 1}
                      selected={selectedHour == i + 1 ? "selected" : ""}
                    >
                      Hour - {i + 1}
                    </option>
                  ))}
                </select>
              </li>
              <li className="list-inline-item">
                <Button
                  variant="white"
                  className="border-start ms-2"
                  onClick={deleteAll}
                >
                  <i className="fa fa-trash-can fs-5 px-1"></i> Delete All
                  Entries
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

      <div className="container">
        <Spin spinning={loader}>
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
          {selectedCourse.course_id && (
            <div>
              {dataList && dataList.length < 1 && (
                <Row className="mt-3">
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Attendace Date</InputGroup.Text>
                      <Form.Control
                        type="date"
                        size="sm"
                        className="fw-bold"
                        value={attendaceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={1}>
                    <Button
                      type="button"
                      size="sm"
                      className="w-100"
                      onClick={loadData}
                    >
                      View
                    </Button>
                  </Col>
                </Row>
              )}

              {dataList && dataList.length > 0 && (
                <Card className="mt-3">
                  <Card.Body>
                    <div
                      className="tableFixHead ps-table"
                      style={{ maxHeight: "calc(100vh - 150px)" }}
                    >
                      <table className="">
                        <thead>
                          <tr>
                            <th width="60">S.No</th>
                            <th>Date</th>
                            <th>Reg.No</th>
                            <th>Name</th>
                            <th>Course</th>
                            <th width="80">Section</th>
                            <th width="60">Manage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataView.map((items, i) => {
                            let item = items[0];
                            return (
                              <>
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>
                                    {momentDate(
                                      item.attendance_date,
                                      "DD/MM/YYYY"
                                    )}
                                  </td>
                                  <td>
                                    <span
                                      className="px-2 cursor-pointer"
                                      onClick={(e) => arrowClick(item)}
                                    >
                                      {selectedId == item.student_uuid ? (
                                        <i className="fa-solid fa-chevron-down"></i>
                                      ) : (
                                        <i className="fa-solid fa-chevron-right"></i>
                                      )}
                                    </span>
                                    {item.registerno || item.amissionno}
                                  </td>
                                  <td>
                                    {item.name} {item.initial}
                                  </td>
                                  <td>
                                    {item.degree_name} - {item.course_name} (
                                    {item.dept_type == "aided" ? "R" : "SF"})
                                  </td>
                                  <td align="center">
                                    {upperCase(item.section)}
                                  </td>
                                  <td align="center">
                                    <ModuleAccess
                                      module={"stu_att_delete_day_entry"}
                                      action={"action_delete"}
                                    >
                                      <Button
                                        size="sm"
                                        variant="transparent"
                                        onClick={(e) =>
                                          studentWiseDelete(items)
                                        }
                                      >
                                        <i className="fa-solid fa-trash-can fs-7"></i>
                                      </Button>
                                    </ModuleAccess>
                                  </td>
                                </tr>
                                {selectedId == item.student_uuid && (
                                  <tr>
                                    <td></td>
                                    <td></td>
                                    <td colSpan={5}>{getInnerRows(items)}</td>
                                  </tr>
                                )}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </Spin>
      </div>
    </>
  );
};

export default withRouter(DeleteDayEntry);
