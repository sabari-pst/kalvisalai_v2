import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import PsContext from "../../../../context";
import { TABLE_STYLES, VENDOR_LOGO } from "../../../../utils/data";
import {
  capitalizeFirst,
  lowerCase,
  momentDate,
  numberToWords,
  printDocument,
} from "../../../../utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import axios from "axios";
import toast from "react-hot-toast";

const styles = {
  tableCollapse: {
    borderCollapse: "collapse",
    fontSize: "12px",
  },
  borderBottom: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
    fontSize: "12px",
  },
  borderExceptLeft: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    fontSize: "12px",
    padding: "3px",
  },
  borderExceptRight: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    borderLeft: "1px solid black",
    fontSize: "12px",
    padding: "3px",
  },
  borderAll: {
    borderCollapse: "collapse",
    border: "1px solid black",
    fontSize: "12px",
    padding: "3px",
  },
  borderTopBottom: {
    borderCollapse: "collapse",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    fontSize: "12px",
    padding: "3px",
  },
  smallfont: {
    fontSize: "12px",
  },
};

const FeeReceiptPrintA5 = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    const form = new FormData();
    form.append("bill_id", props.dataSource.bill_id);
    form.append("bill_date", props.dataSource.bill_date);
    axios.post(ServiceUrl.FEES.VIEW_STUDENT_BILL, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        setDataView(res["data"].data);

        printDocument("fee_receipt_a5");

        if (props.onSuccess) props.onSuccess();
      } else {
        toast.error(res["data"].message || "Error");

        if (props.onSuccess) props.onSuccess();
      }
    });
  };

  const field = (fieldName) => {
    if (dataList && dataList.length > 0 && dataList[0][fieldName])
      return dataList[0][fieldName];
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <div id="fee_receipt_a5" style={{ fontSize: "10px" }}>
          <table
            width="100%"
            align="center"
            className="font-bookman"
            style={{ fontSize: "12px" }}
          >
            <tr>
              <td>
                <table
                  width="100%"
                  align="center"
                  style={TABLE_STYLES.tableCollapse}
                >
                  <tr>
                    <td width="10%" align="center">
                      <img src={VENDOR_LOGO} style={{ width: "70px" }} />
                    </td>
                    <td align="center" style={styles.smallfont}>
                      <b>{context.settingValue("billheader_name")}</b>
                      <br />
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
                      {context.settingValue("college_affiliation") && (
                        <>
                          {context.settingValue("college_affiliation")} <br />
                        </>
                      )}
                      {context.settingValue("billheader_addresscity") && (
                        <>{context.settingValue("billheader_addresscity")} </>
                      )}
                      {context.settingValue("billheader_phone") && (
                        <>
                          &#9743; {context.settingValue("billheader_phone")}
                          <br />
                        </>
                      )}
                      {context.settingValue("billheader_email") && (
                        <>&#64; {context.settingValue("billheader_email")}</>
                      )}
                    </td>
                  </tr>
                  {field("is_cancelled") == "1" && (
                    <tr>
                      <td colSpan={2} align="center" style={styles.smallfont}>
                        <b>Cancel Bill</b>
                      </td>
                    </tr>
                  )}
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style={TABLE_STYLES.borderTop}>
                <table align="center" width="100%" style={{ fontSize: "12px" }}>
                  <tr style={styles.smallfont}>
                    <td width="90">Reg.No</td>
                    <td width="10" align="center">
                      :
                    </td>
                    <td>{field("registerno") || field("admissionno")}</td>
                    <td width="90">Bill No</td>
                    <td width="10" align="center">
                      :
                    </td>
                    <td width="100">{field("bill_no")}</td>
                  </tr>
                  <tr style={styles.smallfont}>
                    <td>Course</td>
                    <td width="" align="center">
                      :
                    </td>
                    <td>
                      {field("degree_name")} - {field("course_short_name")}
                      {field("course_type") == "self" ? "(SF)" : "(R)"} /
                      {field("current_semesters")} sem
                    </td>
                    <td>Bill Date</td>
                    <td width="" align="center">
                      :
                    </td>
                    <td width="">
                      {momentDate(field("bill_date"), "DD/MM/YYYY")}
                    </td>
                  </tr>
                  <tr style={styles.smallfont}>
                    <td>Name</td>
                    <td width="" align="center">
                      :
                    </td>
                    {field("is_cancelled") == "1" ? (
                      <>
                        <td>{field("student_name")}</td>
                        <td>Cancel Date</td>
                        <td width="" align="center">
                          :
                        </td>
                        <td width="">
                          {momentDate(field("bill_cancel_date"), "DD/MM/YYYY")}
                        </td>
                      </>
                    ) : (
                      <td colSpan={4}>{field("student_name")}</td>
                    )}
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="">
                <table
                  width="100%"
                  align="center"
                  style={TABLE_STYLES.tableCollapse}
                >
                  <thead style={styles.borderTopBottom}>
                    <tr>
                      <th width="80" height="20">
                        S.No
                      </th>
                      <th width="" align="left">
                        Particulars
                      </th>
                      <th width="120" align="right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "12px" }}>
                    {dataView.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td align="center" height="20">
                            {i + 1}
                          </td>
                          <td align="left">
                            {item.category_print_name || item.category_name}
                          </td>
                          <td align="right">{item.fee_amount}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={2} height="30" align="right">
                        Total{" "}
                      </td>
                      <td
                        align="right"
                        style={TABLE_STYLES.borderTopBottom}
                        height="25"
                      >
                        <b>{field("bill_amount")}</b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} height="20">
                        Payment By : {field("payment_method_name")}{" "}
                        {field("payment_cash") != "1" && (
                          <>
                            / Ref.No : {field("payment_ref_number")} / Dt.
                            {momentDate(
                              field("payment_ref_date"),
                              "DD/MM/YYYY"
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={3}
                        height="30"
                        style={TABLE_STYLES.borderBottom}
                      >
                        Amount in words : {numberToWords(field("bill_amount"))}{" "}
                        Rupess Only.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td align="right">
                <br />
                <br />
                <br />
                for{" "}
                {capitalizeFirst(
                  lowerCase(context.settingValue("billheader_name"))
                )}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default FeeReceiptPrintA5;
