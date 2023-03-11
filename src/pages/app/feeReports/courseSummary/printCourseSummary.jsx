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

const styles = {
  tableCollapse: {
    borderCollapse: "collapse",
  },
  borderBottom: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
  },
  borderBottomDashed: {
    borderCollapse: "collapse",
    borderBottom: "1px dashed black",
  },
  borderExceptLeft: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    padding: "3px",
  },
  borderExceptRight: {
    borderCollapse: "collapse",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    borderLeft: "1px solid black",
    padding: "3px",
  },
  borderAll: {
    borderCollapse: "collapse",
    border: "1px solid black",
    padding: "3px",
  },
  borderTopBottom: {
    borderCollapse: "collapse",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    padding: "3px",
  },
};

const PrintCourseSummary = (props) => {
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
    dataList.map(
      (item) =>
        item[fieldName] &&
        (total = parseFloat(total) + parseFloat(item[fieldName]))
    );
    return parseFloat(total).toFixed(2);
  };

  const getAccountAmountFromStudent = (categoryId, studentData) => {
    let m = studentData.find((item) => item.fee_category_id == categoryId);

    return m ? m.fee_amount : "-";
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

  const listCategoryTr = () => {
    let cIndex = 1;
    let rv = [];
    let sm = [];
    /*categoryList.map((item,i)=>{
			if(cIndex==4){
				sm.push(<td width="25%" >{item.category_account_no} - {item.category_print_name || item.category_name} : <b>{categoryTotal(item.id)}</b></td>)
				rv.push(<tr>{sm}</tr>)
				cIndex=1;				
			}
			else{
				sm.push(<td width="25%" >{item.category_account_no} - {item.category_print_name || item.category_name} : <b>{categoryTotal(item.id)}</b></td>)
				cIndex++;
			}
		});*/
    let sv = [];

    categoryList.map((item, i) => {
      if ((i + 1) % 4 == 0) {
        sv.push(
          <td width="25%" height="25">
            {item.category_account_no} -{" "}
            {item.category_print_name || item.category_name} :{" "}
            <b>{categoryTotal(item.id)}</b>
          </td>
        );
        rv.push(<tr>{sv}</tr>);
        sv = [];
      } else {
        sv.push(
          <td height="25" width="25%">
            {item.category_account_no} -{" "}
            {item.category_print_name || item.category_name} :{" "}
            <b>{categoryTotal(item.id)}</b>
          </td>
        );
      }
    });
    if (sv) rv.push(<tr>{sv}</tr>);

    return rv;
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <div id="category_summary_list_print">
          <table
            width="100%"
            align="center"
            style={styles.tableCollapse}
            className="font-bookman"
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
                  {context.settingValue("billheader_addresscity") && (
                    <>{context.settingValue("billheader_addresscity")} </>
                  )}
                </th>
              </tr>
              <tr>
                <th
                  colSpan={5}
                  align="left"
                  height="30"
                  style={styles.borderBottom}
                >
                  Course Summary
                </th>
                <th
                  colSpan={5}
                  align="right"
                  height="30"
                  style={styles.borderBottom}
                >
                  From : {momentDate(props.fromDate, "DD/MM/YYYY")} &emsp; To :{" "}
                  {momentDate(props.toDate, "DD/MM/YYYY")}
                </th>
              </tr>
            </thead>
          </table>
          <table width="100%" align="center" style={styles.tableCollapse}>
            <thead style={{ fontSize: "12px" }}>
              <tr>
                <th width="80" align="center" style={styles.borderBottom}>
                  S.No
                </th>

                <th align="left" style={styles.borderBottom}>
                  Course
                </th>
                <th align="center" style={styles.borderBottom} width="80">
                  Sem
                </th>
                {categoryList.map((obj) => (
                  <th align="" style={styles.borderBottom}>
                    {obj.category_account_no}
                  </th>
                ))}
                <th width="100" align="right" style={styles.borderBottom}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {dataView.map((items, i) => {
                let item = items[0];
                return (
                  <tr key={i} style={styles.borderBottomDashed}>
                    <td
                      align="center"
                      height="30"
                      style={styles.borderBottomDashed}
                    >
                      {i + 1}
                    </td>

                    <td align="left" style={styles.borderBottomDashed}>
                      {item.degree_name}
                      {item.course_short_name &&
                        ` - ${item.course_short_name} `}
                      {upperCase(item.course_type) == "SELF" ? "(SF)" : "(R)"}
                    </td>
                    <td align="center" style={styles.borderBottomDashed}>
                      {item.semester}
                    </td>
                    {categoryList.map((obj) => (
                      <td align="right" style={styles.borderBottomDashed}>
                        {getAccountAmountFromStudent(obj.id, items)}
                      </td>
                    ))}
                    <td align="right" style={styles.borderBottomDashed}>
                      {getStudentsTotal(items)}
                    </td>
                  </tr>
                );
              })}
              <tr style={styles.borderBottom}>
                <td
                  colSpan={3}
                  style={styles.borderBottom}
                  height="35"
                  align="right"
                >
                  Total
                </td>
                {categoryList.map((obj) => (
                  <td align="right" style={styles.borderBottom}>
                    <b>{categoryTotal(obj.id)}</b>
                  </td>
                ))}
                <td style={styles.borderBottom} align="right">
                  <b>{getTotalByField("fee_amount")}</b>
                </td>
              </tr>
            </tbody>
          </table>
          <table width="100%" align="center" style={{ fontSize: "12px" }}>
            {listCategoryTr()}
          </table>
        </div>
      </div>
    </>
  );
};

export default PrintCourseSummary;
