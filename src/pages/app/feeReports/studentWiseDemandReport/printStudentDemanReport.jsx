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
import {
  momentDate,
  printDocument,
  semesterValue,
  upperCase,
} from "../../../../utils";
import { TABLE_STYLES } from "../../../../utils/data";

const PrintStudentDemanReport = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  const [dataList, setDataList] = useState(props.dataSource);
  const [dataView, setDataView] = useState(props.dataSourceView);

  useEffect(() => {
    printDocument("class_wise_demand_list_print");

    if (props.onSuccess) props.onSuccess();
  }, []);

  const field = (fieldName) => {
    if (dataList.length > 0) return dataList[0]?.[fieldName];
  };

  const getAmount = (item, type = "paid") => {
    let rv = false;
    if (type == "paid") {
      if (item.bill_id != null && item.is_cancelled == 0) rv = item.fee_amount;
    } else if (type == "balance") {
      if (item.bill_id == null && item.is_cancelled == 0) rv = item.fee_amount;
    } else if (type == "demand") {
      rv = item.fee_amount;
      let amt = item.part_type == "concession" ? item.part_amount : false;
      if (amt) {
        rv = rv ? parseFloat(rv) + parseFloat(amt) : amt;
      }
    } else if (type == "concession") {
      let amt = item.part_type == "concession" ? item.part_amount : false;
      if (amt) {
        rv = amt;
      }
    }
    return rv ? parseFloat(rv).toFixed(2) : "";
  };

  const innerRow = (items) => {
    return items.map((item, i) => {
      return (
        <tr>
          <td>{item.category_name}</td>
          <td align="right">{getAmount(item, "demand")}</td>
          <td align="right">{getAmount(item, "paid")}</td>
          <td align="right">{getAmount(item, "concession")}</td>
          <td align="right">{getAmount(item, "balance")}</td>
        </tr>
      );
    });
  };

  const rowsTotal = (items, type = "paid", withZero = false) => {
    let rv = 0;
    if (type == "paid") {
      items.map(
        (item) =>
          item.bill_id != null &&
          item.is_cancelled == 0 &&
          (rv = parseFloat(rv) + parseFloat(item.fee_amount))
      );
    } else if (type == "balance") {
      items.map(
        (item) =>
          item.bill_id == null &&
          item.is_cancelled == 0 &&
          (rv = parseFloat(rv) + parseFloat(item.fee_amount))
      );
    } else if (type == "total") {
      items.map((item) => (rv = parseFloat(rv) + parseFloat(item.fee_amount)));
      items.map(
        (item) =>
          item.part_type == "concession" &&
          (rv = parseFloat(rv) + parseFloat(item.part_amount))
      );
    } else if (type == "concession") {
      items.map(
        (item) =>
          item.part_type == "concession" &&
          (rv = parseFloat(rv) + parseFloat(item.part_amount))
      );
    }
    return rv ? parseFloat(rv).toFixed(2) : withZero ? "0.00" : "";
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <div id="class_wise_demand_list_print">
          <table
            width="100%"
            align="center"
            style={TABLE_STYLES.tableCollapse}
            className="font-bookman"
          >
            <thead>
              <tr>
                <th colSpan={5} align="center" height="30">
                  <b>{context.settingValue("billheader_name")}</b>
                  <br />
                  {context.settingValue("billheader_addresslineone") && (
                    <>
                      {context.settingValue("billheader_addresslineone")} <br />
                    </>
                  )}
                  {context.settingValue("billheader_addresscity") && (
                    <>{context.settingValue("billheader_addresscity")} </>
                  )}
                </th>
              </tr>
              <tr>
                <th colSpan={5} align="center" height="30">
                  Student Fee Demand Report
                </th>
              </tr>
              <tr style={TABLE_STYLES.borderBottom}>
                <th colSpan={5} align="left" height="30">
                  {props.course.name} {props.course.initial} -{" "}
                  {props.course.registerno || props.course.admissionno}
                  {"  - "}
                  {props.course.degree_name} - {props.course.course_name}{" "}
                  {props.course.dept_type == "aided" ? "(R)" : "(SF)"} /
                  {props.course.batch}
                </th>
              </tr>
              <tr style={TABLE_STYLES.borderBottom}>
                <th align="left">Category</th>
                <th width="90" align="right">
                  Demand
                </th>
                <th width="90" align="right">
                  Paid
                </th>
                <th width="90" align="right">
                  Scholarship
                </th>
                <th width="90" align="right">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {dataView.map((item, i) => {
                return (
                  <>
                    <tr>
                      <td colSpan={5}>
                        <b>{semesterValue(item[0].semester)}</b>
                      </td>
                    </tr>
                    {innerRow(item)}
                    <tr className="">
                      <td align="right">Total</td>
                      <td align="right" style={TABLE_STYLES.borderTop}>
                        <b>{rowsTotal(item, "total")}</b>
                      </td>
                      <td align="right" style={TABLE_STYLES.borderTop}>
                        <b>{rowsTotal(item, "paid")}</b>
                      </td>
                      <td style={TABLE_STYLES.borderTop} align="right">
                        <b>{rowsTotal(item, "concession")}</b>
                      </td>
                      <td align="right" style={TABLE_STYLES.borderTop}>
                        <b>{rowsTotal(item, "balance", true)}</b>
                      </td>
                    </tr>
                  </>
                );
              })}
              <tr>
                <td></td>
                <td
                  align="right"
                  colSpan={4}
                  height="25"
                  style={TABLE_STYLES.borderBottom}
                ></td>
              </tr>
              <tr>
                <td className="font-bookman" align="right" height="24">
                  Grand Total
                </td>
                <td style={TABLE_STYLES.borderBottom} align="right">
                  <b>{rowsTotal(dataList, "total")}</b>
                </td>
                <td style={TABLE_STYLES.borderBottom} align="right">
                  <b>{rowsTotal(dataList, "paid")}</b>
                </td>
                <td style={TABLE_STYLES.borderBottom} align="right">
                  <b>{rowsTotal(dataList, "concession")}</b>
                </td>
                <td style={TABLE_STYLES.borderBottom} align="right">
                  <b>{rowsTotal(dataList, "balance", true)}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PrintStudentDemanReport;
