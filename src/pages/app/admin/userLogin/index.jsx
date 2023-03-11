import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { useHistory, withRouter, Link } from "react-router-dom";

import PsContext from "../../../../context";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Spin, Tabs } from "antd";
import { capitalizeFirst, CardFixedTop, upperCase } from "../../../../utils";
import PsModalWindow from "../../../../utils/PsModalWindow";
import PsOffCanvasWindow from "../../../../utils/PsOffCanvasWindow";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import toast from "react-hot-toast";
import NewUserLogin from "./newUserLogin";
import { listUserLogins } from "../../../../models/users";
import EditUserLogin from "./editUserLogin";
import UserRoleAccess from "../../settings/userRoles/userRoleAccess";
import ModuleAccess from "../../../../context/moduleAccess";

const UserLogin = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [accessModal, setAccessModal] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    listUserLogins().then((res) => {
      if (res) {
        setDataList(res);
        setDataView(res);
      }
      setLoader(false);
    });
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to delete")) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    form.append("emp_code", item.employee_code);
    form.append("status", item.active_status);
    axios.post(ServiceUrl.ADMISSION.REMOVE_USER_LOGIN, form).then((res) => {
      if (res["data"].status == "1") {
        let m = dataList.filter((obj) => obj.id != item.id);
        setDataList(m);
        setDataView(m);
        toast.success(res["data"].message || "Success");
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleEdit = (item) => {
    setViewData(item);
    setEdit(true);
  };

  const handleSearch = (e) => {
    let v = upperCase(e.target.value);
    let m = dataList.filter(
      (item) =>
        upperCase(item.user_name).indexOf(v) > -1 ||
        upperCase(item.employee_name).indexOf(v) > -1
    );
    setDataView(m);
  };

  const handleStatusChange = (item) => {
    let msg =
      item.active_status == "1"
        ? "Do you want to Inactive user login?"
        : "Do you want to activate user login?";
    if (!window.confirm(msg)) {
      return;
    }
    setLoader(true);
    setEdit(false);
    const form = new FormData();
    form.append("id", item.id);
    form.append("emp_code", item.employee_code);
    form.append("field_name", "active_status");
    form.append("field_value", item.active_status == "1" ? "0" : "1");
    axios.post(ServiceUrl.ADMISSION.USER_STATUS_CHANGE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        loadData();
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleAccessUpdate = (item) => {
    setViewData(item);
    setAccessModal(true);
  };

  return (
    <>
      <CardFixedTop title="User Login">
        <ul className="list-inline mb-0">
          <ModuleAccess module="settings_user_login" action="action_create">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => setAdd(true)}
              >
                <i className="fa fa-plus fs-6 px-1"></i> New
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={loadData}
            >
              <i className="fa fa-rotate fs-6 px-1"></i> Refresh
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container">
        <Row className="mt-2">
          <Col md={3}>
            <Form.Control
              type="text"
              size="sm"
              placeholder="Search here"
              className="fw-bold"
              onChange={handleSearch}
            />
          </Col>
          <Col md={9}>
            <div className="text-end fs-sm fw-bold">
              Total no of Users : {dataView.length}
            </div>
          </Col>
        </Row>
        <Spin spinning={loader}>
          <Card className="mt-2">
            <Card.Body className="px-0 py-0">
              <div
                className="tableFixHead"
                style={{ maxHeight: "calc(100vh - 158px)" }}
              >
                <table>
                  <thead>
                    <tr>
                      <th width="50">S.No</th>
                      <th>User Name</th>
                      <th>Emp. Code</th>
                      <th>Employee Name</th>
                      <th>Role</th>
                      <th>Last Login</th>
                      <th className="text-center" width="120">
                        Status
                      </th>
                      <th className="text-center" width="120">
                        #
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataView.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className={
                            item.active_status == "0" ? "text-danger" : ""
                          }
                        >
                          <td>{i + 1}</td>
                          <td>{item.username}</td>
                          <td>{item.employee_code}</td>
                          <td>{item.employee_name}</td>
                          <td>{capitalizeFirst(item.role_name)}</td>
                          <td>{item.last_login}</td>
                          <td align="center">
                            <Form.Check
                              type="switch"
                              id="custom-switch"
                              className="check-input-lg"
                              checked={item.active_status == "1"}
                              onChange={(e) => handleStatusChange(item)}
                            />
                          </td>
                          <td align="center">
                            <ModuleAccess
                              module="settings_user_roles"
                              action="action_update"
                            >
                              <Button
                                size="sm"
                                variant="transparent"
                                title="Edit Access"
                                onClick={(e) => handleAccessUpdate(item, e)}
                              >
                                <i className="fa-regular fa-rectangle-list"></i>
                              </Button>
                            </ModuleAccess>
                            <ModuleAccess
                              module="settings_user_login"
                              action="action_update"
                            >
                              <Button
                                size="sm"
                                variant="transparent"
                                className="me-1"
                                title="Edit"
                                onClick={(e) => handleEdit(item)}
                              >
                                <i className="fa-solid fa-eye fs-6"></i>
                              </Button>
                            </ModuleAccess>
                            <ModuleAccess
                              module="settings_user_login"
                              action="action_delete"
                            >
                              <Button
                                size="sm"
                                variant="transparent"
                                className="me-1"
                                title="Delete"
                                onClick={(E) => handleDelete(item)}
                              >
                                <i className="fa-solid fa-trash-can fs-6"></i>
                              </Button>
                            </ModuleAccess>
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
      </div>

      <PsModalWindow
        title="Add User Login"
        size="sm"
        show={add}
        onHide={(e) => setAdd(false)}
        size="md"
      >
        <NewUserLogin onSuccess={loadData} />
      </PsModalWindow>

      <PsOffCanvasWindow
        title="Edit User Login"
        size="sm"
        show={edit}
        onHide={(e) => setEdit(false)}
        size="md"
      >
        <EditUserLogin
          dataSource={viewData}
          onStatusChange={(i) => handleStatusChange(i)}
          onSuccess={(e) => {
            setEdit(false);
            setViewData([]);
            loadData();
          }}
        />
      </PsOffCanvasWindow>

      {accessModal && (
        <UserRoleAccess
          title="Edit User Role & Access"
          size="lg"
          userPermission={true}
          show={accessModal}
          onSuccess={(e) => {
            setAccessModal(false);
          }}
          onHide={(e) => setAccessModal(false)}
          dataSource={viewData}
        />
      )}
    </>
  );
};

export default withRouter(UserLogin);
