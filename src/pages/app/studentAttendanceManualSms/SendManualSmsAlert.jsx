import React, { useState, useEffect, useContext, useCallback } from "react";

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

import PsContext from "../../../context";

import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../utils/serviceUrl";

import SelectRecords from "../feeAssigning/classWiseFeeAssigning/selectRecords";

const SendManualSmsAlert = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState([]);
  const [totalCount, setTotalCount] = useState("0");

  const selectCourseSuccess = (co) => {
    setSelectedCourse(co);
  };

  useEffect(() => {
    if (selectedCourse.course_type) loadData();
  }, [selectedCourse]);

  const loadData = () => {
    setLoader(true);
    setTotalCount("0");
    const form = new FormData();
    form.append("course_type", selectedCourse.course_type);
    form.append("program_type", selectedCourse.program_type);

    axios
      .post(ServiceUrl.STUDENTS.TODAY_FULL_ABSENT_COUNT, form)
      .then((res) => {
        if (res["data"].status == "1") {
          setTotalCount(res["data"].data);
        } else {
          toast.error(res["data"].message || "Error");
          setSelectedCourse([]);
          setTotalCount(0);
        }
        setLoader(false);
      });
  };

  const sendSmsClick = () => {
    if (!window.confirm("Do you want to send sms?")) return;
    setLoader(true);

    const form = new FormData();
    form.append("course_type", selectedCourse.course_type);
    form.append("program_type", selectedCourse.program_type);

    axios
      .post(ServiceUrl.STUDENTS.SEND_SMS_ABSENTES_MANUALLY, form)
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Sent");
          setTotalCount(res["data"].data);
          setSelectedCourse([]);
          setTotalCount(0);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <>
      <Spin spinning={loader}>
        {!selectedCourse.course_type && (
          <Row className="mt-2">
            <Col md={12}>
              <SelectRecords
                withSemester={false}
                withProgramType={true}
                wihtOutProgram={true}
                wihtOutBatch={true}
                onSuccess={selectCourseSuccess}
              />
            </Col>
          </Row>
        )}

        {selectedCourse.course_type && (
          <div style={{ minHeight: "150px" }}>
            <Row>
              <Col md={5}>
                <label>Total Absent count</label>
              </Col>
              <Col md={7}>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold"
                  value={totalCount}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={5}></Col>
              <Col md={3}>
                <Button
                  type="button"
                  variant="danger"
                  onClick={(e) => {
                    setSelectedCourse([]);
                    setTotalCount(0);
                  }}
                >
                  <i className="fa fa-xmark px-1 me-2"></i> Cancel
                </Button>
              </Col>
              <Col md={4}>
                <div className="text-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={(e) => sendSmsClick()}
                  >
                    <i className="fa-regular fa-paper-plane px-1 me-2"></i>Send
                    SMS
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Spin>
    </>
  );
};

export default SendManualSmsAlert;
