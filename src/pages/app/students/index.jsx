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
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  lowerCase,
  momentDate,
  upperCase,
  yearByBatch,
} from "../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../utils/serviceUrl";
import PsModalWindow from "../../../utils/PsModalWindow";
import { NoDataFound } from "../components";

import SelectRecords from "../feeAssigning/classWiseFeeAssigning/selectRecords";
import TransportAllocationModal from "./transportAllocation/transportAllocationModal";
import ViewStudentModal from "./viewStudent/viewStudentModal";
import { COURSE_TYPE_SORT_ORDER, ROLES } from "../../../utils/data";
import EditStudentModal from "./editStudent/editStudentModal";
import ModuleAccess from "../../../context/moduleAccess";
import MarkLongAbsentWindow from "../studentAttendance/longAbsenties/markLongAbsentWindow";
import { useExcelDownloder } from "react-xls";

const Students = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const { ExcelDownloder, Type } = useExcelDownloder();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [markLongAbsent, setMarkLongAbsent] = useState(false);

  const [showTransportModal, setSowTransportModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState([]);
  const [filterBy, setFilterBy] = useState("all");

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  useEffect(() => {
    if (props.location.params && props.location.params.selectedCourse)
      setSelectedCourse(props.location.params.selectedCourse);
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedCourse.course_id) getReport();
  }, [selectedCourse]);

  const resetAll = () => {
    setDataView([]);
    setDataList([]);
    setViewData([]);
    setSelectedCourse([]);
    setFilterBy("all");
  };

  const getReport = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    setSowTransportModal(false);

    const form = new FormData();
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);

    axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        setDataView(res["data"].data);
      }
      setLoader(false);
    });
  };

  const handleDeleteClick = (item) => {
    if (!window.confirm("Do you want to remove?")) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    form.append("uuid", item.uuid);
    axios.post(ServiceUrl.STUDENTS.REMOVE_LEFT, form).then((res) => {
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

  const handleSearch = (e) => {
    let v = upperCase(e.target.value);
    let m = dataList.filter(
      (item) =>
        upperCase(item.registerno).indexOf(v) > -1 ||
        upperCase(item.admissionno).indexOf(v) > -1 ||
        upperCase(item.name).indexOf(v) > -1 ||
        upperCase(item.mobile).indexOf(v) > -1 ||
        upperCase(item.place_present).indexOf(v) > -1 ||
        upperCase(item.place_permanent).indexOf(v) > -1 ||
        upperCase(item.city_present).indexOf(v) > -1 ||
        upperCase(item.city_permanent).indexOf(v) > -1
    );

    setDataView(m);
    setFilterBy("all");
  };

  const handleLongAbsentClick = (item) => {
    setViewData(item);
    setMarkLongAbsent(true);
  };

  const handleEdit = (item) => {
    setViewData(item);
    setShowEdit(true);
  };

  const handleViewClick = (item) => {
    setViewData(item);
    setShowView(true);
  };

  const handleTransportClick = (item) => {
    setViewData(item);
    setSowTransportModal(true);
  };

  const selectCourseSuccess = (co) => {
    setSelectedCourse(co);
  };

  const getTitle = () => {
    if (selectedCourse && selectedCourse.course_id) {
      return `Students > ${selectedCourse.academic_year} > ${
        selectedCourse.course_name
      } > ${selectedCourse.semester} Sem > ${upperCase(
        selectedCourse.section
      )}`;
    }
    return "Students";
  };

  const exportFileName = () => {
    if (selectedCourse && selectedCourse.course_id) {
      return `Students_${selectedCourse.academic_year}_${
        selectedCourse.course_name
      }_${selectedCourse.semester}_Sem_${upperCase(selectedCourse.section)}`;
    }
    return "Students";
  };

  const getActionDropdown = (item) => {
    return (
      <DropdownButton
        id="dropdown-basic-button"
        title={
          <>
            Action <i class="fa-solid fa-angle-down"></i>
          </>
        }
        variant="transparent"
        size="sm"
        className="ps-table_action-dropdown"
      >
        <ModuleAccess module="list_students" action="action_read">
          <a
            href="javascript:;"
            className="dropdown-item"
            onClick={(e) => handleViewClick(item)}
          >
            <i className="fa-solid fa-user me-2"></i> View Details
          </a>
        </ModuleAccess>
        {/* Transport Edit Details allowed for Accountant and Admin Only*/}
        <ModuleAccess module="list_students" action="action_update">
          <Dropdown.Divider />
          <a
            href="javascript:;"
            className="dropdown-item"
            onClick={(e) => handleEdit(item)}
          >
            <i className="fa-solid fa-pen me-2"></i> Edit Details
          </a>
        </ModuleAccess>
        <ModuleAccess module="student_transport_new" action="action_read">
          <Dropdown.Divider />
          <a
            href="javascript:;"
            className="dropdown-item"
            onClick={(e) => handleTransportClick(item)}
          >
            <i className="fa-solid fa-bus-simple me-2"></i> Transport Details
          </a>
        </ModuleAccess>
        <ModuleAccess
          module="stu_attendance_long_absenties"
          action="action_create"
        >
          <Dropdown.Divider />
          <a
            href="javascript:;"
            className="dropdown-item"
            onClick={(e) => handleLongAbsentClick(item)}
          >
            <i className="fa-solid fa-pen me-2"></i> Mark As Long Absent
          </a>
        </ModuleAccess>
      </DropdownButton>
    );
  };

  const getStudentsCasteWiseCount = (commu) => {
    let stu = dataList.filter(
      (item) => upperCase(item.community_name) == upperCase(commu)
    );
    if (commu == "left") {
      stu = dataList.filter((item) => item.isleft == "1");
    }
    return stu.length;
  };
  const getStudentsCount = () => {
    let ts = dataList.filter((item) => item.vehicle_no);
    let m = [];
    m.push({ name: "Total", filter: "all", count: dataList.length });
    m.push({
      name: "Transport",
      filter: "transport",
      count: ts.length,
    });
    m.push({
      name: "OC",
      filter: "oc",
      count: getStudentsCasteWiseCount("oc"),
    });
    m.push({
      name: "BC",
      filter: "bc",
      count: getStudentsCasteWiseCount("bc"),
    });
    m.push({
      name: "BCM",
      filter: "bcm",
      count: getStudentsCasteWiseCount("bcm"),
    });
    m.push({
      name: "MBC",
      filter: "mbc",
      count: getStudentsCasteWiseCount("mbc"),
    });
    m.push({
      name: "DNC",
      filter: "dnc",
      count: getStudentsCasteWiseCount("dnc"),
    });
    m.push({
      name: "SC",
      filter: "sc",
      count: getStudentsCasteWiseCount("sc"),
    });
    m.push({
      name: "SC(A)",
      filter: "sca",
      count: getStudentsCasteWiseCount("sca"),
    });
    m.push({
      name: "ST",
      filter: "st",
      count: getStudentsCasteWiseCount("st"),
    });
    m.push({
      name: "Left",
      filter: "left",
      count: getStudentsCasteWiseCount("left"),
    });

    return m;
  };

  const buttonFilterClick = (filterValue) => {
    let v = lowerCase(filterValue);

    let dt = dataList;
    if (v == "all") dt = dataList;
    else if (v == "transport") dt = dataList.filter((item) => item.vehicle_no);
    else if (v == "left") dt = dataList.filter((item) => item.isleft == "1");
    else
      dt = dataList.filter(
        (item) => upperCase(item.community_name) == upperCase(v)
      );
    setDataView(dt);
    setFilterBy(v);
  };

  const printExcelFormatData = () => {
    let rv = [];
    dataView.map((item) => {
      rv.push({
        "Roll No": item.rollno,
        "Register No": item.registerno,
        Name: item.name,
        Initial: item.initial,
        DOB: item.dob,
        Community: upperCase(item.community_name),
        Caste: item.caste,
        Mobile: item.mobile,
        Email: item.email,
        Admission_Year: item.acyear,
        "Application No": item.application_no,
        "Application Date": item.application_date,
        Admission: item.admissionno,
        "Admission Date": item.admissiondate,
        Gender: capitalizeFirst(item.gender),
        Nationality: item.nationality,
        Section: upperCase(item.section),
        Semester: item.semester,
        Quota: item.quota,
        "Admission type": item.admisiontype,
        "Aadhar No": item.aadharno,
        "Voter Id No": item.voteridno,
        "Medium of Instruction": item.medium_of_instruction,
        Batch: item.batch,
        "Join Date": item.joindate,
        "Department Name": item.department_name,
        "Degree Name": item.degree_name,
        "Course Name": item.course_name,
        CourseType: item.course_type,
        Religion: item.religion_name,
        "Father Name": item.fathername,
        "Father Occupation": item.fatheroccupation,
        "Father Income": item.fatherincome,
        "Father Phone": item.fatherphone,
        "Mother Name": item.mothername,
        "Mother Occupation": item.motheroccupation,
        "Mother Income": item.motherincome,
        "Annual Income": item.annualincome,
        "Mother Phone": item.motherphone,
        "Mother Tongue": item.mothertongue,
        "Marital Status": item.maritalstatus,
        "Partner Name": item.partnername,
        "Partner Mobile": item.partnermobile,
        "Street Permanent": item.street_permanent,
        "Village Permanent": item.village_permanent,
        "District Permanent": item.district_permanent,
        "State Permanent": item.state_permanent,
        "Country Permanent": item.country_permanent,
        "Pincode Permanent": item.pincode_permanent,
        "Door No Present": item.doorno_present,
        "Street Present": item.street_persent,
        "Village Present": item.village_present,
        "Taluk Present": item.taluk_present,
        "District Present": item.district_present,
        "state Present": item.state_present,
        "Country Present": item.country_present,
        "Pincode Present": item.pincode_present,

        Identify1: item.identify1,
        Identify2: item.identify2,
        "Physical Challenged": item.is_physicall_challenged,
        Minority: item.is_minority,
        "Scholarship holder": item.is_scholarship_holder,
        Exserviceman: item.is_exserviceman,
        "Srilankan Tamil": item.is_srilankan_tamil,
        "Jammu Kashmir": item.is_jammu_kashmir,
        Sportsman: item.is_sportsman,
        Hosteller: item.is_hosteller,
        "Days Schollar": item.is_days_schollar,
        "Transfer On": item.transferon,
        "Tc Issue date": item.tcissuedate,
        "Leaving Class": item.leavingclass,
        "Leave Reason": item.leavereason,
        Marks: item.marks,
        "+2 Register No": item.plus2registerno,
        "HSU Ug Scored": item.hsc_ug_scored,
        "School Name": item.schoolname,
        "Left On": item.lefton,
        "Left Reason": item.left_reason,
        Remarks: item.remarks,
      });
    });
    rv.push({
      "Roll No": "",
      "Register No": "",
    });
    let ts = dataList.filter((item) => item.vehicle_no);
    rv.push({
      "Roll No": "Transport",
      "Register No": ts.length,
    });
    rv.push({
      "Roll No": "OC",
      "Register No": getStudentsCasteWiseCount("oc"),
    });
    rv.push({
      "Roll No": "BC",
      "Register No": getStudentsCasteWiseCount("bc"),
    });
    rv.push({
      "Roll No": "BCM",
      "Register No": getStudentsCasteWiseCount("bcm"),
    });
    rv.push({
      "Roll No": "MBC",
      "Register No": getStudentsCasteWiseCount("mbc"),
    });
    rv.push({
      "Roll No": "DNC",
      "Register No": getStudentsCasteWiseCount("dnc"),
    });
    rv.push({
      "Roll No": "SC",
      "Register No": getStudentsCasteWiseCount("sc"),
    });
    rv.push({
      "Roll No": "SCA",
      "Register No": getStudentsCasteWiseCount("sca"),
    });
    rv.push({
      "Roll No": "ST",
      "Register No": getStudentsCasteWiseCount("st"),
    });
    rv.push({
      "Roll No": "LEFT",
      "Register No": getStudentsCasteWiseCount("left"),
    });

    return rv;
  };

  return (
    <>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          <ModuleAccess module={"add_student"} action={"action_create"}>
            <li className="list-inline-item">
              <Link
                className="btn btn-white border-start ms-2"
                to={{
                  pathname: "/app/student/new",
                  params: { selectedCourse },
                }}
              >
                <i className="fa fa-plus fs-5 px-1"></i> Add Student
              </Link>
            </li>
          </ModuleAccess>
          <ModuleAccess module={"list_students"} action={"action_export"}>
            {dataView.length > 0 && (
              <ExcelDownloder
                className="border-start ms-2 btn btn-white"
                data={{ students: printExcelFormatData() }}
                filename={exportFileName()}
                type={Type.Button}
              >
                <i className="fa-regular fa-file-excel fs-5 px-1"></i> Export
              </ExcelDownloder>
            )}
          </ModuleAccess>
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
        {(!selectedCourse || !selectedCourse.course_id) && (
          <Row className="mt-2">
            <ModuleAccess module={"list_students"} action={"action_list"}>
              {" "}
              <Col md={6}>
                <SelectRecords onSuccess={selectCourseSuccess} withSection />
              </Col>
            </ModuleAccess>
          </Row>
        )}

        {selectedCourse && selectedCourse.course_id && (
          <Spin spinning={loader}>
            <Row className="mt-3">
              <Col md={8}>
                <ButtonGroup size="sm">
                  {getStudentsCount().map((item) => (
                    <Button
                      variant={
                        item.filter == filterBy
                          ? "secondary fw-bold"
                          : "outline-secondary fw-bold"
                      }
                      onClick={(e) => buttonFilterClick(item.filter)}
                    >
                      {item.name} : {item.count}
                    </Button>
                  ))}
                </ButtonGroup>
              </Col>
              <Col md={4}>
                <InputGroup size="sm">
                  <InputGroup.Text>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </InputGroup.Text>
                  <Form.Control
                    size="sm"
                    placeholder="Search here"
                    className="fw-bold"
                    onChange={(e) => handleSearch(e)}
                  />
                </InputGroup>
              </Col>
              {/*<Col md={8}>
                    <div className="text-end fs-sm fw-bold">
                        Total no of Students : {dataView.length}
                    </div>
                </Col>*/}

              <Col md={12} className="mt-2">
                <Card>
                  <Card.Body className="px-0 py-0">
                    <div
                      className="tableFixHead ps-table"
                      style={{ height: "calc(100vh - 150px)" }}
                    >
                      <table className="">
                        <thead>
                          <tr>
                            <th width="50">S.No</th>
                            <th>Reg.No</th>
                            <th>Student Name</th>
                            <th width="100">DOB</th>
                            <th>Father Name</th>
                            <th>Community/Caste</th>
                            <th>Place</th>
                            <th>Mobile/Email</th>
                            <th>Transport</th>
                            <th width="100" className="text-center">
                              #
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataView.map((item, i) => {
                            return (
                              <tr
                                key={i}
                                className={
                                  item.active_status == "0" ||
                                  item.isleft == "1"
                                    ? "bg-red-50 text-danger"
                                    : ""
                                }
                              >
                                <td>{i + 1}</td>
                                <td>
                                  {upperCase(
                                    item.registerno || item.admissionno
                                  )}
                                </td>
                                <td>
                                  {upperCase(item.name)}{" "}
                                  {upperCase(item.initial)}
                                </td>
                                <td>{momentDate(item.dob, "DD/MM/YYYY")}</td>
                                <td>{upperCase(item.fathername)}</td>
                                <td>
                                  {upperCase(item.community_name)}
                                  <br />
                                  {upperCase(item.caste)}
                                </td>
                                <td>
                                  {item.place_present || item.place_permanent}
                                  <br />
                                  {item.city_present || item.city_permanent}
                                </td>
                                <td>
                                  {item.mobile}
                                  <br />
                                  {item.email}
                                </td>
                                <td>
                                  {upperCase(item.vehicle_no)}
                                  <br />
                                  {upperCase(item.destination_name)}
                                </td>
                                <td align="center">
                                  {getActionDropdown(item)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {!loader && dataView.length < 1 && (
                        <NoDataFound className="my-4" />
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Spin>
        )}
      </div>

      {showTransportModal && (
        <TransportAllocationModal
          show={showTransportModal}
          title="Student Transport Details"
          size="md"
          onHide={(e) => setSowTransportModal(false)}
          dataSource={viewData}
          onSuccess={getReport}
        />
      )}

      {showView && (
        <ViewStudentModal
          show={showView}
          title={`View Student Information - ${upperCase(viewData.name)}`}
          onHide={(e) => setShowView(false)}
          dataSource={viewData}
          size="xl"
        />
      )}

      {showEdit && (
        <EditStudentModal
          show={showEdit}
          title={`Update Student Information - ${upperCase(viewData.name)}`}
          onHide={(e) => setShowEdit(false)}
          onSuccess={() => {
            setShowEdit(false);
            getReport();
          }}
          dataSource={viewData}
          size="xl"
        />
      )}

      {markLongAbsent && (
        <MarkLongAbsentWindow
          show={markLongAbsent}
          student={viewData}
          onHide={(e) => setMarkLongAbsent(false)}
          onSuccess={(e) => setMarkLongAbsent(false)}
        />
      )}
    </>
  );
};

export default withRouter(Students);
