import React, { useContext, useRef, useState } from "react";
import { CardFixedTop } from "../../../utils";
import PsContext from "../../../context";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import ImportBox from "./importBox";
import ModuleAccess from "../../../context/moduleAccess";
import CourseDetails from "./courseDetails";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../utils/serviceUrl";
import { toast } from "react-hot-toast";

const StudentsImport = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [dataList, setDataList] = useState([]);

  const btnRef = useRef(null);

  const resetAll = () => {
    setDataList([]);
    setLoader(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!window.confirm("Do you want to upload?")) return;
    setLoader(true);
    axios
      .post(ServiceUrl.STUDENTS.IMPORT_STUDENT, new FormData(form))
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

  const onFileSelect = (data) => {
    setDataList(data);
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to delete ?")) return;
    let s = dataList.filter(
      (obj) =>
        obj.admissionno != item.admissionno && obj.registerno != item.registerno
    );
    setDataList(s);
  };

  return (
    <div>
      <CardFixedTop title="Import Students">
        <ul className="list-inline mb-0">
          <ModuleAccess module="student_bulk_import" action="action_create">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                disabled={loader || dataList.length < 1}
                onClick={(e) => btnRef.current.click()}
              >
                <i className="fa-solid fa-upload fs-5 px-1"></i> Upload Students
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={(e) => resetAll()}
              disabled={loader}
            >
              <i className="fa-solid fa-xmark fs-5 px-1"></i> Reset
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container py-3">
        <Spin spinning={loader}>
          {dataList.length < 1 && (
            <Row>
              <Col md={5}>
                <ImportBox onDataSuccess={(d) => onFileSelect(d)} />
              </Col>
            </Row>
          )}

          {dataList.length > 0 && (
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <div>
                <CourseDetails />
                <input
                  type="hidden"
                  name="students"
                  value={JSON.stringify(dataList)}
                />
                <div className="tableFixHead ps-table">
                  <table>
                    <thead>
                      <tr>
                        <th width="50">#</th>
                        {Object.keys(dataList[0]).map((item, i) => {
                          return <th>{item}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {dataList.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td align="center">
                              <Button
                                type="button"
                                size="sm"
                                variant="white"
                                onClick={(e) => handleDelete(item)}
                              >
                                <i className="fa fa-trash-can"></i>
                              </Button>
                            </td>
                            {Object.keys(item).map((key, j) => {
                              return j == 0 ? (
                                <td>
                                  <input type="text" value={item[key]} />
                                </td>
                              ) : (
                                <td>{item[key]}</td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <Row className="mt-2">
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Total Records</InputGroup.Text>
                      <Form.Control
                        size="sm"
                        className="fw-bold"
                        value={dataList.length}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={9}>
                    <div className="text-end">
                      <ModuleAccess
                        module="student_bulk_import"
                        action="action_create"
                      >
                        <Button
                          variant="primary"
                          type="submit"
                          ref={btnRef}
                          disabled={loader || dataList.length < 1}
                        >
                          <i className="fa-solid fa-upload fs-5 px-1"></i>{" "}
                          Upload Students
                        </Button>
                      </ModuleAccess>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default StudentsImport;
