import React, { useContext, useEffect, useState } from "react";

import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import axios from "axios";
import PsContext from "../../../../context";
import { CardFixedTop, semesterValue, upperCase } from "../../../../utils";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";

import AttendanceDayWiseEditor from "../studentAttendanceEntry/attendanceDayWiseEditor";

const EditStudentAttendanceEntry = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState([]);

  const resetAll = () => {
    setSelectedCourse([]);
  };

  const getTitle = () => {
    if (!selectedCourse.course_id) return "Edit Attendance";
    return `Edit Attendance - ${selectedCourse.course_name} / ${
      selectedCourse.academic_year
    } / ${upperCase(selectedCourse.section)} / ${semesterValue(
      selectedCourse.semester
    )} `;
  };

  return (
    <div>
      <CardFixedTop title={getTitle()}>
        <ul className="list-inline mb-0">
          <li className="list-inline-item border-start">
            <Button
              size="sm"
              type="button"
              variant="transparent"
              className="fs-6 "
              onClick={(e) => resetAll()}
            >
              <i className="fa-solid fa-xmark me-2"></i>Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>
      <div className="container py-2">
        {!selectedCourse.course_id && (
          <Row>
            <Col md={6}>
              <SelectRecords
                onSuccess={(co) => setSelectedCourse(co)}
                withSection={true}
              />
            </Col>
          </Row>
        )}
        {selectedCourse.course_id && (
          <div>
            <AttendanceDayWiseEditor
              selectedCourse={selectedCourse}
              allowAdd={false}
              allowEdit={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default EditStudentAttendanceEntry;
