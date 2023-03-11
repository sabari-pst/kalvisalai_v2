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

const PrintClassWisePending = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  const [dataList, setDataList] = useState(props.dataSource);
  const [dataView, setDataView] = useState(props.dataSource);

  useEffect(() => {
    printDocument("class_wise_pending_list_print");

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

  const styles = TABLE_STYLES;

  return (
    <>
      <div style={{ display: "none" }}>
        <div id="class_wise_pending_list_print">
          <table
            width="100%"
            align="center"
            style={styles.tableCollapse}
            className="font-bookman"
          >
            <thead style={{ fontSize: "12px" }}>
              <tr>
                <th colSpan={9} align="center" height="30">
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
              <tr style={styles.borderBottom}>
                <th
                  colSpan={9}
                  align="center"
                  height="30"
                  style={styles.borderBottom}
                >
                  Transport Fee Pending{" "}
                  {props.selectedVehicle &&
                    props.selectedVehicle.length > 0 && (
                      <> - {props.selectedVehicle}</>
                    )}
                </th>
              </tr>
              <tr>
                <th width="80" align="center" style={styles.borderBottom}>
                  S.No
                </th>
                <th align="left" style={styles.borderBottom}>
                  Register No
                </th>
                <th align="left" style={styles.borderBottom}>
                  Student Name
                </th>
                <th align="left" style={styles.borderBottom}>
                  Course & Sem
                </th>
                <th align="left" style={styles.borderBottom}>
                  Route
                </th>
                <th width="100" align="right" style={styles.borderBottom}>
                  Demand
                </th>
                <th width="100" align="right" style={styles.borderBottom}>
                  Paid
                </th>
                <th width="100" align="right" style={styles.borderBottom}>
                  Scholarship
                </th>
                <th width="100" align="right" style={styles.borderBottom}>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {dataView.map((item, i) => {
                return (
                  <tr key={i}>
                    <td align="center" height="30">
                      {i + 1}
                    </td>
                    <td>{item.registerno || item.admissionno}</td>
                    <td>{item.student_name}</td>
                    <td>
                      {item.degree_name}
                      {item.course_short_name &&
                        ` - ${item.course_short_name} `}
                      {upperCase(item.course_type) == "SELF" ? "(SF)" : "(R)"}
                      {semesterValue(item.semester)}
                    </td>
                    <td>
                      {(!props.selectedVehicle ||
                        props.selectedVehicle.length < 1) && (
                        <>
                          {upperCase(item.vehicle_no)}
                          <br />
                        </>
                      )}
                      {upperCase(item.destination_name)}
                    </td>
                    <td align="right">{getTotalAmount(item)}</td>
                    <td align="right">{item.total_paid || "-"}</td>
                    <td align="right">{item.total_concession || "-"}</td>
                    <td align="right">{item.total_unpaid || "-"}</td>
                  </tr>
                );
              })}
              <tr style={{ fontSize: "12px" }}>
                <td colSpan={5} align="right"></td>
                <td align="right" style={styles.borderBottom}></td>
                <td align="right" style={styles.borderBottom}></td>
                <td align="right" style={styles.borderBottom}></td>
                <td align="right" style={styles.borderBottom}></td>
              </tr>
              <tr style={{ fontSize: "12px" }} height="25">
                <td colSpan={5} align="right">
                  Total
                </td>
                <td align="right" style={styles.borderBottom}>
                  <b>{getOverallTotal()}</b>
                </td>
                <td align="right" style={styles.borderBottom}>
                  <b>{getTotalByField("total_paid")}</b>
                </td>
                <td align="right" style={styles.borderBottom}>
                  <b>{getTotalByField("total_concession")}</b>
                </td>
                <td align="right" style={styles.borderBottom}>
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

export default PrintClassWisePending;
