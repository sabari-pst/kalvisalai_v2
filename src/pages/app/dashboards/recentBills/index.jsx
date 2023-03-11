import React, { useState, useEffect, useContext, useCallback } from "react";
import { Card, Spinner } from "react-bootstrap";

import PsContext from "../../../../context";

import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { momentDate, upperCase } from "../../../../utils";
import { TABLE_STYLES } from "../../../../utils/data";
import { Link } from "react-router-dom";

const RecentBills = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadCount();
  }, []);

  const loadCount = () => {
    setLoader(true);
    const form = new FormData();
    form.append("limit", 8);
    form.append("order_by", 1);
    form.append("type", "all");
    form.append("group_by", "a.bill_id");
    axios.post(ServiceUrl.FEES.LIST_STUDENT_PAYMENT, form).then((res) => {
      if (res["data"].status == "1") {
        setData(res["data"].data);
      }
      setLoader(false);
    });
  };

  return (
    <div>
      <Card>
        <Card.Header>
          Payment History
          <span className="float-end">
            <Link
              to="/app/fee-payment/payment-list"
              style={{ fontSize: "12px", textDecoration: "underline" }}
            >
              View All
            </Link>
          </span>
        </Card.Header>
        <Card.Body>
          {loader && (
            <center>
              <Spinner animation="grow" size="lg" variant="dark" />
            </center>
          )}
          <table
            width="100%"
            style={{ fontSize: "11.5px" }}
            className="font-bookman table_even_border"
          >
            <tbody>
              {data.map((item, i) => {
                return (
                  <tr>
                    <td>
                      {item.bill_no}
                      <br />
                      {momentDate(item.bill_date, "DD/MMM/YYYY")}
                    </td>
                    <td>
                      {item.registerno || item.admissionno}
                      <br />
                      <b>{item.student_name}</b>
                    </td>
                    <td>
                      {upperCase(item.course_type)}
                      <br />
                      {item.degree_name} {item.course_short_name}
                    </td>
                    <td width="90" align="right">
                      <b>{item.bill_amount}</b>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RecentBills;
