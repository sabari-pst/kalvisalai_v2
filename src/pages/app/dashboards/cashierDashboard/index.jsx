import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";

import { capitalizeFirst, CardFixedTop, upperCase } from "../../../../utils";
import TodayFeeCollection from "../todayFeeCollection";
import MonthFeeCollection from "../monthFeeCollection";
import RecentBills from "../recentBills";

const CashierDashboard = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  return (
    <>
      <CardFixedTop title="Dashboard">
        <ul className="list-inline mb-0">
          <li className="list-inline-item"></li>
        </ul>
      </CardFixedTop>

      <div className="container py-3">
        <Row>
          <Col md={3}>
            <TodayFeeCollection />
          </Col>
          <Col md={3}>
            <MonthFeeCollection />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={6}>
            <RecentBills />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CashierDashboard;
