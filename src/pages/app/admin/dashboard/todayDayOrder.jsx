import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Badge } from "react-bootstrap";
import PsContext from "../../../../context";
import { timeTableDayFromNumber } from "../../../../utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";

const TodayDayOrder = (props) => {
  const context = useContext(PsContext);
  const [day, setDay] = useState("");
  const [loader, setLoader] = useState(false);

  let dayOrderInDayName = context.settingValue(
    "attendance_dayorder_as_day_name"
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    axios.get(ServiceUrl.DASHBOARD.TODAY_DAY_ORDER).then((res) => {
      if (res["data"].status == "1") {
        setDay(res["data"].data);
      }
      setLoader(false);
    });
  };
  return (
    <>
      {day && (
        <>
          Day Order : <b>{timeTableDayFromNumber(day, dayOrderInDayName)}</b>
        </>
      )}
    </>
  );
};
export default TodayDayOrder;
