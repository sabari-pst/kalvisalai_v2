import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import { Spin, Tabs } from "antd";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import { listAcademicYears } from "../../../../models/academicYears";
import { formToObject, groupByMultiple, upperCase } from "../../../../utils";
import { listAllCourses } from "../../../../models/courses";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import axios from "axios";

const SearchByStudentName = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [name, setName] = useState("");

  useEffect(() => {
    if (name.length > 3) loadData();
  }, [name]);

  const loadData = () => {
    setLoader(true);
    axios
      .get(ServiceUrl.STUDENTS.SEARCH_BY_NAME + "?name=" + name)
      .then((res) => {
        if (res["data"].status == "1") {
          setDataList(res["data"].data);
        } else {
          setDataList([]);
        }
      });
  };

  const handleSelectClick = (item) => {
    if (props.onSuccess) props.onSuccess(item);
  };

  return (
    <>
      <Row>
        <Col md={12}>
          <InputGroup size="sm">
            <InputGroup.Text>
              <i className="fa-solid fa-magnifying-glass"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by Student Name..."
              onChange={(e) => setName(e.target.value)}
              autoFocus={true}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={12}>
          <div className="tableFixHead">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Reg.No</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th width="80">Sem</th>
                  <th width="80">#</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((item, i) => {
                  return (
                    <tr
                      key={i}
                      className={
                        item.isleft == "1" ? "bg-red-50 text-danger" : ""
                      }
                    >
                      <td>{item.name}</td>
                      <td>{item.registerno || item.admissiono}</td>
                      <td>
                        {item.degree_name} - {item.course_name} (
                        {upperCase(item.course_type) == "SELF" ? "SF" : "R"})
                      </td>
                      <td>{item.batch}</td>
                      <td>{item.semester}</td>
                      <td>
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          onClick={(e) => handleSelectClick(item)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SearchByStudentName;
