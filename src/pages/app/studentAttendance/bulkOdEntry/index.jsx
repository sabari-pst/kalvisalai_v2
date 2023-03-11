import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import moment from "moment";
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
  lessThanToday,
  momentDate,
  semesterValue,
  timeTableDayFromNumber,
  upperCase,
} from "../../../../utils";
import { Input, Select, Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";

import ModuleAccess from "../../../../context/moduleAccess";

import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";

const BulkOdEntry = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedHours, setSelectedHours] = useState("");

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  let dayOrderInDayName = context.settingValue(
    "attendance_dayorder_as_day_name"
  );

  const attendance_hour_per_day = context.settingValue(
    "hour_for_attendance_per_day"
  );

  const resetAll = () => {
    setSelectedCourse([]);
    setFromDate(momentDate(new Date(), "YYYY-MM-DD"));
    setToDate(momentDate(new Date(), "YYYY-MM-DD"));
    setDataList([]);
    setDataView([]);
    setLoader(false);
  };

  useEffect(() => {
    if (selectedCourse.course_id) {
      loadStudents();
    }
  }, [selectedCourse]);

  const loadStudents = () => {
    setLoader(true);
    const form = new FormData();
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    form.append("left", 0);

    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const getTitle = () => {
    if (selectedCourse.course_id) {
      return `Bulk OD Entry > ${selectedCourse.academic_year} > ${
        selectedCourse.course_name
      } > ${selectedCourse.semester} Sem > ${upperCase(
        selectedCourse.section
      )}`;
    } else return "Bulk OD Entry";
  };

  const getOdType = () => {
    let rv = [];

    if (context.allowedAccess("stu_attendance_bulk_od", "action_create"))
      rv.push("od");
    if (context.allowedAccess("stu_attendance_bulk_p", "action_create"))
      rv.push("p");
    if (context.allowedAccess("stu_attendance_bulk_ab", "action_create"))
      rv.push("ab");
    if (context.allowedAccess("stu_attendance_bulk_ml", "action_create"))
      rv.push("ml");

    return rv;
  };

  const handleOdFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (dataView.length < 1) {
      toast.error("Please select Students");
      return;
    }
    if (selectedHours.length < 1) {
      toast.error("Please select Hours");
      return;
    }
    if (!window.confirm("Do you want to update ?")) return;
    setLoader(true);
    axios
      .post(ServiceUrl.STUDENTS.MARK_BULK_OD, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const handleSelectAllClick = () => {
    if (dataView.length > 0) setDataView([]);
    else {
      //setDataView(dataList);
      let m = [];
      dataList.map((item) => m.push({ uuid: item.uuid }));
      setDataView(m);
    }
  };

  const checkMarked = (item) => {
    let dv = [...dataView];
    let index = dv.findIndex((obj) => obj.uuid == item.uuid);

    return index > -1 ? true : false;
  };

  const rowCheck = (item) => {
    let dv = [...dataView];
    let index = dataView.findIndex((obj) => obj.uuid == item.uuid);
    if (index > -1) dv = dv.filter((obj) => obj.uuid != item.uuid);
    else dv.push({ uuid: item.uuid });
    setDataView(dv);
  };

  const attendnaceHours = () => {
    let rv = [];
    let c = selectedCourse.course_details;
    let hpd = attendance_hour_per_day;
    if (c) c = JSON.parse(c);
    if (c && c.att_hour_per_day && c.att_hour_per_day != "0")
      hpd = c.att_hour_per_day;
    for (let i = 1; i <= hpd; i++) rv.push({ value: i, label: `H${i}` });
    return rv;
  };

  const handleHoursChange = (value) => {
    setSelectedHours(value);
  };

  return (
    <>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
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
              <Spin spinning={loader}>
                <Form
                  action=""
                  method="post"
                  noValidate
                  validated={validated}
                  onSubmit={handleOdFormSubmit}
                >
                  <input
                    type="hidden"
                    name="students"
                    value={JSON.stringify(dataView)}
                  />
                  <input
                    type="hidden"
                    name="selected_hours"
                    value={selectedHours}
                  />
                  <Row className="mt-3">
                    <Col md={2}>
                      <InputGroup size="sm">
                        <InputGroup.Text>From</InputGroup.Text>
                        <Form.Control
                          type="date"
                          size="sm"
                          name="from_date"
                          className="fw-bold"
                          value={fromDate}
                          max={momentDate(new Date(), "YYYY-MM-DD")}
                          onChange={(e) =>
                            lessThanToday(e.target.value, true) &&
                            setFromDate(e.target.value)
                          }
                          required
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
                          name="to_date"
                          min={fromDate}
                          max={momentDate(new Date(), "YYYY-MM-DD")}
                          value={toDate}
                          onChange={(e) =>
                            lessThanToday(e.target.value, true) &&
                            setToDate(e.target.value)
                          }
                          required
                        />
                      </InputGroup>
                    </Col>
                    <Col md={8}>
                      <Alert
                        variant=""
                        size="sm"
                        className="py-1 bg-red-50 text-danger"
                      >
                        OD only Marked for the students, If already they marked
                        as Present or Absent
                      </Alert>
                    </Col>
                  </Row>
                  <Row className="mt-1">
                    <Col md={2}>
                      <InputGroup size="sm">
                        <InputGroup.Text>Type</InputGroup.Text>
                        <Form.Control
                          as="select"
                          size="sm"
                          name="leave_type"
                          className="fw-bold form-select form-select-sm"
                          required
                        >
                          {getOdType().map((item) => (
                            <option value={item}>{upperCase(item)}</option>
                          ))}
                        </Form.Control>
                      </InputGroup>
                    </Col>
                    <Col md={4}>
                      <Select
                        size="small"
                        mode="multiple"
                        allowClear
                        placeholder="Select Hours"
                        style={{ width: "100%" }}
                        options={attendnaceHours()}
                        onChange={handleHoursChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputGroup size="sm">
                        <InputGroup.Text>Reason</InputGroup.Text>
                        <Form.Control
                          type="text"
                          size="sm"
                          className="fw-bold"
                          name="leave_remarks"
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md={12}>
                      <div
                        className="tableFixHead ps-table bg-white"
                        style={{
                          height: "calc(100vh - 230px)",
                        }}
                      >
                        <table>
                          <thead>
                            <tr>
                              <th width="60" className="text-center">
                                <input
                                  type="checkbox"
                                  checked={dataView.length == dataList.length}
                                  onClick={(e) => handleSelectAllClick()}
                                />
                              </th>
                              <th width="60">S.No</th>
                              <th>Register No</th>
                              <th>Admission No</th>
                              <th>Student Name</th>
                              <th>Father Name</th>
                              <th width="100">Gender</th>
                              <th width="120">Date of Birth</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataList.map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td align="center">
                                    <input
                                      type="checkbox"
                                      checked={checkMarked(item)}
                                      onClick={(e) => rowCheck(item)}
                                    />
                                  </td>
                                  <td>{i + 1}</td>
                                  <td>{item.registerno}</td>
                                  <td>{item.admissionno}</td>
                                  <td>
                                    {item.name} {item.initial}
                                  </td>
                                  <td>{item.fathername}</td>
                                  <td>{item.gender}</td>
                                  <td>{item.dob}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={2}>
                      <InputGroup size="sm">
                        <InputGroup.Text>Selectd Students</InputGroup.Text>
                        <Form.Control
                          type="number"
                          size="sm"
                          className="fw-bold"
                          name="total_students"
                          value={dataView.length}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={10}>
                      <div className="text-end">
                        <LoaderSubmitButton
                          type="submit"
                          text="Update Records"
                          loading={loader}
                        />
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Spin>
            </div>
          )}
        </Spin>
      </div>
    </>
  );
};

export default withRouter(BulkOdEntry);
