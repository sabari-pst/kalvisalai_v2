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

const PrintCategoryReport = (props) => {
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

  return (
    <>
      <div style={{ display: "none" }}>
        <div id="fee_payment_list_print">
          <table
            width="100%"
            align="center"
            className="font-bookman"
            style={TABLE_STYLES.tableCollapse}
          >
            <thead>
              <tr>
                <th colSpan={4} align="center" height="30">
                  <b>{context.settingValue("billheader_name")}</b>
                  <br />
                  <div style={{ fontWeight: "100" }}>
                    {context.settingValue("billheader_addresslineone") && (
                      <>
                        {context.settingValue("billheader_addresslineone")}{" "}
                        <br />
                      </>
                    )}
                    {context.settingValue("billheader_addresslinetwo") && (
                      <>
                        {context.settingValue("billheader_addresslinetwo")}{" "}
                        <br />
                      </>
                    )}
                  </div>
                </th>
              </tr>
              <tr style={TABLE_STYLES.borderBottom}>
                <th colSpan={2} align="left" height="30">
                  {props.title}
                </th>
                <th colSpan={2} align="right" height="30">
                  {props.rightTitle}
                </th>
              </tr>
              <tr style={TABLE_STYLES.borderBottom}>
                <th width="80" align="center">
                  S.No
                </th>
                <th align="left">Category</th>
                <th align="left"></th>
                <th width="100" align="right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {dataView.map((item, i) => {
                return (
                  <tr key={i}>
                    <td align="center" height="22">
                      {i + 1}
                    </td>
                    <td className="font-bookman">
                      {item.category_print_name || item.category_name}
                    </td>
                    <td></td>
                    <td align="right" className="font-bookman">
                      {item.total_amount || "-"}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={3}></td>
                <td style={TABLE_STYLES.borderBottom}></td>
              </tr>
              <tr>
                <td colSpan={3} align="right" height="25">
                  Total
                </td>
                <td
                  align="right"
                  className="font-bookman"
                  style={TABLE_STYLES.borderBottom}
                >
                  <b>{getTotalByField("total_amount")}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PrintCategoryReport;
