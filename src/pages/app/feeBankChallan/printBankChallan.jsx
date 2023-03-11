import { Spin } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import PsContext from "../../../context";
import ModuleAccess from "../../../context/moduleAccess";
import {
  CardFixedTop,
  getAscSortOrder,
  groupByMultiple,
  printDocument,
  semesterValue,
} from "../../../utils";
import { ServiceUrl } from "../../../utils/serviceUrl";
import SearchStudent from "../feePayment/newFeePayment/searchStudent";
import Challan from "./challan";

const PrintBankChallan = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState([]);

  const [payments, setPayments] = useState([]);
  const [paid, setPaid] = useState([]);
  const [unPaid, setUnPaid] = useState([]);
  const [unPaidSource, setUnPaidSource] = useState([]);
  const [cancelled, setCancelled] = useState([]);

  const [selectedSem, setSelectedSem] = useState(0);
  useEffect(() => {
    loadPayments();
  }, [props.match.params.uuid]);

  const loadPayments = () => {
    setLoader(true);
    const form = new FormData();
    form.append("uuid", props?.match?.params?.uuid);
    form.append("type", "all");
    axios.post(ServiceUrl.FEES.CHALLAN_LIST_PAYMENT, form).then((res) => {
      if (res["data"].status == "1") {
        let d = res["data"].data;
        d = d.sort(getAscSortOrder("semester"));
        setPayments(d);
        setPaid(
          d.filter((item) => item.bill_id != null && item.is_cancelled == 0)
        );
        let ups = d.filter(
          (item) => item.bill_id == null && item.is_cancelled == 0
        );
        setUnPaid(ups);
        setUnPaidSource(ups);
        setCancelled(d.filter((item) => item.is_cancelled == 1));
      } else {
        //toast.error(res['data'].message || 'Error');
      }
      setLoader(false);
    });
  };

  const resetAll = () => {
    setSelectedStudent([]);
    setUnPaid([]);
    setPaid([]);
    setUnPaidSource([]);
    setCancelled([]);
  };

  const handlePrintclick = () => {
    printDocument("frm_print_challan");
  };

  const getSemesterData = () => {
    let x = groupByMultiple(paid, function (obj) {
      return [obj.semester, obj.bank_account_no];
    });
    return x;
  };

  const getSemesterLinks = () => {
    let rv = [];
    let x = groupByMultiple(unPaidSource, function (obj) {
      return [obj.semester];
    });
    rv.push(
      <Button
        size="sm"
        variant={selectedSem == 0 ? "secondary" : "outline-secondary"}
        onClick={(e) => setSelectedSem(0)}
      >
        All
      </Button>
    );
    x.map((item, i) => {
      rv.push(
        <Button
          size="sm"
          variant={
            selectedSem == item[0].semester ? "secondary" : "outline-secondary"
          }
          onClick={(e) => setSelectedSem(item[0].semester)}
        >
          {semesterValue(item[0].semester)}
        </Button>
      );
    });
    return rv;
  };

  useEffect(() => {
    let x = [];
    if (selectedSem == 0) x = unPaidSource;
    else {
      x = unPaidSource.filter((item) => item.semester == selectedSem);
    }
    setUnPaid(x);
  }, [selectedSem]);

  return (
    <>
      <CardFixedTop title="Bank Challan For Student Payment">
        <ul className="list-inline mb-0">
          {unPaidSource.length > 0 && (
            <li className="list-inline-item ">
              <ButtonGroup>{getSemesterLinks()}</ButtonGroup>
            </li>
          )}
          <ModuleAccess module="fee_bank_chellan_print" action="action_print">
            <li className="list-inline-item ">
              <Button
                size="sm"
                variant="transparent "
                className="border-start fs-6"
                onClick={(e) => handlePrintclick()}
                disabled={paid.length < 1}
              >
                <i className="fa-sharp fa-solid fa-print px-2"></i>Print
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item ">
            <Link
              to="/app/fee/bank-challans"
              className="btn btn-sm btn-transparent border-start fs-6"
            >
              <i className="fa-solid fa-xmark px-2"></i>Reset
            </Link>
          </li>
        </ul>
      </CardFixedTop>
      <div className="container py-3">
        <Spin spinning={loader}>
          <div id="frm_print_challan">
            {getSemesterData().map((item) => (
              <Challan dataSource={item} />
            ))}
          </div>
        </Spin>
      </div>
    </>
  );
};

export default withRouter(PrintBankChallan);
