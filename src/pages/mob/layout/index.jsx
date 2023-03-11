import React, { useState, useContext, useEffect } from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import AOS from "aos";
import PsContext from "../../../context";

import { useIdleTimer } from "react-idle-timer";
import { aosInit } from "../../../utils/data";
import { lowerCase } from "../../../utils";
import SetMobilePassword from "../mobilePassword/setMobilePassword";
import routes from "../routes";

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
    return <Redirect to="/mob" />;
  } else if (!context.mobilePass || context.mobilePass.length < 1) {
    return <SetMobilePassword />;
  } else {
    return (
      <div className="">
        {routes.map((item) => (
          <Route {...item} />
        ))}
      </div>
    );
  }
};

export default withRouter(Layout);
