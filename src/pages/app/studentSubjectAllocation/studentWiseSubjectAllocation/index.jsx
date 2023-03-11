import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Dropdown,
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import {
  CardFixedTop,
  groupByMultiple,
  printDocument,
  upperCase,
} from "../../../../utils";
import { DegreeType, TABLE_STYLES } from "../../../../utils/data";
import ModuleAccess from "../../../../context/moduleAccess";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import StudentWiseallocatedListPrint from "./studentWiseallocatedListPrint";
import EditAllocatedSubject from "./editAllocatedSubject";
import AddStudentSubject from "./addStudentSubject";

const StudentWiseSubjectAllocation = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [viewData, setViewData] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [studentsCount, setStudentsCount] = useState("");

  const [selectedCourse, setSelectedCourse] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState([]);

  const selectCourseSuccess = (co) => {
    setSelectedCourse(co);
  };

  useEffect(() => {
    if (selectedCourse.course_id) loadData();
  }, [selectedCourse]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    const form = new FormData();
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);

    axios.post(ServiceUrl.STUDENTS.STUDENTS_SUBJECT_LIST, form).then((res) => {
      if (res["data"].status == "1") {
        let m = groupByMultiple(res["data"].data, function (obj) {
          return [obj.student_uuid];
        });
        setDataList(res["data"].data);
        setDataView(m);
      }
      setLoader(false);
    });
  };

  const getTitle = () => {
    if (selectedCourse && selectedCourse.course_id) {
      return `Student Wise Subject Allocation > ${
        selectedCourse.academic_year
      } > ${selectedCourse.course_name} > ${
        selectedCourse.semester
      } Sem > ${upperCase(selectedCourse.section)}`;
    }
    return "Student Wise Subject Allocation";
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to remove?")) return;
    setLoader(true);
    const form = new FormData();
    form.append("student_uuid", item.student_uuid);
    form.append("semester", item.semester);
    form.append("subject_id", item.subject_id);
    form.append("subject_part_type", item.subject_part_type);
    form.append("id", item.id);
    axios.post(ServiceUrl.STUDENTS.DELETE_STUDENT_SUBJECT, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        let dv = [...dataList];
        dv = dv.filter((obj) => obj !== item);
        let m = groupByMultiple(dv, function (obj) {
          return [obj.student_uuid];
        });
        setDataList(dv);
        setDataView(m);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleEdit = (item) => {
    setViewData(item);
    setShowEdit(true);
  };

  const resetAll = () => {
    setDataList([]);
    setDataView([]);
    setStudentsCount("");
    setSelectedCourse([]);
    setSelectedStudent([]);
  };

  const checkSelected = (item) => {
    let m = selectedStudent.find((obj) => obj.id == item.id);
    return m ? true : false;
  };

  const handleSelectChange = (item) => {
    let m = [...selectedStudent];
    let exist = m.find((obj) => obj.id == item.id);

    if (exist) {
      m = m.filter((obj) => obj.id != item.id);
    } else {
      m.push({ id: item.id });
    }
    setSelectedStudent(m);
  };

  const innerRow = (items) => {
    return items.map((item, i) => {
      return (
        <tr>
          <td align="center">
            <input
              type="checkbox"
              checked={checkSelected(item)}
              onClick={(e) => handleSelectChange(item)}
            />
          </td>
          <td>Part-{item.subject_part_type}</td>
          <td>{upperCase(item.subject_code)}</td>
          <td>{upperCase(item.subject_name)}</td>
          <td>{upperCase(item.subject_type)}</td>
          <td align="center">
            <ModuleAccess
              module={"student_sub_alloc_bystudent"}
              action={"action_update"}
            >
              <Button
                size="sm"
                variant="transparent"
                onClick={(e) => handleEdit(item)}
              >
                <i className="fa-solid fa-edit fs-7"></i>
              </Button>
            </ModuleAccess>
            <ModuleAccess
              module={"student_sub_alloc_bystudent"}
              action={"action_delete"}
            >
              <Button
                size="sm"
                variant="transparent"
                onClick={(e) => handleDelete(item)}
              >
                <i className="fa-solid fa-trash-can fs-7"></i>
              </Button>
            </ModuleAccess>
          </td>
        </tr>
      );
    });
  };

  const handleAddClick = (item) => {
    setViewData(item);
    setShowAdd(true);
  };

  const handleDeleteSelectedSubject = () => {
    if (selectedStudent.length < 1) {
      toast.error("Please select records to delete");
      return;
    }
    if (!window.confirm("Do you want to delete ?")) return;
    setLoader(true);

    const form = new FormData();
    form.append("subject_uid", JSON.stringify(selectedStudent));
    axios
      .post(ServiceUrl.STUDENTS.DELETE_ALLOCATED_SUBJECTS, form)
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          loadData();
          setSelectedStudent([]);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          <ModuleAccess
            module={"student_sub_alloc_bystudent"}
            action={"action_create"}
          >
            <li className="list-inline-item">
              <Link
                to="/app/stu-subject/bulk-allocation"
                className="btn btn-transparent border-start"
              >
                <i className="fa fa-plus fs-5 px-1"></i> Bulk Allocation
              </Link>
            </li>
          </ModuleAccess>
          <ModuleAccess
            module={"student_sub_alloc_bystudent"}
            action={"action_delete"}
          >
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start"
                onClick={(e) => handleDeleteSelectedSubject()}
                disabled={selectedStudent.length < 1}
              >
                <i className="fa fa-trash fs-5 px-1"></i>
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start"
              onClick={(e) => setShowPrint(true)}
              disabled={dataList.length < 1}
            >
              <i className="fa fa-print fs-5 px-1"></i> Print
            </Button>
          </li>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start "
              onClick={(e) => resetAll()}
              disabled={!selectedCourse.course_id}
            >
              <i className="fa fa-xmark fs-5 px-1"></i> Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container">
        {(!selectedCourse || !selectedCourse.course_id) && (
          <Row className="mt-2">
            <ModuleAccess
              module={"student_sub_alloc_bystudent"}
              action={"action_list"}
            >
              <Col md={6}>
                <SelectRecords onSuccess={selectCourseSuccess} withSection />
              </Col>
            </ModuleAccess>
          </Row>
        )}

        {selectedCourse && selectedCourse.course_id && (
          <div className="mt-3">
            <Spin spinning={loader}>
              <Card>
                <Card.Body>
                  <div
                    className="tableFixHead ps-table "
                    style={{ minHeight: "calc(100vh - 250px)" }}
                  >
                    <table width="100%">
                      <thead>
                        <tr>
                          <th width="60">S.No</th>
                          <th width="120">Type</th>
                          <th>Subject Code</th>
                          <th>Subject Name</th>
                          <th width="90">Nature</th>
                          <th width="80">Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataView.map((item, i) => {
                          return (
                            <>
                              <tr key={i} className="bg-yellow-50">
                                <td align="center">{i + 1}</td>
                                <td>
                                  <b>{item[0].registerno || item[0].rollno}</b>
                                </td>
                                <td colSpan={3}>
                                  <b>{item[0].name}</b>
                                </td>
                                <td align="center">
                                  <ModuleAccess
                                    module={"student_sub_alloc_bystudent"}
                                    action={"action_create"}
                                  >
                                    <Button
                                      size="sm"
                                      variant="transparent"
                                      onClick={(e) => handleAddClick(item)}
                                    >
                                      <i className="fa-solid fa-plus fs-7"></i>
                                    </Button>
                                  </ModuleAccess>
                                </td>
                              </tr>
                              {innerRow(item)}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Spin>
          </div>
        )}
      </div>
      {showPrint && (
        <StudentWiseallocatedListPrint
          dataSource={dataList}
          title={`Subject List for ${upperCase(
            selectedCourse.course_name
          )} - Batch : ${selectedCourse.academic_year} / Sem ${
            selectedCourse.semester
          }`}
          onSuccess={(e) => setShowPrint(false)}
        />
      )}

      {showEdit && (
        <EditAllocatedSubject
          title="Update Student Subject"
          size="md"
          show={showEdit}
          onHide={(e) => setShowEdit(false)}
          dataSource={viewData}
          onSuccess={(e) => {
            setShowEdit(false);
            loadData();
          }}
        />
      )}

      {showAdd && (
        <AddStudentSubject
          title="Add Student Subject"
          size="md"
          show={showAdd}
          onHide={(e) => setShowAdd(false)}
          dataSource={viewData}
          onSuccess={(e) => {
            setShowAdd(false);
            setViewData([]);
            loadData();
          }}
        />
      )}
    </>
  );
};

export default withRouter(StudentWiseSubjectAllocation);
