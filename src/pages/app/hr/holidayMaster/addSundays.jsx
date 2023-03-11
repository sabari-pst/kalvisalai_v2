import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import { Row, Col, Card, Modal, Button, Form, Alert } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  getDaysBetweenTwoDates,
  momentDate,
  upperCase,
} from "../../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";

const AddSundays = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [sundayList, setSundayList] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!window.confirm("Do you want to save?")) return;
    setLoader(true);

    let s = [];
    sundayList.map((item) => s.push(momentDate(item, "YYYY-MM-DD")));
    const fd = new FormData();
    fd.append("sunday_list", JSON.stringify(s));
    axios.post(ServiceUrl.HR.SAVE_SUNDAYS, fd).then((res) => {
      if (res["data"].status == "1") {
        if (props.onSuccess) props.onSuccess();

        toast.success(res["data"].message || "Success");
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const loadDays = () => {
    if (fromDate.length < 1) {
      toast.error("Select from date");
      return;
    } else if (toDate.length < 1) {
      toast.error("Select to date");
      return;
    }
    let x = getDaysBetweenTwoDates(fromDate, toDate);
    setSundayList(x);
  };

  return (
    <>
      <Spin spinning={loader}>
        <Form
          method="post"
          noValidate
          validated={validated}
          id="frm_saveHrHoliday"
          onSubmit={handleFormSubmit}
        >
          <Row className="mt-1">
            <Col md={5}>
              <label className="fs-sm">
                From Date <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="date"
                name="from_date"
                className="fw-bold"
                size="sm"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={toDate}
                required
              />
            </Col>
            <Col md={5}>
              <label className="fs-sm">
                To Date <span className="text-danger">*</span>
              </label>
              <Form.Control
                type="date"
                name="to_date"
                className="fw-bold"
                size="sm"
                min={fromDate}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </Col>
            <Col md={2} className="pt-4">
              <Button type="button" size="sm" onClick={(e) => loadDays()}>
                Generate
              </Button>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <div
                className="tableFixHead ps-table"
                style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}
              >
                <table className="" width="100%">
                  <thead>
                    <tr>
                      <th>List of Sundays</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sundayList.map((item) => (
                      <tr>
                        <td>{momentDate(item, "DD/MMM/YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <div className="text-end">
                <Button type="submit" size="sm">
                  <i className="fa-solid fa-check me-2"></i>Save
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default withRouter(AddSundays);
