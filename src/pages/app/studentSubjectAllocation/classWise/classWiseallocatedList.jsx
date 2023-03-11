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
import ClassWiseallocatedListPrint from "./classWiseallocatedListPrint";

const ClassWiseallocatedList = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [showPrint, setShowPrint] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [studentsCount, setStudentsCount] = useState("");

  const [selectedCourse, setSelectedCourse] = useState([]);

  const selectCourseSuccess = (co) => {
    setSelectedCourse(co);
  };

  useEffect(() => {
    if (selectedCourse.academic_year) loadData();
  }, [selectedCourse]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    const form = new FormData();
    form.append("degree_type", selectedCourse.course_type);
    form.append("batch", selectedCourse.academic_year);
    form.append("course", selectedCourse.course_id);
    form.append("semester", selectedCourse.semester);
    form.append("section", selectedCourse.section);
    form.append("program_type", selectedCourse.program_type);

    axios
      .post(ServiceUrl.STUDENTS.ALLOCATED_CLASS_WISE_SUBJECTS, form)
      .then((res) => {
        if (res["data"].status == "1") {
          setDataList(res["data"].data);
          let m = groupByMultiple(res["data"].data, function (obj) {
            return [obj.course_id];
          });
          setDataView(m);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const getTitle = () => {
    if (selectedCourse && selectedCourse.academic_year) {
      return `Class Wise Subject Allocated > ${
        selectedCourse.academic_year
      } > ${selectedCourse.course_name} > ${
        selectedCourse.semester
      } Sem > ${upperCase(selectedCourse.section)}`;
    }
    return "Class Wise Subject Allocated";
  };

  const resetAll = () => {
    setDataList([]);
    setDataView([]);
    setStudentsCount("");
    setSelectedCourse([]);
  };

  const getInnerRow = (items) => {
    return items.map((item, i) => {
      return (
        <tr>
          <td>Part-{item.subject_part_type}</td>
          <td>{upperCase(item.subject_code)}</td>
          <td>{upperCase(item.subject_name)}</td>
          <td>{item.subject_type}</td>
        </tr>
      );
    });
  };

  return (
    <>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          <ModuleAccess
            module={"student_sub_alloc_byclass"}
            action={"action_create"}
          >
            <li className="list-inline-item">
              <Link
                to="/app/stu-subjects/classwise-allocation-new"
                className="btn btn-white border-start ms-2"
              >
                <i className="fa fa-plus fs-5 px-1"></i> New
              </Link>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={(e) => setShowPrint(true)}
              disabled={dataList.length < 1}
            >
              <i className="fa fa-print fs-5 px-1"></i> Print
            </Button>
          </li>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={(e) => resetAll()}
              disabled={!selectedCourse.academic_year}
            >
              <i className="fa fa-xmark fs-5 px-1"></i> Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container">
        {(!selectedCourse || !selectedCourse.academic_year) && (
          <Row className="mt-2">
            <ModuleAccess
              module={"student_sub_alloc_byclass"}
              action={"action_list"}
            >
              <Col md={6}>
                <SelectRecords
                  onSuccess={selectCourseSuccess}
                  wihtOutProgram={true}
                  withProgramType={true}
                />
              </Col>
            </ModuleAccess>
          </Row>
        )}

        {selectedCourse && selectedCourse.academic_year && (
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
                          <th width="90">Type</th>
                          <th>Subject Code</th>
                          <th>Subject Name</th>
                          <th width="120">Nature</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataView.map((item, i) => {
                          return (
                            <>
                              <tr key={i} className="bg-light">
                                <td colSpan={4} className="fw-bold">
                                  {item[0].degree_name} {item[0].course_name}{" "}
                                  {item[0].coursetype == "regular"
                                    ? "(R)"
                                    : "(SF)"}
                                </td>
                              </tr>
                              {getInnerRow(item)}
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
        <ClassWiseallocatedListPrint
          dataSource={dataList}
          title={`Subject List for ${upperCase(
            selectedCourse.course_type
          )} - ${upperCase(selectedCourse.program_type)} - Batch : ${
            selectedCourse.academic_year
          } / Sem ${selectedCourse.semester}`}
          onSuccess={(e) => setShowPrint(false)}
        />
      )}
    </>
  );
};

export default withRouter(ClassWiseallocatedList);
