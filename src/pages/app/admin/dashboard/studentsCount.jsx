import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import PsContext from "../../../../context";
import { Badge, ButtonGroup, Card, ToggleButton } from "react-bootstrap";
import { Spin } from "antd";
import { NoDataFound } from "../../components";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import {
  calculateAge,
  customSorting,
  groupByMultiple,
  upperCase,
  yearBySem,
} from "../../../../utils";
import { COURSE_TYPE_SORT_ORDER } from "../../../../utils/data";
import StudentsCountType from "./studentsCountType";

const StudentsCount = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [dataGroup, setDataGroup] = useState([]);

  const [aided, setAided] = useState([]);
  const [unaided, setUnAided] = useState([]);

  const [type, setType] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let m = dataList;
    if (type != "all") {
      m = dataList.filter(
        (item) => upperCase(item.academic_dept_type) == upperCase(type)
      );
      let x = groupByMultiple(m, function (obj) {
        return [obj.academic_dept_type];
      });
      setDataGroup(x);
      let ai = dataList.filter(
        (item) =>
          upperCase(item.academic_dept_type) == upperCase(type) &&
          item.dept_type == "aided"
      );
      let uai = dataList.filter(
        (item) =>
          upperCase(item.academic_dept_type) == upperCase(type) &&
          item.dept_type == "unaided"
      );
      setAided(ai);
      setUnAided(uai);
    } else {
      let x = groupByMultiple(dataList, function (obj) {
        return [obj.academic_dept_type];
      });
      setDataGroup(x);
      let ai = dataList.filter((item) => item.dept_type == "aided");
      let uai = dataList.filter((item) => item.dept_type == "unaided");
      setAided(ai);
      setUnAided(uai);
    }
    setDataView(m);
  }, [type]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    axios.get(ServiceUrl.DASHBOARD.STUDENTS_COUNT + "?").then((res) => {
      if (res["data"].status == "1") {
        let x = res["data"].data.unaided.filter(
          (item) => item.dept_type == "aided"
        );
        let y = res["data"].data.unaided.filter(
          (item) => item.dept_type == "unaided"
        );
        setAided(x);
        setUnAided(y);
        setDataList(res["data"].data.unaided);
        setDataView(res["data"].data.unaided);
        let m = customSorting(
          res["data"].data.unaided,
          COURSE_TYPE_SORT_ORDER,
          "academic_dept_type"
        );

        m = groupByMultiple(m, function (obj) {
          return [obj.academic_dept_type];
        });
        setDataGroup(m);
      }
      setLoader(false);
    });
  };

  const getBtnGroup = () => {
    let m = customSorting(
      dataList,
      COURSE_TYPE_SORT_ORDER,
      "academic_dept_type"
    );
    m = groupByMultiple(m, function (obj) {
      return [obj.academic_dept_type];
    });

    return m.map((item) => (
      <ToggleButton
        size="sm"
        variant={
          type == item[0].academic_dept_type ? "secondary" : "outline-secondary"
        }
        onClick={(e) => setType(item[0].academic_dept_type)}
      >
        {upperCase(item[0].academic_dept_type)}
      </ToggleButton>
    ));
  };

  const countTotal = (items) => {
    let total = 0;
    items.map((item) => (total = parseFloat(total) + parseFloat(item.total)));
    return parseFloat(total).toFixed(0);
  };

  const countByYearAndGenderTotal = (y, g) => {
    let gen = dataView.filter((obj) => upperCase(obj.gender) == upperCase(g));
    let count = "";
    if (y == 1) {
      let s1 = gen.filter((item) => item.semester == "1");
      let s2 = gen.filter((item) => item.semester == "2");
      count = s2.length > 0 ? countTotal(s2) : countTotal(s1);
    } else if (y == 2) {
      let s1 = gen.filter((item) => item.semester == "3");
      let s2 = gen.filter((item) => item.semester == "4");
      count = s2.length > 0 ? countTotal(s2) : countTotal(s1);
    } else if (y == 3) {
      let s1 = gen.filter((item) => item.semester == "5");
      let s2 = gen.filter((item) => item.semester == "6");
      count = s2.length > 0 ? countTotal(s2) : countTotal(s1);
    }
    return count != 0 ? count : "";
  };

  const totalByGender = (g = false) => {
    let m = [];
    if (g)
      m = dataView.filter((item) => upperCase(item.gender) == upperCase(g));
    else m = dataView;

    let total = 0;
    let s1 = m.filter(
      (item) =>
        item.semester == "1" ||
        item.semester == "3" ||
        item.semester == "5" ||
        item.semester == "7" ||
        item.semester == "9"
    );
    let s2 = m.filter(
      (item) =>
        item.semester == "2" ||
        item.semester == "4" ||
        item.semester == "6" ||
        item.semester == "8" ||
        item.semester == "10"
    );
    if (s2.length > 0)
      s2.map((item) => (total = parseFloat(total) + parseFloat(item.total)));
    else s1.map((item) => (total = parseFloat(total) + parseFloat(item.total)));

    return total != 0 ? parseFloat(total).toFixed(0) : "";
  };

  const grandTotal = () => {
    let total = 0;
    dataView.map(
      (item) => (total = parseFloat(total) + parseFloat(item.total))
    );
    return parseFloat(total).toFixed(0);
  };

  return (
    <>
      <Card>
        <Card.Header className="fw-bold">
          Students Count
          <div className="float-end">
            <ButtonGroup>
              <ToggleButton
                size="sm"
                variant={type == "all" ? "secondary" : "outline-secondary"}
                onClick={(e) => setType("all")}
              >
                All
              </ToggleButton>
              {getBtnGroup()}
            </ButtonGroup>
          </div>
        </Card.Header>
        <Card.Body>
          <Spin spinning={loader}>
            <div className="tableFixHead" style={{ height: "260px" }}>
              <table className="table-sm">
                <tbody>
                  <tr className="bg-silver-100">
                    <td width="70" rowSpan={2}>
                      Type
                    </td>
                    <td colSpan={2} align="center">
                      I-Year
                    </td>
                    <td colSpan={2} align="center">
                      II-Year
                    </td>
                    <td colSpan={2} align="center">
                      III-Year
                    </td>
                    <td colSpan={2} align="center">
                      Total
                    </td>
                    <td rowSpan={2} align="center">
                      #
                    </td>
                  </tr>
                  <tr className="bg-silver-100">
                    <td align="center">M</td>
                    <td align="center">F</td>
                    <td align="center">M</td>
                    <td align="center">F</td>
                    <td align="center">M</td>
                    <td align="center">F</td>
                    <td align="center">M</td>
                    <td align="center">F</td>
                  </tr>
                  <tr className="bg-light">
                    <td colSpan={10}>AIDED</td>
                  </tr>
                  <StudentsCountType dataSource={aided} />
                  <tr className="bg-light">
                    <td colSpan={10}>UN-AIDED</td>
                  </tr>
                  <StudentsCountType dataSource={unaided} />
                  <tr className="bg-silver-50">
                    <td>Total</td>
                    <td align="right">
                      {countByYearAndGenderTotal(1, "male")}
                    </td>
                    <td align="right">
                      {countByYearAndGenderTotal(1, "female")}
                    </td>
                    <td align="right">
                      {countByYearAndGenderTotal(2, "male")}
                    </td>
                    <td align="right">
                      {countByYearAndGenderTotal(2, "female")}
                    </td>
                    <td align="right">
                      {countByYearAndGenderTotal(3, "male")}
                    </td>
                    <td align="right">
                      {countByYearAndGenderTotal(3, "female")}
                    </td>
                    <td align="right">{totalByGender("male")}</td>
                    <td align="right">{totalByGender("female")}</td>
                    <td align="right">{totalByGender()}</td>
                  </tr>
                </tbody>
              </table>
              {!loader && dataList.length < 1 && (
                <center>
                  <NoDataFound />
                </center>
              )}
            </div>
          </Spin>
        </Card.Body>
      </Card>
    </>
  );
};

export default withRouter(StudentsCount);
