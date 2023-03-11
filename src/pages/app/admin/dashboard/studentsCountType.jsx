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

const StudentsCountType = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [dataGroup, setDataGroup] = useState([]);

  const [type, setType] = useState("all");

  useEffect(() => {
    loadData();
  }, [props.dataSource]);

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
    } else {
      let x = groupByMultiple(dataList, function (obj) {
        return [obj.academic_dept_type];
      });
      setDataGroup(x);
    }
    setDataView(m);
  }, [type]);

  const loadData = () => {
    setDataList([]);
    setDataView([]);

    setDataList(props.dataSource);
    setDataView(props.dataSource);
    let m = customSorting(
      props.dataSource,
      COURSE_TYPE_SORT_ORDER,
      "academic_dept_type"
    );

    m = groupByMultiple(m, function (obj) {
      return [obj.academic_dept_type];
    });
    setDataGroup(m);
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

  const countByYearAndGender = (items, y, g) => {
    let gen = items.filter((obj) => upperCase(obj.gender) == upperCase(g));
    let count = 0;
    if (y == 1) {
      let s1 = gen.find((item) => item.semester == "1");
      let s2 = gen.find((item) => item.semester == "2");
      count = (s2 && s2.total) || (s1 && s1.total);
    } else if (y == 2) {
      let s1 = gen.find((item) => item.semester == "3");
      let s2 = gen.find((item) => item.semester == "4");
      count = (s2 && s2.total) || (s1 && s1.total);
    } else if (y == 3) {
      let s1 = gen.find((item) => item.semester == "5");
      let s2 = gen.find((item) => item.semester == "6");
      count = (s2 && s2.total) || (s1 && s1.total);
    }
    return count;
  };

  const totalByType = (type, g = false) => {
    let m = [];
    if (g)
      m = dataView.filter(
        (item) =>
          upperCase(item.academic_dept_type) == upperCase(type) &&
          upperCase(item.gender) == upperCase(g)
      );
    else
      m = dataView.filter(
        (item) => upperCase(item.academic_dept_type) == upperCase(type)
      );

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
      {dataGroup.map((items, i) => {
        return (
          <tr key={i}>
            <td>{upperCase(items[0].academic_dept_type)}</td>
            <td align="right">{countByYearAndGender(items, 1, "male")}</td>
            <td align="right">{countByYearAndGender(items, 1, "female")}</td>
            <td align="right">{countByYearAndGender(items, 2, "male")}</td>
            <td align="right">{countByYearAndGender(items, 2, "female")}</td>
            <td align="right">{countByYearAndGender(items, 3, "male")}</td>
            <td align="right">{countByYearAndGender(items, 3, "female")}</td>
            <td align="right">
              {totalByType(items[0].academic_dept_type, "male")}
            </td>
            <td align="right">
              {totalByType(items[0].academic_dept_type, "female")}
            </td>
            <td align="right">{totalByType(items[0].academic_dept_type)}</td>
          </tr>
        );
      })}
    </>
  );
};

export default withRouter(StudentsCountType);
