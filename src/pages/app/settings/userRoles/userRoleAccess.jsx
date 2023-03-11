import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import { Button, ButtonGroup, Col, Form, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";

import {
  capitalizeFirst,
  CardFixedTop,
  getAscSortOrder,
  groupByMultiple,
} from "../../../../utils";
import { Spin } from "antd";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsOffCanvasWindow from "../../../../utils/PsOffCanvasWindow";

const UserRoleAccess = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [validated, setValidated] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [roleAccess, setRoleAccess] = useState([]);

  useEffect(() => {
    loadData();
    loadPermissions();
  }, []);

  const loadData = () => {
    setLoader(true);
    axios.get(ServiceUrl.SETTINGS.LIST_ROLE_ACCESS).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        let d = res["data"].data.sort(getAscSortOrder("role_group"));
        d = groupByMultiple(d, function (obj) {
          return [obj.role_group];
        });
        setDataView(d);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const loadPermissions = () => {
    setLoader(true);
    let rid = props.userPermission
      ? props.dataSource.role_uid
      : props.dataSource.id;
    let uid = props.userPermission ? props.dataSource.id : 0;
    axios
      .get(
        ServiceUrl.SETTINGS.LIST_ROLE_PERMISSIONS +
          "?role_id=" +
          rid +
          "&user_uid=" +
          uid
      )
      .then((res) => {
        if (res["data"].status == "1") {
          setRoleAccess(res["data"].data);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setLoader(true);
    const frm = new FormData();

    frm.append(
      "role_id",
      props.userPermission ? props.dataSource.role_uid : props.dataSource.id
    );
    frm.append("permissions", JSON.stringify(roleAccess));

    axios.post(ServiceUrl.SETTINGS.UPDATE_ROLE_ACCESS, frm).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        if (props.onSuccess) props.onSuccess();
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const field = (fieldName) => {
    if (props.dataSource && props.dataSource[fieldName])
      return props.dataSource[fieldName];
  };

  const updateUserAccess = (item, fieldName, type) => {
    setLoader(true);
    const form = new FormData();
    form.append("user_uid", props.dataSource.id);
    form.append("module_uid", item.id);
    form.append("action_name", fieldName);
    form.append("action_status", type);
    axios.post(ServiceUrl.SETTINGS.UPDATE_USER_ACCESS, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const updateRoleAccess = (item, fieldName, e) => {
    //let v = e.target.checked ? '1' : '0';
    let ra = [...roleAccess];
    let index = ra.findIndex(
      (obj) => obj.module_uid == item.id && obj.action_name == fieldName
    );
    if (index > -1) {
      if (ra[index]["status"] == "0") ra[index]["status"] = 1;
      else ra[index]["status"] = 0;

      if (props.userPermission) updateUserAccess(item, fieldName, "deny");

      setRoleAccess(ra);
    } else {
      let m = dataList.find((obj) => obj.role_id == item.role_id);
      if (m) {
        ra.push({
          module_uid: item.id,
          action_name: fieldName,
          status: 1,
        });
      }

      if (props.userPermission) updateUserAccess(item, fieldName, "allow");

      setRoleAccess(ra);
    }
  };

  const checkAccessEnabled = (item, fieldName) => {
    let ra = [...roleAccess];
    let v = ra.find(
      (obj) => obj.module_uid == item.id && obj.action_name == fieldName
    );
    return v && v.status == "1" ? true : false;
  };

  const checkField = (item, fieldName) => {
    return item[fieldName] == "1" ? (
      <input
        type="checkbox"
        checked={checkAccessEnabled(item, fieldName)}
        onChange={(e) => updateRoleAccess(item, fieldName, e)}
      />
    ) : (
      ""
    );
  };
  const rolesList = (items) => {
    return items.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.role_description}</td>
          <td width="70" align="center">
            {checkField(item, "action_create")}
          </td>
          <td width="70" align="center">
            {checkField(item, "action_list")}
          </td>
          <td width="70" align="center">
            {checkField(item, "action_read")}
          </td>
          <td width="70" align="center">
            {checkField(item, "action_update")}
          </td>
          <td width="70" align="center">
            {checkField(item, "action_delete")}
          </td>
          <td width="70" align="center">
            {checkField(item, "action_print")}
          </td>
          <td width="70" align="center">
            {checkField(item, "action_export")}
          </td>
        </tr>
      );
    });
  };
  const rolesUnderGroup = (items) => {
    return (
      <tr>
        <td colSpan={8}>
          <table className="table table-sm table-bordered bg-white">
            <thead>
              <tr>
                <th colSpan={8}>{items[0].role_group}</th>
              </tr>
            </thead>
            <tbody>{rolesList(items)}</tbody>
          </table>
        </td>
      </tr>
    );
  };

  return (
    <>
      <PsOffCanvasWindow {...props}>
        <Spin spinning={loader}>
          <Form
            noValidate
            validated={validated}
            action=""
            method="post"
            id="frm_UpdateUserRole"
            onSubmit={handleFormSubmit}
          >
            {props.userPermission ? (
              <input type="hidden" name="id" value={field("role_uid")} />
            ) : (
              <input type="hidden" name="id" value={field("id")} />
            )}

            <Row>
              <Col md={3}>
                <label>
                  Name of the Role <span className="text-danger"></span>
                </label>
              </Col>
              <Col md={9}>
                <Form.Control
                  type="text"
                  size="sm"
                  className="fw-bold"
                  name="role_name"
                  defaultValue={field("role_name")}
                  readOnly
                  required
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <table className="table table-sm table-bordered">
                  <thead
                    className="bg-light"
                    style={{ position: "sticky", top: "-15px" }}
                  >
                    <tr>
                      <th>Module</th>
                      <th width="70" align="center" className="text-center">
                        Create
                      </th>
                      <th width="70" align="center" className="text-center">
                        List
                      </th>
                      <th width="70" align="center" className="text-center">
                        Read
                      </th>
                      <th width="70" align="center" className="text-center">
                        Update
                      </th>
                      <th width="70" align="center" className="text-center">
                        Delete
                      </th>
                      <th width="70" align="center" className="text-center">
                        Print
                      </th>
                      <th width="70" align="center" className="text-center">
                        Export
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataView.map((items, i) => rolesUnderGroup(items))}
                  </tbody>
                </table>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <div className="text-end">
                  <a
                    className="border-end pe-2 me-3 fs-10"
                    onClick={(e) => props.onHide && props.onHide()}
                  >
                    <u>Cancel</u>
                  </a>
                  {!props.userPermission && (
                    <LoaderSubmitButton loading={loader} text="Update Access" />
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </PsOffCanvasWindow>
    </>
  );
};

export default UserRoleAccess;
