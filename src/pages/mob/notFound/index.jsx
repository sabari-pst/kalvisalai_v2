import React, { useState, useContext, useEffect } from "react";

import { withRouter } from "react-router-dom";

import PsContext from "../../../context";

const NotFound = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  return <div className="container px-5 py-5"></div>;
};

export default withRouter(NotFound);
