import React, { useState, useContext, useEffect } from "react";
import {
  Redirect,
  Route,
  useHistory,
  useLocation,
  withRouter,
} from "react-router-dom";

import PsContext from "../../../context";
import { TabBar } from "antd-mobile";

const FooterTab = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;
  const tabs = [
    {
      icon: <i className="fa-sharp fa-solid fa-house-user"></i>,
      badge: "",
      title: "Home",
      key: "/mob/app",
    },
    {
      icon: <i className="fa-sharp fa-solid fa-sheet-plastic"></i>,
      badge: "",
      title: "Attendace",
      key: "/mob/app",
      //key: "/mob/app/attendance",
    },
    {
      icon: <i className="fa-sharp fa-solid fa-file-pen"></i>,
      badge: "",
      title: "Mark Entry",
      key: "/mob/app",
      //key: "/mob/app/markentry",
    },
    {
      icon: <i className="fa-sharp fa-solid fa-building-circle-check"></i>,
      badge: "",
      title: "Report",
      key: "/mob/app",
      //key: "/mob/app/reports",
    },
  ];

  const setActivePath = (v) => {
    history.push(v);
  };

  return (
    <div className="">
      <TabBar
        activeKey={pathname}
        safeArea
        className="py-2"
        onChange={(v) => setActivePath(v)}
      >
        {tabs.map((item) => (
          <TabBar.Item
            key={item.key}
            icon={item.icon}
            title={item.title}
            badge={item.badge}
          />
        ))}
      </TabBar>
    </div>
  );
};

export default withRouter(FooterTab);
