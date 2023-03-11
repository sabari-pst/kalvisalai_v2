import React, { useState, useEffect, useContext, useCallback } from "react";
import { Spinner } from "react-bootstrap";

import PsContext from "../../../../context";

import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";

const MonthFeeCollection = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);

  const [count, setCount] = useState([]);

  useEffect(() => {
    loadCount();
  }, []);

  const loadCount = () => {
    setLoader(true);
    axios.get(ServiceUrl.DASHBOARD.FIRST_LINE_COUNT).then((res) => {
      if (res["data"].status == "1") {
        setCount(res["data"].data);
      }
      setLoader(false);
    });
  };

  const getCount = (fieldName) => {
    if (count && count[fieldName]) return count[fieldName];
    else return "0";
  };

  return (
    <>
      <div className="widget-flat card bg-teal-50">
        <div className="card-body">
          <div className="float-end">
            <i className="fa-solid fa-wallet fs-3"></i>
          </div>
          <h5 className="fw-normal mt-0 text-muted" title="Students">
            This Month{" "}
          </h5>
          <h3 className="mt-3 mb-3">
            {loader && <Spinner animation="grow" size="sm" variant="light" />}
            {!loader && getCount("month_fee_collection")}
          </h3>
        </div>
      </div>
    </>
  );
};

export default MonthFeeCollection;
