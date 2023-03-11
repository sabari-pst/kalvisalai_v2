import React, { useState, useEffect, useContext, useCallback } from "react";

import { Spinner } from "react-bootstrap";

import PsContext from "../../../../context";

import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";

const TodayFeeCollection = (props) => {
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
      <div className="widget-flat card ">
        <div className="card-body bg-orange-100">
          <div className="float-end">
            <i className="fa-solid fa-wallet fs-3 "></i>
          </div>
          <h5 className="fw-normal mt-0 text-muted" title="Students">
            Today Fee Collection
          </h5>
          <h3 className="mt-3 mb-3">
            {loader && <Spinner animation="grow" size="sm" variant="light" />}
            {!loader && getCount("today_fee_collection")}
          </h3>
          {/*
              <p class="mb-0 text-muted">
                  <span class="text-success me-2">
                      <i class="mdi mdi-arrow-up-bold"></i> 5.27%
                  </span>
                  <span class="text-nowrap">Since last month</span>
              </p>
              */}
        </div>
      </div>
    </>
  );
};

export default TodayFeeCollection;
