import { Spin } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import PsContext from "../../../context";
import NewFeePayment from "../feePayment/newFeePayment";
import CashbookLayout from "../selectCashbook/cashbookLayout";

const FeeBankChallan = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (context.cashbook.id) {
    }
  }, [JSON.stringify(context.cashbook)]);

  return (
    <>
      <CashbookLayout>
        <NewFeePayment bankChallan={true} />
      </CashbookLayout>
    </>
  );
};

export default withRouter(FeeBankChallan);
