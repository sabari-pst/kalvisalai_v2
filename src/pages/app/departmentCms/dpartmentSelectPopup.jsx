import { Spin } from "antd";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button } from "react-bootstrap";

import { withRouter } from "react-router-dom";

import PsContext from "../../../context";
import { liststDepartments } from "../../../models/hr";
import { customSorting, groupByMultiple, upperCase } from "../../../utils";
import PsModalWindow from "../../../utils/PsModalWindow";

const DpartmentSelectPopup = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [stDepartments, setStDepartments] = useState([]);

  const [academicDepartment, setAcademicDepartment] = useState(
    context.user?.academic_department
  );

  useEffect(() => {
    setLoader(true);
    liststDepartments("1").then((res) => {
      if (res) setStDepartments(res);
      setLoader(false);
    });
  }, []);

  const listData = () => {
    let m = customSorting(stDepartments, ["aided", "unaided"], "dept_type");

    m = groupByMultiple(m, function (obj) {
      return [obj.dept_type];
    });
    let rv = [];
    m.map((item) => {
      rv.push(
        <div>
          <b>{upperCase(item[0].dept_type)}</b>
          <hr />
        </div>
      );
      rv.push(<ul>{innerData(item)}</ul>);
    });
    return rv;
  };

  const innerData = (items) => {
    return items.map((item) => (
      <li className="py-2 border-bottom">
        {upperCase(item.department)} - ({item.dept_type == "aided" ? "R" : "SF"}
        )
        {context.allowedAccess(
          "allow_to_view_multiple_dept_cms",
          "action_update"
        ) && (
          <div className="float-end">
            <Button type="button" size="sm" onClick={(e) => deptClick(item)}>
              Select
            </Button>
          </div>
        )}
      </li>
    ));
  };

  const deptClick = (item) => {
    let m = context.user;

    m.academic_department = item.id;
    m.academic_department_name = item.department;
    m.academic_department_type = item.dept_type;
    context.updateUser(m);
    setAcademicDepartment(item.id);
    if (props.onHide) props.onHide();
  };

  return (
    <>
      <PsModalWindow
        size="md"
        show={props.show}
        onHide={(e) => props.onHide()}
        title="Select Department"
      >
        <Spin spinning={loader}>
          <div style={{ minHeight: "calc(100vh - 250px)" }}>{listData()}</div>
        </Spin>
      </PsModalWindow>
    </>
  );
};

export default withRouter(DpartmentSelectPopup);
