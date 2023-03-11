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

const PrintClassWiseDemand = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  const [dataList, setDataList] = useState(props.dataSource);
  const [dataView, setDataView] = useState(props.dataSource);

  useEffect(() => {
    printDocument("class_wise_demand_list_print");

    if (props.onSuccess) props.onSuccess();
  }, []);

  const getTotalByField = (fieldName) => {
    let total = 0;
    dataView.map(
      (item) =>
        item[fieldName] &&
        (total = parseFloat(total) + parseFloat(item[fieldName]))
    );
    return parseFloat(total).toFixed(2);
  };

  const getTotalAmount = (item) => {
    let total = 0;
    if (item && item.total_concession)
      total = parseFloat(total) + parseFloat(item.total_concession);
    if (item && item.total_paid)
      total = parseFloat(total) + parseFloat(item.total_paid);
    if (item && item.total_unpaid)
      total = parseFloat(total) + parseFloat(item.total_unpaid);
    return parseFloat(total).toFixed(2);
  };

  const getOverallTotal = () => {
    let total = 0;
    dataView.map((item, i) => {
      if (item && item.total_concession)
        total = parseFloat(total) + parseFloat(item.total_concession);
      if (item && item.total_paid)
        total = parseFloat(total) + parseFloat(item.total_paid);
      if (item && item.total_unpaid)
        total = parseFloat(total) + parseFloat(item.total_unpaid);
    });
    return parseFloat(total).toFixed(2);
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
                <th colSpan={7} align="center" height="30">
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
              <tr style={TABLE_STYLES.borderBottom}>
                <th colSpan={7} align="center" height="30">
                  {props.course.fee_group_name &&
                    `${props.course.fee_group_name} - `}
                  Course Wise Pending
                </th>
              </tr>
              <tr style={TABLE_STYLES.borderBottom}>
                <th colSpan={7} align="left" height="30">
                  {props.course.course_name} - {props.course.academic_year} / (
                  {props.course.semester} Sem)
                </th>
              </tr>
              <tr style={TABLE_STYLES.borderBottom}>
                <th width="80" align="center">
                  S.No
                </th>
                <th align="left">Register No</th>
                <th align="left">Student Name</th>

                <th width="100" align="right">
                  Demand
                </th>
                <th width="100" align="right">
                  Paid
                </th>
                <th width="100" align="right">
                  Scholarship
                </th>
                <th width="100" align="right">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {dataView.map((item, i) => {
                return (
                  <tr key={i} style={{ fontSize: "11px" }}>
                    <td align="center" height="20">
                      {i + 1}
                    </td>
                    <td>{item.registerno || item.admissionno}</td>
                    <td>{item.name}</td>

                    <td align="right">{getTotalAmount(item)}</td>
                    <td align="right">{item.total_paid || "-"}</td>
                    <td align="right">{item.total_concession || "-"}</td>
                    <td align="right">{item.total_unpaid || "-"}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={3} align="right"></td>
                <td style={TABLE_STYLES.borderBottom}></td>
                <td style={TABLE_STYLES.borderBottom}></td>
                <td style={TABLE_STYLES.borderBottom}></td>
                <td style={TABLE_STYLES.borderBottom}></td>
              </tr>
              <tr>
                <td colSpan={3} align="right" height="25">
                  Total
                </td>
                <td align="right" style={TABLE_STYLES.borderBottom}>
                  <b>{getOverallTotal()}</b>
                </td>
                <td align="right" style={TABLE_STYLES.borderBottom}>
                  <b>{getTotalByField("total_paid")}</b>
                </td>
                <td align="right" style={TABLE_STYLES.borderBottom}>
                  <b>{getTotalByField("total_concession")}</b>
                </td>
                <td align="right" style={TABLE_STYLES.borderBottom}>
                  <b>{getTotalByField("total_unpaid")}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PrintClassWiseDemand;
