import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { capitalizeFirst, CardFixedTop, upperCase } from "../../../../utils";
import { printHeader } from "../../../../utils/data";
import API from "../../../../utils/api";
import { checkBalance } from "../../../../models/resellerSms";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import FirstLineCounts from "./firstLineCounts";
import StudentBirthDayList from "./studentBirthDayList";
import StaffBirthDayList from "./staffBirthDayList";
import StudentsCount from "./studentsCount";
import TodayDayOrder from "./todayDayOrder";

const Dashboard = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [smsBalance, setSmsBalance] = useState(null);

  const [count, setCount] = useState([]);

  useEffect(() => {
    //loadCount();
    checkBalance().then((res) => res && setSmsBalance(res));
  }, []);

  const loadCount = () => {
    setLoader(true);
    axios.get(ServiceUrl.ADMISSION.DASHBOARD_COUNT).then((res) => {
      if (res["data"].status == "1") {
        setCount(res["data"].data);
      }
      setLoader(false);
    });
  };

  const deptType = (item) => {
    return item.deptype == "regular" ? "(R)" : "(SF)";
  };

  return (
    <>
      <CardFixedTop title="Dashboard">
        <div className="float-start"></div>
        <div
          className={
            smsBalance && parseFloat(smsBalance) <= 200
              ? "float-end blinking-red"
              : "float-end "
          }
        >
          <ul className="list-inline mb-0">
            <li className="list-inline-item">
              <TodayDayOrder />
            </li>
            <li className="list-inline-item border-start">
              <span className="px-2">
                SMS Balance : <b>{smsBalance}</b>
              </span>
            </li>
          </ul>
        </div>
      </CardFixedTop>

      <div className="container">
        <FirstLineCounts />

        <Row>
          <Col md={6} className="mt-3">
            <StudentsCount />
          </Col>
          <Col md={6} className="mt-3"></Col>
          <Col md={6} className="mt-3">
            <StudentBirthDayList />
          </Col>
          <Col md={6} className="mt-3">
            <StaffBirthDayList />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withRouter(Dashboard);
