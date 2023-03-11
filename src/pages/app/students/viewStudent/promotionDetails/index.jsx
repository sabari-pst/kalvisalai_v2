import React, { useState, useEffect, useContext, useCallback } from "react";
import $, { map } from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../../context";
import { Image, Spin, Tabs } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../../utils/serviceUrl";
import { momentDate, upperCase } from "../../../../../utils";
import ModuleAccess from "../../../../../context/moduleAccess";

const PromotionDetails = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [transportLog, setTransportLog] = useState([]);
  const [transport, setTransport] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    setTransportLog([]);
    setTransport([]);

    const form = new FormData();
    form.append("uuid", props.dataSource.uuid);

    axios
      .get(
        ServiceUrl.STUDENTS.PROMOTION_DETAILS +
          "?uuid=" +
          props.dataSource.uuid,
        form
      )
      .then((res) => {
        if (res["data"].status == "1") {
          let d = res["data"].data;
          setTransportLog(d);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const studentField = (fieldName) =>
    props.dataSource &&
    props.dataSource[fieldName] &&
    props.dataSource[fieldName];

  const transportField = (fieldName) =>
    transport && transport[fieldName] && transport[fieldName];

  const deleteClick = (item) => {
    if (!window.confirm("Do you want to delete ?")) return;
    setLoader(true);
    const form = new FormData();
    form.append("uuid", item.student_uuid);
    form.append("id", item.id);
    axios.post(ServiceUrl.STUDENTS.REMOVE_PROMOTION, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        loadData();
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  return (
    <>
      <Spin spinning={loader}>
        <Card className="mt-2">
          <Card.Header className="fw-bold">Promotions</Card.Header>
          <Card.Body>
            <div className="tableFixHead">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th width="60">S.No</th>
                    <th>Date</th>
                    <th>College Year</th>
                    <th>Semester</th>
                    <th>Status</th>
                    <th width="90">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transportLog.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          {momentDate(item.promotion_date, "DD/MM//YYYY")}
                        </td>
                        <td>{upperCase(item.college_year)}</td>
                        <td>{upperCase(item.semester)}</td>
                        <td>{upperCase(item.promotion_status)}</td>
                        <td align="center">
                          {i == transportLog.length - 1 && (
                            <ModuleAccess
                              module="student_delete_promotion"
                              action="action_delete"
                            >
                              <Button
                                type="button"
                                size="sm"
                                variant="white"
                                onClick={(e) => deleteClick(item)}
                              >
                                <i className="fa fa-trash-can fs-6"></i>
                              </Button>
                            </ModuleAccess>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </Spin>
    </>
  );
};

export default withRouter(PromotionDetails);
