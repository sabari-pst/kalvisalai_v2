import { Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { CardFixedTop, momentDate, upperCase } from "../../../../utils";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";

const HostelBulkAdmission = (props) => {
  const [loader, setLoader] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [validated, setValidated] = useState(false);

  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (selectedCourse && selectedCourse.course_id) getReport();
  }, [selectedCourse]);

  const getReport = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
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

  const resetAll = () => {
    setSelectedCourse([]);
    setDataList([]);
    setDataView([]);
    setSelectedStudents([]);
  };

  const handleRowClick = (item) => {
    let s = [...selectedStudents];
    let exist = s.find((obj) => obj.uuid == item.uuid);
    if (exist) s = s.filter((obj) => obj.uuid != item.uuid);
    else
      s.push({
        uuid: item.uuid,
        batch: item.batch,
        semester: item.semester,
      });
    setSelectedStudents(s);
  };

  const existInSelectionList = (item) => {
    let s = [...selectedStudents];
    let exist = s.find((obj) => obj.uuid == item.uuid);
    return exist ? true : false;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (!window.confirm("Do you want to save ?")) return;
    setLoader(true);
    axios
      .post(ServiceUrl.STUDENTS.SAVE_BULK_HOSTEL_ADMISSION, new FormData(form))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          resetAll();
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const getTitle = () => {
    if (selectedCourse && selectedCourse.course_id) {
      return `Hostel Bulk Admission > ${selectedCourse.academic_year} > ${
        selectedCourse.course_name
      } > ${selectedCourse.semester} Sem > ${upperCase(
        selectedCourse.section
      )}`;
    }
    return "Hostel Bulk Admission";
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

      <div className="container py-3">
        {(!selectedCourse || !selectedCourse.course_id) && (
          <Row className="mt-2">
            <Col md={6}>
              <SelectRecords
                onSuccess={(d) => setSelectedCourse(d)}
                withSection
              />
            </Col>
          </Row>
        )}

        {selectedCourse.course_id && (
          <Spin spinning={loader}>
            <div
              className="tableFixHead bg-white ps-table"
              style={{ height: "calc(100vh - 150px)" }}
            >
              <table>
                <thead>
                  <tr>
                    <th width="50">#</th>
                    <th>Reg.No (or) Adm.No</th>
                    <th>Student Name</th>
                    <th>Gender</th>
                    <th>Father Name</th>
                  </tr>
                </thead>
                <tbody>
                  {dataView.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td align="center">
                          {item.is_hosteller == "0" && (
                            <input
                              type="checkbox"
                              onChange={(e) => handleRowClick(item)}
                              checked={existInSelectionList(item)}
                            />
                          )}
                          {item.is_hosteller == "1" && (
                            <span className="text-success fw-bold">
                              &#10004;
                            </span>
                          )}
                        </td>
                        <td>{item.registerno || item.admissionno}</td>
                        <td>
                          {item.name} {item.initial}
                        </td>
                        <td>{upperCase(item.gender)}</td>
                        <td>{item.fathername}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {selectedStudents.length > 0 && (
              <Form
                action=""
                method="post"
                noValidate
                validated={validated}
                onSubmit={handleFormSubmit}
              >
                <input
                  type="hidden"
                  name="students"
                  value={JSON.stringify(selectedStudents)}
                />
                <Row className="mt-3">
                  <Col md={2}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Selected Students</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={selectedStudents.length}
                        className="fw-bold"
                        required
                      />
                    </InputGroup>
                  </Col>
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Joining Date</InputGroup.Text>
                      <Form.Control
                        type="date"
                        name="joining_date"
                        max={momentDate(new Date(), "YYYY-MM-DD")}
                        className="fw-bold"
                        required
                      />
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <LoaderSubmitButton
                      type="submit"
                      loading={loader}
                      text="Save Selection "
                      className="w-100"
                    />
                  </Col>
                </Row>
              </Form>
            )}
          </Spin>
        )}
      </div>
    </>
  );
};

export default HostelBulkAdmission;
