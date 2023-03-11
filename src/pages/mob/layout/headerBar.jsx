import React, { useState, useContext, useEffect } from "react";
import {
  Redirect,
  Route,
  useHistory,
  useLocation,
  withRouter,
} from "react-router-dom";

import PsContext from "../../../context";
import { NavBar } from "antd-mobile";

const HeaderBar = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [toHome, setToHome] = useState(false);

  const backClick = () => {
    if (!props.backClick) {
      setToHome(true);
    }
    if (props.backClick) props.backClick();
  };

  if (toHome) {
    return <Redirect to="/mob/app" />;
  } else {
    return (
      <div className="fixed-top">
        <NavBar onBack={backClick} {...props}>
          <div>
            <div>{props.title}</div>
            {props.children}
          </div>
        </NavBar>
      </div>
    );
  }
};

export default withRouter(HeaderBar);
