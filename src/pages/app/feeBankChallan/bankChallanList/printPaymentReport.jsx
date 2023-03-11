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

const PrintPaymentReport = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  const [dataList, setDataList] = useState(props.dataSource);
  const [dataView, setDataView] = useState(props.dataSource);

  useEffect(() => {
    printDocument("fee_payment_list_print");

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

  const getTotalByFieldAndMethodId = (fieldName, methodId) => {
    let total = 0;
    let dv = dataView.filter((item) => item.payment_method_id == methodId);
    dv.map(
      (item) =>
        item[fieldName] &&
        (total = parseFloat(total) + parseFloat(item[fieldName]))
    );
    return parseFloat(total).toFixed(2);
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <div id="fee_payment_list_print">
          <table
            width="100%"
            align="center"
            style={TABLE_STYLES.tableCollapse}
            className="font-bookman"
          >
            <thead>
              <tr>
                <th colSpan={11} align="center" height="30">
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
                <th colSpan={5} align="left" height="30">
                  Daily Summary{" "}
                  {props.paymentMethodName && ` - ${props.paymentMethodName}`}
                </th>
                <th colSpan={6} align="right" height="30">
                  From : {momentDate(props.fromDate, "DD/MM/YYYY")} &emsp; To :{" "}
                  {momentDate(props.toDate, "DD/MM/YYYY")}
                </th>
              </tr>
              <tr style={TABLE_STYLES.borderBottom}>
                <th width="80" align="center">
                  S.No
                </th>
                <th width="100" align="left">
                  Date
                </th>
                <th width="90" align="left">
                  Bill No
                </th>
                <th align="left">Student Name</th>
                <th align="left">Reg.No</th>
                <th align="left">Course</th>
                <th width="80" align="center">
                  Sem
                </th>
                <th width="" align="center">
                  Type
                </th>
                <th width="100" align="right">
                  Amount
                </th>
                <th width="100" align="right">
                  Concession
                </th>
                <th width="100" align="right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {dataView.map((item, i) => {
                return (
                  <tr key={i}>
                    <td align="center" height="30">
                      {i + 1}
                    </td>
                    <td>{momentDate(item.bill_date, "DD/MM/YYYY")}</td>
                    <td>{item.bill_no}</td>
                    <td>{item.student_name}</td>
                    <td>{item.registerno || item.admissionno}</td>
                    <td>
                      {item.degree_name}{" "}
                      {item.course_short_name &&
                        ` - ${item.course_short_name} `}
                      {upperCase(item.course_type) == "SELF" ? "(SF)" : "(R)"}
                    </td>
                    <td align="center">{item.semester}</td>
                    <td align="center">{item.payment_method_name}</td>
                    <td align="right">{item.bill_grand_total}</td>
                    <td align="right">
                      {item.part_type == "concession" && item.total_concession}
                    </td>
                    <td align="right">{item.bill_amount}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={8} align="right"></td>
                <td align="right" style={TABLE_STYLES.borderBottom}></td>
                <td align="right" style={TABLE_STYLES.borderBottom}></td>
                <td align="right" style={TABLE_STYLES.borderBottom}></td>
              </tr>
              <tr>
                <td colSpan={8} align="right" height="25">
                  Total
                </td>
                <td align="right" style={TABLE_STYLES.borderBottom}>
                  <b>{getTotalByField("bill_grand_total")}</b>
                </td>
                <td align="right" style={TABLE_STYLES.borderBottom}>
                  <b>{getTotalByField("total_concession")}</b>
                </td>
                <td align="right" style={TABLE_STYLES.borderBottom}>
                  <b>{getTotalByField("bill_amount")}</b>
                </td>
              </tr>
              {props.paymentListSource.map((item, i) => {
                return (
                  <tr>
                    <td colSpan={8} align="right" height="25">
                      {item.method_name}{" "}
                    </td>
                    <td align="right" style={TABLE_STYLES.borderBottom}>
                      <b>
                        {getTotalByFieldAndMethodId(
                          "bill_grand_total",
                          item.id
                        )}
                      </b>
                    </td>
                    <td align="right" style={TABLE_STYLES.borderBottom}>
                      <b>
                        {getTotalByFieldAndMethodId(
                          "total_concession",
                          item.id
                        )}
                      </b>
                    </td>
                    <td align="right" style={TABLE_STYLES.borderBottom}>
                      <b>
                        {getTotalByFieldAndMethodId("bill_amount", item.id)}
                      </b>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PrintPaymentReport;
