import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect, Route, withRouter } from "react-router-dom";

import PsContext from "../../../context";

import { List, TabBar, NavBar, Space, Toast } from "antd-mobile";
import { Card, Col, Row } from "react-bootstrap";
import { MOB_ICONS } from "../../../utils/data";
import FooterTab from "../layout/footerTab";
import TodayTimeTable from "./todayTimeTable";

const Dashboard = (props) => {
  const context = useContext(PsContext);

  return (
    <div className="">
      <div className="fixed-top">
        <NavBar
          className="py-2"
          backArrow={false}
          right={
            <Link to="/mob/app/myprofile">
              <i className="fa-sharp fa-solid fa-user text-white fs-3"></i>
            </Link>
          }
        >
          <div>
            <div>Dashboard</div>
          </div>
        </NavBar>
      </div>
      <div className="container px-4 py-4 mt-50">
        <Card
          className="border-radius-2 shadow-sm"
          style={{ backgroundColor: "#00acff1a" }}
        >
          <Card.Body>
            Welcome, <br />
            <b>{context.user.emp_name}</b>
            <div>
              <img
                src={MOB_ICONS.USER_BLACK_256.default}
                className="mob-user-dashboar-icon"
              />
            </div>
          </Card.Body>
        </Card>
        <Row className="mt-4">
          <Col md={12}>
            <TodayTimeTable />
          </Col>
        </Row>
      </div>
      <FooterTab {...props} />
    </div>
  );
};

export default withRouter(Dashboard);
