import React, { useState, useContext, useEffect } from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import AOS from "aos";
import PsContext from "../../../context";

import Header from "./header";
import Sidebar from "./sidebar";
import routes from "../routes";
import { lowerCase } from "../../../utils";
import { aosInit } from "../../../utils/data";

import { useIdleTimer } from "react-idle-timer";
import ModuleAccess from "../../../context/moduleAccess";

import MobileLayout from "../../mob/layout";
import LockScreenPass from "../../login/lockScreenPass";

const Layout = (props) => {
  const context = useContext(PsContext);

  const onIdle = () => {
    context.logout();
  };

  const idleTimer = useIdleTimer({ onIdle, timeout: 1000 * 60 * 5 });
  const role = lowerCase(context.user.role);

  useEffect(() => {
    AOS.init(aosInit);
    AOS.refresh();
    context.loadSettings();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [props.location.pathname]);

  if (context.logged != "yes") {
    return <Redirect to="/" />;
  } /*else if (context.isMobileView()) {
    return <MobileLayout />;
  }*/ else {
    return (
      <div className="">
        <div className="page-wrapper">
          <Header />

          <Sidebar role={role} />

          <div className="content-wrapper" data-aos="fade-up">
            {routes.map((item) => (
              <ModuleAccess module={item.module} action={item.action}>
                <Route {...item} />
              </ModuleAccess>
            ))}
          </div>
        </div>

        {/*<LockScreenPass />

        <div className="bottom_news_scroll"></div>*/}
      </div>
    );
  }
};

export default withRouter(Layout);
