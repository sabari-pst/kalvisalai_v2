import React, { useContext } from "react";
import PsContext from "../../../../context";
import {
  momentDate,
  numberToWords,
  semesterValue,
  upperCase,
} from "../../../../utils";
import { TABLE_STYLES, VENDOR_LOGO } from "../../../../utils/data";

const ChallanLayout = (props) => {
  const context = useContext(PsContext);

  const divHeight = 310;

  const getSum = () => {
    let total = 0;
    props.dataSource.map(
      (item) => (total = parseFloat(total) + parseFloat(item.fee_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  const field = (fieldName) => {
    if (
      props.dataSource &&
      props.dataSource.length > 0 &&
      props.dataSource[0][fieldName]
    )
      return props.dataSource[0][fieldName];
  };

  return (
    <>
      <table style={TABLE_STYLES.tableCollapse} width="95%">
        <tr>
          <td style={TABLE_STYLES.borderAllNoPadding}>
            <table width="100%" style={{ fontSize: "11px" }}>
              <tbody>
                <tr>
                  <td align="center" colSpan={6} height="20">
                    <div
                      style={{
                        border: "1px solid #efefef",
                        padding: "4px",
                        width: "120px",
                        fontWeight: "bold",
                      }}
                    >
                      {props.title}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} style={{ padding: "0 20px" }}>
                    <table width="100%" style={{ fontSize: "11px" }}>
                      <tr style={TABLE_STYLES.borderTop}>
                        <td width="15%" align="center">
                          <img src={VENDOR_LOGO} style={{ width: "75px" }} />
                        </td>
                        <td align="center">
                          <b>{context.settingValue("billheader_name")}</b>
                          <div style={{ fontSize: "10px" }}>
                            {context.settingValue(
                              "billheader_addresslineone"
                            ) && (
                              <>
                                {context.settingValue(
                                  "billheader_addresslineone"
                                )}{" "}
                                <br />
                              </>
                            )}
                            {context.settingValue(
                              "billheader_addresslinetwo"
                            ) && (
                              <>
                                {context.settingValue(
                                  "billheader_addresslinetwo"
                                )}{" "}
                                <br />
                              </>
                            )}
                            {context.settingValue("college_affiliation") && (
                              <>
                                {context.settingValue("college_affiliation")}{" "}
                                <br />
                              </>
                            )}
                            {context.settingValue("billheader_addresscity") && (
                              <>
                                {context.settingValue("billheader_addresscity")}{" "}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr style={{ padding: "0 20px" }}>
                  <td align="center" colSpan={6} style={TABLE_STYLES.borderTop}>
                    <b>Account with {field("bank_name")}</b>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan={4} align="center" style={TABLE_STYLES.borderAll}>
                    {field("bank_print_name")} ({field("bank_account_no")})
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td width="50">Name</td>
                  <td width="15" align="center">
                    :
                  </td>
                  <td colSpan={3}>{field("student_name")}</td>
                </tr>
                <tr>
                  <td>Reg.No</td>
                  <td align="center">:</td>
                  <td>{field("registerno")}</td>
                  <td width="30">Date</td>
                  <td align="center" width="15">
                    :
                  </td>
                  <td width="60" align="right">
                    {momentDate(new Date(), "DD-MM-YYYY")}
                  </td>
                </tr>
                <tr>
                  <td>Class/Sem</td>
                  <td width="15" align="center">
                    :
                  </td>
                  <td colSpan={3}>
                    {field("degree_name")}-{field("course_name")} (
                    {upperCase(field("course_type")) == "SELF" ? "SF" : "R"}) /
                    {"  "}
                    {semesterValue(field("semester"))}
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              width="100%"
              style={TABLE_STYLES.tableCollapse}
              className="font-bookman"
            >
              <tbody style={{ fontSize: "11px" }}>
                <tr style={TABLE_STYLES.borderAllHead}>
                  <td width="30" style={TABLE_STYLES.borderAll}>
                    <b>S.No</b>
                  </td>
                  <td style={TABLE_STYLES.borderAll}>
                    <b>Particulars</b>
                  </td>
                  <td width="80" align="right" style={TABLE_STYLES.borderAll}>
                    <b>Rs. Ps.</b>
                  </td>
                </tr>

                {props.dataSource.map((item, i) => {
                  return (
                    <tr style={TABLE_STYLES.borderAll}>
                      <td style={TABLE_STYLES.borderAll} align="center">
                        {i + 1}
                      </td>
                      <td style={TABLE_STYLES.borderAll}>
                        {item.category_print_name || item.category_name}
                      </td>
                      <td style={TABLE_STYLES.borderAll} align="right">
                        {item.fee_amount}
                      </td>
                    </tr>
                  );
                })}

                <tr style={TABLE_STYLES.borderAll}>
                  <td style={TABLE_STYLES.borderAll} align="center"></td>
                  <td
                    style={TABLE_STYLES.borderAll}
                    height={
                      divHeight - (divHeight / 7) * props.dataSource.length
                    }
                  ></td>
                  <td style={TABLE_STYLES.borderAll} align="right"></td>
                </tr>

                <tr style={TABLE_STYLES.borderAll}>
                  <td style={TABLE_STYLES.borderAll} colSpan={2} align="right">
                    <b>Total</b>
                  </td>
                  <td width="80" align="right" style={TABLE_STYLES.borderAll}>
                    <b>{getSum()}</b>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={3}
                    align="center"
                    height="30"
                    style={{ fontSize: "11px" }}
                  >
                    <b>( RUPEES {upperCase(numberToWords(getSum()))} ONLY )</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} align="right" height="45">
                    <span style={{ fontSize: "10px" }}>
                      Signature of the Remitter
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="left" height="40">
                    <span style={{ fontSize: "10px" }}>Clerk</span>
                  </td>
                  <td align="center">
                    <span style={{ fontSize: "10px" }}>Cashier</span>
                  </td>
                  <td align="right">
                    <span style={{ fontSize: "10px" }}>Manager</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </>
  );
};

export default ChallanLayout;
