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

  return (
    <>
      <div style={{ display: "none" }}>
        <div id="class_wise_pending_list_print">
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
                  {context.settingValue("billheader_addresslinetwo") && (
                    <>
                      {context.settingValue("billheader_addresslinetwo")} <br />
                    </>
                  )}
                </th>
              </tr>
              <tr>
                <th colSpan={5} align="center" height="30">
                  Course Wise Pending
                </th>
              </tr>
              <tr>
                <th colSpan={5} align="left" height="30">
                  {props.course.course_name} - {props.course.academic_year} / (
                  {props.course.semester} Sem)
                </th>
              </tr>
              <tr style={TABLE_STYLES.borderTopBottom}>
                <th width="80" align="center">
                  S.No
                </th>
                <th align="left">Register No</th>
                <th align="left">Student Name</th>
                <th align="left">Place</th>
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
                    <td>{item.village_permanent}</td>
                    <td align="right">{item.total_unpaid || "-"}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={4} align="right">
                  Total
                </td>
                <td
                  align="right"
                  style={TABLE_STYLES.borderTopBottom}
                  height="25"
                >
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
