import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import { Row, Col, Card, Form, Button, Dropdown } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import {
  CardFixedTop,
  printDocument,
  upperCase,
  yearBySem,
} from "../../../../utils";
import { DegreeType, TABLE_STYLES } from "../../../../utils/data";
import ModuleAccess from "../../../../context/moduleAccess";
import {
  calculateAge,
  customSorting,
  groupByMultiple,
} from "../../../../utils";

import { useExcelDownloder } from "react-xls";

const StudentStrength = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const { ExcelDownloder, Type } = useExcelDownloder();

  const [loader1, setLoader1] = useState(false);
  const [dataList1, setDataList1] = useState([]);
  const [dataView1, setDataView1] = useState([]);

  const [courseTypeList, setCourseTypeList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader1(true);
    setDataList1([]);
    setDataView1([]);

    axios.post(ServiceUrl.STUDENTS.STUDENT_STRENGTH).then((res) => {
      //console.log(res);
      if (res["data"].status == "1") {
        let d = res["data"].data;

        let x = groupByMultiple(d, function (obj) {
          return [obj.semester, obj.academic_dept_type];
        });

        let ct = groupByMultiple(d, function (obj) {
          return [obj.academic_dept_type];
        });

        setCourseTypeList(ct);
        setDataList1(d);
        setDataView1(x);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader1(false);
    });
  };

  const countByGender = (items, gender) => {
    let item = items.find((obj) => upperCase(obj.gender) == upperCase(gender));

    return item?.count || "0";
  };

  const genderTotal = (items) => {
    let total = 0;
    items.map((item) => (total = parseFloat(item.count) + parseFloat(total)));
    return parseFloat(total).toFixed(0);
  };

  const totalCount = (items, gender = false) => {
    let total = 0;
    if (gender)
      items = items.filter(
        (item) => upperCase(item.gender) == upperCase(gender)
      );
    items.map((item) => (total = parseFloat(item.count) + parseFloat(total)));
    return parseFloat(total).toFixed(0);
  };

  const courseRows = (items) => {
    items = groupByMultiple(items, function (obj) {
      return [obj.course_id];
    });
    //console.log(items);

    return items.map((item, i) => {
      return (
        <tr style={TABLE_STYLES.borderAll} key={item[0].semester}>
          <td align="center" style={TABLE_STYLES.borderAll}>
            {i + 1}
          </td>
          <td style={TABLE_STYLES.borderAll}>
            {upperCase(item[0].degreename)} {upperCase(item[0].course_name)} (
            {upperCase(item[0].coursetype) == "SELF" ? "SF" : "R"}) {}{" "}
          </td>
          <td align="center" style={TABLE_STYLES.borderAll}>
            {item[0].semester}
          </td>
          <td align="center" style={TABLE_STYLES.borderAll}>
            {countByGender(item, "male")}
          </td>
          <td align="center" style={TABLE_STYLES.borderAll}>
            {countByGender(item, "female")}
          </td>
          <td align="center" style={TABLE_STYLES.borderAll}>
            {genderTotal(item)}
          </td>
        </tr>
      );
    });
  };

  const filterSemData = (sem1, sem2, gender) => {
    return dataList1.filter(
      (item) =>
        (item.semester == sem1 || item.semester == sem2) &&
        upperCase(item.gender) == upperCase(gender)
    );
  };

  const yearWiseCountBygender = (year, gender) => {
    let d = dataList1;
    let m = [];
    if (year == "1") {
      m = filterSemData(1, 2, gender);
    } else if (year == "2") {
      m = filterSemData(3, 4, gender);
    } else if (year == "3") {
      m = filterSemData(5, 6, gender);
    }
    return genderTotal(m, gender);
  };

  return (
    <>
      <CardFixedTop title="Class Wise Students Count">
        <ul className="list-inline mb-0">
          <ModuleAccess
            module="students_reports_strength"
            action="action_print"
          >
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={() => printDocument("stu_strength_print")}
              >
                <i className="fa fa-print fs-5 px-1"></i> Print
              </Button>
            </li>
          </ModuleAccess>

          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={loadData}
            >
              <i className="fa fa-refresh fs-5 px-1"></i> Reload
            </Button>
          </li>
        </ul>
      </CardFixedTop>
      <Spin spinning={loader1}>
        <Row className="mt-4">
          <Col md={{ offset: 1, span: 10 }}>
            <div className="page_a4">
              <Card>
                <Card.Body>
                  <div id="stu_strength_print">
                    <table
                      width="100%"
                      style={TABLE_STYLES.tableCollapse}
                      className="font-bookman"
                    >
                      <thead>
                        <tr>
                          <th
                            className="center"
                            colSpan={11}
                            height="30"
                            style={{ textAlign: "center" }}
                          >
                            <b>{context.settingValue("billheader_name")}</b>
                            <br />
                            {context.settingValue(
                              "billheader_addresslineone"
                            ) && (
                              <>
                                {context.settingValue(
                                  "billheader_addresslineone"
                                )}{" "}
                                <br />
                              </>
                            )}
                            {context.settingValue(
                              "billheader_addresslinetwo"
                            ) && (
                              <>
                                {context.settingValue(
                                  "billheader_addresslinetwo"
                                )}{" "}
                                <br />
                              </>
                            )}
                          </th>
                        </tr>
                        <tr style={TABLE_STYLES.trHideborderAll}>
                          <th
                            colSpan={5}
                            style={TABLE_STYLES.borderAll}
                            align="center"
                          >
                            <center>
                              <h5>
                                <b>
                                  {context.settingValue("print_header_name")}
                                </b>
                              </h5>
                            </center>
                          </th>
                        </tr>
                        <tr style={TABLE_STYLES.borderAllHead}>
                          <th width="60" style={TABLE_STYLES.borderAllHead}>
                            S.No
                          </th>
                          <th style={TABLE_STYLES.borderAllHead}>
                            Course Name
                          </th>
                          <th width="60" style={TABLE_STYLES.borderAllHead}>
                            Sem
                          </th>
                          <th width="80" style={TABLE_STYLES.borderAllHead}>
                            Male
                          </th>
                          <th width="80" style={TABLE_STYLES.borderAllHead}>
                            Female
                          </th>
                          <th width="120" style={TABLE_STYLES.borderAllHead}>
                            Total
                          </th>
                        </tr>
                      </thead>

                      <tbody style={{ fontSize: "12px" }}>
                        {dataView1.map((item, i) => {
                          return (
                            <>
                              <tr style={TABLE_STYLES.borderAll}>
                                <td
                                  align="center"
                                  colSpan={6}
                                  style={TABLE_STYLES.borderAll}
                                >
                                  <b>
                                    <i>
                                      {upperCase(item[0].academic_dept_type)} -{" "}
                                      {yearBySem(item[0].semester)}
                                    </i>
                                  </b>
                                </td>
                              </tr>
                              {courseRows(item)}
                              <tr style={TABLE_STYLES.borderAll}>
                                <td style={TABLE_STYLES.borderAll}></td>
                                <td
                                  style={TABLE_STYLES.borderAll}
                                  align="right"
                                  colSpan={2}
                                >
                                  Total{" "}
                                </td>
                                <td
                                  style={TABLE_STYLES.borderAll}
                                  align="center"
                                >
                                  {totalCount(item, "male")}
                                </td>
                                <td
                                  style={TABLE_STYLES.borderAll}
                                  align="center"
                                >
                                  {totalCount(item, "female")}
                                </td>
                                <td
                                  style={TABLE_STYLES.borderAll}
                                  align="center"
                                >
                                  {totalCount(item)}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={{ offset: 1, span: 10 }}>
            <div className="page_a4">
              <Card>
                <Card.Body>
                  <div id="stu_strength_print_year">
                    <table width="100%" style={TABLE_STYLES.tableCollapse}>
                      <thead>
                        <tr>
                          <th
                            className="center"
                            colSpan={11}
                            height="30"
                            style={{ textAlign: "center" }}
                          >
                            <b>{context.settingValue("billheader_name")}</b>
                            <br />
                            {context.settingValue(
                              "billheader_addresslineone"
                            ) && (
                              <>
                                {context.settingValue(
                                  "billheader_addresslineone"
                                )}{" "}
                                <br />
                              </>
                            )}
                            {context.settingValue(
                              "billheader_addresslinetwo"
                            ) && (
                              <>
                                {context.settingValue(
                                  "billheader_addresslinetwo"
                                )}{" "}
                                <br />
                              </>
                            )}
                          </th>
                        </tr>
                        <tr style={TABLE_STYLES.trHideborderAll}>
                          <th
                            colSpan={5}
                            style={TABLE_STYLES.borderAll}
                            align="center"
                          >
                            <center>
                              <h5>
                                <b>
                                  {context.settingValue("print_header_name")}
                                </b>
                              </h5>
                            </center>
                          </th>
                        </tr>
                        <tr style={TABLE_STYLES.borderAllHead}>
                          <th width="60" style={TABLE_STYLES.borderAllHead}>
                            S.No
                          </th>
                          <th width="" style={TABLE_STYLES.borderAllHead}>
                            Year
                          </th>
                          <th width="80" style={TABLE_STYLES.borderAllHead}>
                            Male
                          </th>
                          <th width="80" style={TABLE_STYLES.borderAllHead}>
                            Female
                          </th>
                          <th width="80" style={TABLE_STYLES.borderAllHead}>
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={TABLE_STYLES.borderAll}>
                          <td style={TABLE_STYLES.borderAll}>1</td>
                          <td style={TABLE_STYLES.borderAll}>I-Year</td>
                          <td style={TABLE_STYLES.borderAll}>
                            {yearWiseCountBygender(1, "male")}
                          </td>
                          <td style={TABLE_STYLES.borderAll}>
                            {yearWiseCountBygender(1, "female")}
                          </td>
                          <td style={TABLE_STYLES.borderAll}></td>
                        </tr>
                        <tr style={TABLE_STYLES.borderAll}>
                          <td style={TABLE_STYLES.borderAll}>2</td>
                          <td style={TABLE_STYLES.borderAll}>II-Year</td>
                          <td style={TABLE_STYLES.borderAll}>
                            {yearWiseCountBygender(2, "male")}
                          </td>
                          <td style={TABLE_STYLES.borderAll}>
                            {yearWiseCountBygender(2, "female")}
                          </td>
                          <td style={TABLE_STYLES.borderAll}></td>
                        </tr>
                        <tr>
                          <td style={TABLE_STYLES.borderAll}>3</td>
                          <td style={TABLE_STYLES.borderAll}>III-Year</td>
                          <td style={TABLE_STYLES.borderAll}>
                            {yearWiseCountBygender(3, "male")}
                          </td>
                          <td style={TABLE_STYLES.borderAll}>
                            {yearWiseCountBygender(3, "female")}
                          </td>
                          <td style={TABLE_STYLES.borderAll}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default withRouter(StudentStrength);
