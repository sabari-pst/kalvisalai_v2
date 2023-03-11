import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import $ from "jquery";
import {
  Badge,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { momentDate, printDocument, upperCase } from "../../../../utils";
import { TABLE_STYLES } from "../../../../utils/data";

const PrintCategorySummary = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  const [dataList, setDataList] = useState(props.dataSourceList);
  const [dataView, setDataView] = useState(props.dataSource);
  const [categoryList, setCategoryList] = useState(props.categories);

  useEffect(() => {
    printDocument("category_summary_list_print");

    if (props.onSuccess) props.onSuccess();
  }, []);

  const getTotalByField = (fieldName) => {
    let total = 0;
    dataView.map(
      (item) =>
        item[0][fieldName] &&
        (total = parseFloat(total) + parseFloat(item[0][fieldName]))
    );
    return parseFloat(total).toFixed(2);
  };

  const getStudentsTotal = (studentsData) => {
    let total = 0;
    studentsData.map(
      (item) =>
        item.fee_amount &&
        (total = parseFloat(total) + parseFloat(item.fee_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  const categoryTotal = (categoryId) => {
    let m = dataList.filter((item) => item.fee_category_id == categoryId);
    let total = 0;
    m.map(
      (item) =>
        item.fee_amount &&
        (total = parseFloat(total) + parseFloat(item.fee_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  const categoryName = (cid) => {
    let x = props.categories.find((item) => item.id == cid);
    return x?.category_name;
  };

  const getInnerTd = (item) => {
    let m = dataList.filter((obj) => obj.student_uuid == item.student_uuid);
    let rv = [];
    m.map((obj, i) => {
      rv.push(
        <tr>
          <td colSpan={4}></td>
          <td colSpan={3} align="right">
            {categoryName(obj.fee_category_id)}
          </td>
          <td align="right">{obj.fee_amount}</td>
        </tr>
      );
    });
    return rv;
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <div id="category_summary_list_print">
          <table
            width="100%"
            align="center"
            className="font-bookman"
            style={TABLE_STYLES.table}
          >
            <thead>
              <tr>
                <th colSpan={10} align="center" height="30">
                  <b>{context.settingValue("billheader_name")}</b>
                  <br />
                  {context.settingValue("billheader_addresslineone") && (
                    <>
                      {context.settingValue("billheader_addresslineone")} <br />
                    </>
                  )}
                  {context.settingValue("billheader_addresslinetwo") && (
                    <>
                      {context.settingValue("billheader_addresslinetwo")} <br />
                    </>
                  )}
                </th>
              </tr>
              <tr>
                <th colSpan={5} align="left" height="30">
                  Day wise Collection Report
                </th>
                <th colSpan={5} align="right" height="30">
                  From : {momentDate(props.fromDate, "DD/MM/YYYY")} &emsp; To :{" "}
                  {momentDate(props.toDate, "DD/MM/YYYY")}
                </th>
              </tr>
            </thead>
          </table>
          <table
            width="100%"
            align="center"
            style={TABLE_STYLES.tableCollapse}
            className="font-bookman"
          >
            <thead style={{ fontSize: "12px" }}>
              <tr style={TABLE_STYLES.borderTopBottom}>
                <th
                  width="80"
                  align="center"
                  style={TABLE_STYLES.borderTopBottom}
                >
                  S.No
                </th>
                <th
                  align="left"
                  width="120"
                  style={TABLE_STYLES.borderTopBottom}
                >
                  Bill No
                </th>
                <th
                  align="left"
                  width="100"
                  style={TABLE_STYLES.borderTopBottom}
                >
                  Date
                </th>
                <th align="left" style={TABLE_STYLES.borderTopBottom}>
                  Reg.No
                </th>
                <th align="left" style={TABLE_STYLES.borderTopBottom}>
                  Student Name
                </th>
                <th align="left" style={TABLE_STYLES.borderTopBottom}>
                  Course
                </th>
                <th
                  align="center"
                  width="80"
                  style={TABLE_STYLES.borderTopBottom}
                >
                  Sem
                </th>
                <th
                  width="100"
                  align="right"
                  style={TABLE_STYLES.borderTopBottom}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {dataView.map((items, i) => {
                let item = items[0];
                return (
                  <>
                    <tr key={i}>
                      <td align="center" height="30">
                        {i + 1}
                      </td>
                      <td>{item.bill_no}</td>
                      <td align="left">
                        {momentDate(item.bill_date, "DD/MM/YYYY")}
                      </td>
                      <td align="left">
                        {item.registerno || item.admissionno}
                      </td>
                      <td align="left">{item.student_name}</td>
                      <td align="left">
                        {item.degree_name}
                        {item.course_short_name &&
                          ` - ${item.course_short_name} `}
                        {upperCase(item.course_type) == "SELF" ? "(SF)" : "(R)"}
                      </td>
                      <td align="center">{item.semester}</td>
                      <td align="right"></td>
                    </tr>
                    {getInnerTd(item)}
                    <tr>
                      <td colSpan={7}></td>
                      <td
                        align="right "
                        className="fw-bold"
                        height="25"
                        style={TABLE_STYLES.borderTopBottom}
                      >
                        <b>{getStudentsTotal(items)}</b>
                      </td>
                    </tr>
                  </>
                );
              })}
              <tr>
                <td colSpan={7} height="35" align="right">
                  Total
                </td>
                <td
                  align="right"
                  style={TABLE_STYLES.borderTopBottom}
                  height="25"
                >
                  <b>{getTotalByField("bill_amount")}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PrintCategorySummary;
