import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  Alert,
  ListGroup,
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import { capitalizeFirst, CardFixedTop, upperCase } from "../../../../utils";
import { Divider, Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { listUserRoles } from "../../../../models/users";
import { listCashbooks } from "../../../../models/settings";
import UserNaacCriterians from "./userNaacCriterians";

const EditUserLogin = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(false);

  const [userRoles, setUserRoles] = useState([]);

  const [cashbooks, setCashbooks] = useState([]);

  const [showRoleEdit, setShowRoleEdit] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const [showCashbookEdit, setShowCashbookEdit] = useState(false);
  const [selectedCashbook, setSelectedCashbook] = useState("");

  useEffect(() => {
    loadRoles();
    listCashbooks("1").then((res) => res && setCashbooks(res));
  }, []);

  const loadRoles = () => {
    setLoader(true);
    listUserRoles(1).then((res) => {
      if (res) setUserRoles(res);
      setLoader(false);
    });
  };

  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
  };

  const showPassClick = () => {
    setLoader(true);
    const form = new FormData();
    form.append("id", field("id"));
    axios.post(ServiceUrl.ADMISSION.PASS_USER_LOGIN, form).then((res) => {
      if (res["data"].status == "1") {
        setCurrentPassword(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const getRoleName = () => {
    let m = userRoles.find((item) => item.id == field("role_uid"));
    if (m) return m.role_name;
  };

  const getCashbookName = () => {
    let m = cashbooks.find((item) => item.id == field("allowd_cash_books"));
    if (m) return m.cashbook_name;
  };

  const handleStatusChange = (fName) => {
    if (!window.confirm("Do you want to change access")) {
      return;
    }
    setLoader(true);

    const form = new FormData();
    form.append("id", field("id"));
    form.append("emp_code", field("employee_code"));
    form.append("field_name", fName);
    form.append("field_value", field(fName) == "1" ? "0" : "1");
    axios.post(ServiceUrl.ADMISSION.USER_STATUS_CHANGE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        if (props.onSuccess) props.onSuccess();
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleUpdateRoleClick = () => {
    if (!window.confirm("Do you want to change Role")) {
      return;
    }
    setLoader(true);

    const form = new FormData();
    form.append("id", field("id"));
    form.append("emp_code", field("employee_code"));

    form.append("field_name", "role_uid");
    form.append("field_value", selectedRole);
    axios.post(ServiceUrl.ADMISSION.USER_STATUS_CHANGE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        if (props.onSuccess) props.onSuccess();
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleUpdateCashbookClick = () => {
    if (!window.confirm("Do you want to change Cashbook Access")) {
      return;
    }
    setLoader(true);

    const form = new FormData();
    form.append("id", field("id"));
    form.append("emp_code", field("employee_code"));

    form.append("field_name", "allowd_cash_books");
    form.append("field_value", selectedCashbook);
    axios.post(ServiceUrl.ADMISSION.USER_STATUS_CHANGE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        if (props.onSuccess) props.onSuccess();
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
          <Card.Header className="fw-bold">Login Details</Card.Header>
          <Card.Body>
            <ListGroup>
              <ListGroup.Item className="border-bottom">
                Username
                <div className="float-end">
                  <b>{field("username")}</b>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="border-bottom">
                Employee Code
                <div className="float-end">
                  <b>{field("employee_code")}</b>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="border-bottom">
                Employee Name
                <div className="float-end">
                  <b>{field("employee_name")}</b>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="border-bottom">
                Password
                <div className="float-end">
                  <b>
                    <Button
                      size="sm"
                      variant="transparent"
                      className="me-2"
                      onClick={(e) => showPassClick()}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </Button>
                    {currentPassword || "******"}
                  </b>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="border-bottom">
                <span className="float-start">Status</span>
                <div className="text-end">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    className="check-input-lg"
                    checked={field("active_status") == "1"}
                    onChange={(e) => props.onStatusChange(props.dataSource)}
                  />
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header className="fw-bold">Role & Access</Card.Header>
          <Card.Body>
            <ListGroup>
              <ListGroup.Item className="border-bottom">
                Role
                <div className="float-end">
                  {!showRoleEdit && (
                    <b>
                      <Button
                        size="sm"
                        variant="transparent"
                        className="me-2"
                        onClick={(e) => setShowRoleEdit(true)}
                      >
                        <i className="fa-solid fa-edit"></i>
                      </Button>
                      {getRoleName()}
                    </b>
                  )}
                  {showRoleEdit && (
                    <div>
                      <InputGroup>
                        <Form.Control
                          as="select"
                          name="role_uid"
                          className="fw-bold form-select form-select-sm"
                          size="sm"
                          onChange={(e) => setSelectedRole(e.target.value)}
                        >
                          {userRoles.map((item) => (
                            <option
                              selected={
                                item.id == field("role_uid") ? "selected" : ""
                              }
                              value={item.id}
                            >
                              {item.role_name}
                            </option>
                          ))}
                        </Form.Control>
                        <InputGroup.Text className="px-0 py-0">
                          <Button
                            type="button"
                            size="sm"
                            variant="success"
                            onClick={(e) => handleUpdateRoleClick()}
                            disabled={
                              !selectedRole || selectedRole == field("role_uid")
                            }
                          >
                            <i className="fa-solid fa-check"></i>
                          </Button>
                        </InputGroup.Text>
                        <InputGroup.Text className="px-0 py-0">
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            onClick={(e) => setShowRoleEdit(false)}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </Button>
                        </InputGroup.Text>
                      </InputGroup>
                    </div>
                  )}
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="border-bottom">
                <span className="float-start">
                  Allow to access Aided (Regular) Informations
                </span>
                <div className="text-end">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    className="check-input-lg"
                    checked={field("allow_aided") == "1"}
                    onChange={(e) => handleStatusChange("allow_aided")}
                  />
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="border-bottom">
                <span className="float-start">
                  Allow to access Un-Aided (Self) Informations
                </span>
                <div className="text-end">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    className="check-input-lg"
                    checked={field("allow_unaided") == "1"}
                    onChange={(e) => handleStatusChange("allow_unaided")}
                  />
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header className="fw-bold">Cash Book</Card.Header>
          <Card.Body>
            <ListGroup>
              <ListGroup.Item>
                Allowed Cashbook
                <div className="float-end">
                  {!showCashbookEdit && (
                    <b>
                      <Button
                        size="sm"
                        variant="transparent"
                        className="me-2"
                        onClick={(e) => setShowCashbookEdit(true)}
                      >
                        <i className="fa-solid fa-edit"></i>
                      </Button>
                      {getCashbookName()}
                    </b>
                  )}
                  {showCashbookEdit && (
                    <div>
                      <InputGroup>
                        <Form.Control
                          as="select"
                          name="role_uid"
                          className="fw-bold form-select form-select-sm"
                          size="sm"
                          onChange={(e) => setSelectedCashbook(e.target.value)}
                        >
                          <option value="0">None</option>
                          {cashbooks.map((item) => (
                            <option
                              selected={
                                item.id == field("allowd_cash_books")
                                  ? "selected"
                                  : ""
                              }
                              value={item.id}
                            >
                              {item.cashbook_name}
                            </option>
                          ))}
                        </Form.Control>
                        <InputGroup.Text className="px-0 py-0">
                          <Button
                            type="button"
                            size="sm"
                            variant="success"
                            onClick={(e) => handleUpdateCashbookClick()}
                            disabled={
                              !selectedCashbook ||
                              selectedCashbook == field("allowd_cash_books")
                            }
                          >
                            <i className="fa-solid fa-check"></i>
                          </Button>
                        </InputGroup.Text>
                        <InputGroup.Text className="px-0 py-0">
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            onClick={(e) => setShowCashbookEdit(false)}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </Button>
                        </InputGroup.Text>
                      </InputGroup>
                    </div>
                  )}
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        <Card className="mt-3">
          <Card.Header className="fw-bold">
            NAAC - Allowed Criterians
          </Card.Header>
          <Card.Body>
            <UserNaacCriterians {...props} />
          </Card.Body>
        </Card>
      </Spin>
    </>
  );
};

export default withRouter(EditUserLogin);
