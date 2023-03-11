import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import {
  Badge,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";

import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  upperCase,
} from "../../../../utils";

import axios from "axios";
import { formatCountdown } from "antd/lib/statistic/utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { listUserRoles } from "../../../../models/users";
import { Spin } from "antd";

import NewRoleModule from "./newRoleModule";

const AccessModules = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [accessModal, setAccessModal] = useState(false);
  const [addModule, setAddModule] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);

  const [rowId, setRowId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    axios.get(ServiceUrl.SETTINGS.LIST_ROLE_ACCESS).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        let s = groupByMultiple(res["data"].data, function (obj) {
          return [obj.role_group];
        });
        setDataView(s);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to delete?")) {
      return false;
    }

    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    axios.post(ServiceUrl.SETTINGS.DELETE_ROLE_MODULE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        let s = dataList.filter((obj) => obj.id !== item.id);
        let m = groupByMultiple(s, function (obj) {
          return [obj.role_group];
        });
        setDataList(s);
        setDataView(m);
      } else toast.error(res["data"].message || "Error");

      setLoader(false);
    });
  };

  const checkInput = (item, actionName, checked = false) => {
    return (
      <Form.Check
        type="checkbox"
        checked={checked}
        onChange={(e) => updateModuleAccess(item, actionName, e)}
      />
    );
  };

  const listRows = (items) => {
    var tr = [];
    items.map((item, i) => {
      tr.push(
        <tr>
          <td width="50">{i + 1}</td>
          <td>
            {item.role_description}
            <br /> {item.role_id}
          </td>
          <td width="70" align="center">
            {checkInput(item, "action_create", item.action_create == "1")}
          </td>
          <td width="70" align="center">
            {checkInput(item, "action_list", item.action_list == "1")}
          </td>
          <td width="70" align="center">
            {checkInput(item, "action_read", item.action_read == "1")}
          </td>
          <td width="70" align="center">
            {checkInput(item, "action_update", item.action_update == "1")}
          </td>
          <td width="70" align="center">
            {checkInput(item, "action_delete", item.action_delete == "1")}
          </td>
          <td width="70" align="center">
            {checkInput(item, "action_print", item.action_print == "1")}
          </td>
          <td width="70" align="center">
            {checkInput(item, "action_export", item.action_export == "1")}
          </td>
          <td width="50" align="center">
            <Button
              size="sm"
              variant="transparent"
              title="Delete"
              onClick={(e) => handleDelete(item)}
            >
              <i className="fa-regular fa-trash-can"></i>
            </Button>
          </td>
        </tr>
      );
    });
    return <table width="100%">{tr}</table>;
  };

  const arrowButtonClick = (rid) => {
    if (rowId == rid) setRowId("");
    else setRowId(rid);
  };

  const updateModuleAccess = (item, actionName, e) => {
    if (!window.confirm("Do you want to update?")) return;
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    form.append("role_id", item.role_id);
    form.append("action_name", actionName);
    form.append("action_value", e.target.checked ? "1" : "0");
    axios.post(ServiceUrl.SETTINGS.UPDATE_ROLE_MODULE, form).then((res) => {
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
      <CardFixedTop title="Access Modules">
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Button
              type="button"
              variant="white"
              className="border-start ms-2"
              onClick={() => setAddModule(true)}
            >
              <i className="fa-solid fa-user-plus pe-1"></i> New Module
            </Button>
          </li>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={(e) => loadData()}
            >
              <i className="fa fa-rotate fs-5 px-1"></i>
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container mt-2">
        <Row className="mt-2">
          <Col md={12}>
            <Spin spinning={loader}>
              <div className="tableFixHead bg-white">
                <table>
                  <thead>
                    <tr>
                      <th width="60">S.No</th>
                      <th>Module</th>
                      <th width="70" className="text-center">
                        Create
                      </th>
                      <th width="70" className="text-center">
                        List
                      </th>
                      <th width="70" className="text-center">
                        Read
                      </th>
                      <th width="70" className="text-center">
                        Update
                      </th>
                      <th width="70" className="text-center">
                        Delete
                      </th>
                      <th width="70" className="text-center">
                        Print
                      </th>
                      <th width="70" className="text-center">
                        Export
                      </th>
                      <th width="50" className="text-center">
                        #
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataView.map((items, i) => {
                      let item = items[0];
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td colSpan={9}>
                            <Button
                              type="button"
                              size="xs"
                              variant="transparent"
                              className="float-start me-2"
                              onClick={(e) => arrowButtonClick(item.id)}
                            >
                              {rowId == item.id ? (
                                <i className="fa-solid fa-angle-down"></i>
                              ) : (
                                <i className="fa-solid fa-chevron-right"></i>
                              )}
                            </Button>
                            <b>{item.role_group}</b>
                            {rowId == item.id && listRows(items)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Spin>
          </Col>
        </Row>
      </div>

      {addModule && (
        <NewRoleModule
          title="Add User Role Modules"
          size="md"
          show={addModule}
          onSuccess={(e) => loadData()}
          onHide={(e) => setAddModule(false)}
        />
      )}
    </>
  );
};

export default AccessModules;
