import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
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
  FormControl,
} from "react-bootstrap";
import toast from "react-hot-toast";
import PsContext from "../../../../context";
import {
  bulkReplace,
  capitalizeFirst,
  CardFixedTop,
  getFileLiveUrl,
  printDocument,
  upperCase,
  yearByBatch,
  yearBySem,
  momentDate,
} from "../../../../utils";

import axios from "axios";

import { ServiceUrl } from "../../../../utils/serviceUrl";
import SearchStudent from "../../feePayment/newFeePayment/searchStudent";
import { Spin } from "antd";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { getStudentTemplate } from "../../../../models/utilities";
import {
  CERTIFICATE_TEMPLATE_NAMES,
  MOB_ICONS,
  VENDOR_LOGO,
} from "../../../../utils/data";

const NewVerificationCertificate = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [checkValueData, setCheckValueData] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState([]);

  const [template, setTemplate] = useState([]);

  useEffect(() => {
    if (selectedCourse && selectedCourse.uuid) {
      loadTemplate();
      checkSemester(selectedCourse.uuid);
    }
  }, [selectedCourse]);

  useEffect(() => {
    setSelectedCourse(props.dataSource);
  }, [props.dataSource]);

  const loadTemplate = () => {
    setLoader(true);
    getStudentTemplate(CERTIFICATE_TEMPLATE_NAMES.STUDENT_VERIFICATION).then(
      (res) => {
        if (res) setTemplate(res);
        setLoader(false);
      }
    );
  };

  const resetAll = () => {
    setSelectedCourse([]);
    setTemplate([]);
    setLoader(false);
  };

  const field = (fieldName) => {
    if (template && template[fieldName]) return template[fieldName];
  };

  const studentField = (fieldName) => {
    if (selectedCourse && selectedCourse[fieldName])
      return selectedCourse[fieldName];
  };

  const getContent = () => {
    let ar = [];
    ar["{{billheader_name}}"] = context.settingValue("billheader_name");
    ar["{{billheader_city}}"] = context.settingValue("billheader_addresscity");
    ar["{{college_name}}"] = context.settingValue("billheader_name");
    ar["{{college_address}}"] = context.settingValue("billheader_addresscity");
    ar["{{college_place}}"] = context.settingValue("billheader_addresscity");
    ar["{{logo_path}}"] = VENDOR_LOGO;
    ar["{{student_name}}"] = upperCase(studentField("name"));
    ar["{{student_regno}}"] = upperCase(studentField("registerno"));
    ar["{{student_batch}}"] = upperCase(studentField("batch"));

    ar["{{degree_name}}"] = upperCase(studentField("degree_name"));
    ar["{{stu_duration}}"] =
      studentField("coursetype") == "UG"
        ? upperCase("3 years")
        : studentField("coursetype") == "PG"
        ? upperCase("2 years")
        : studentField("coursetype") == "Phd"
        ? upperCase("5 years")
        : "";
    ar["{{year_name}}"] = yearBySem(studentField("semester"), true);
    ar["{{course_name}}"] = upperCase(studentField("course_name"));
    ar["{{entry_date}}"] = momentDate(new Date(), "DD-MM-YYYY");
    ar["{{college_year}}"] = context.user.college_year;
    if (studentField("profile_photo"))
      ar["{{stu_img}}"] = getFileLiveUrl(studentField("profile_photo"));
    else ar["{{stu_img}}"] = MOB_ICONS.NO_PHOTO_256.default;

    let x = bulkReplace(
      field("certificate_content"),
      Object.keys(ar),
      Object.values(ar)
    );
    return x;
  };

  const handleSaveClick = () => {
    if (!window.confirm("Do you want to save?")) return;
    setLoader(true);
    const form = new FormData();
    form.append("student_uuid", selectedCourse.uuid);
    form.append("student_regno", selectedCourse.registerno);
    form.append("student_medium", selectedCourse.medium_of_instruction);
    form.append("batch", selectedCourse.batch);
    form.append("college_year", context.user.college_year);
    axios
      .post(ServiceUrl.STUDENTS.SAVE_VERIFY_CERTIFICATE, form)
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          printDocument("print_stu_medium");
          if (props.onSuccess) props.onSuccess();
          resetAll();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const checkSemester = () => {
    var form = new FormData();
    form.append("uuid", selectedCourse.uuid);
    axios
      .post(ServiceUrl.STUDENTS.LIST_VERIFY_CERTIFICATE, form)
      .then((res) => {
        if (res["data"].status == "1") {
          setCheckValueData(true);
          toast.success(res["data"].message);
        } else {
          toast.error(res["data"].message);
        }
      });
  };

  return (
    <>
      <div className="">
        <Spin spinning={loader}>
          {selectedCourse && selectedCourse.length < 1 && (
            <Row>
              <Col md={12}>
                <SearchStudent onSuccess={(dt, e) => setSelectedCourse(dt)} />
              </Col>
            </Row>
          )}
          {selectedCourse && selectedCourse.uuid && checkValueData === true && (
            <>
              <div id="print_stu_medium">
                <div
                  dangerouslySetInnerHTML={{
                    __html: getContent(),
                  }}
                />
              </div>

              <div className="mt-3 text-center">
                {(!props.dataSource || !props.dataSource.uuid) && (
                  <LoaderSubmitButton
                    type="text"
                    text={
                      <>
                        <i className="fa-sharp fa-solid fa-print px-2"></i> Save
                        & Print
                      </>
                    }
                    size="md"
                    onClick={(e) => handleSaveClick()}
                    loading={loader}
                  />
                )}

                {props.dataSource && props.dataSource.uuid && (
                  <Button
                    size=""
                    onClick={(e) => printDocument("print_stu_medium")}
                  >
                    <i className="fa-sharp fa-solid fa-print px-2"></i> Print
                  </Button>
                )}
              </div>
            </>
          )}
        </Spin>
      </div>
    </>
  );
};

export default NewVerificationCertificate;
