import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../../context";
import { CardFixedTop, upperCase } from "../../../../utils";
import { Spin } from "antd";

import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";
import DepartmentCmsLayout from "../departmentCmsLayout";
import { listAllCoursesV2 } from "../../../../models/courses";

const DeptCoursesList = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  useEffect(() => {
    if (context.user.academic_department) listData();
  }, [context.user.academic_department]);

  const listData = () => {
    setLoader(true);
    listAllCoursesV2(
      "&academic_department=" + context.user.academic_department
    ).then((res) => {
      if (res) {
        setDataList(res);
      }
      setLoader(false);
    });
  };

  return (
    <DepartmentCmsLayout>
      <CardFixedTop title="Course List"></CardFixedTop>
      <div className="container py-3">
        <Spin spinning={loader}>
          <div className="tableFixHead ps-table">
            <table>
              <thead>
                <tr>
                  <th width="90">S.No</th>
                  <th>Course Type</th>
                  <th>Course Name</th>
                  <th>Short Name</th>
                  <th>Medium</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{upperCase(item.academic_dept_type)}</td>
                      <td>
                        {item.degreename}-{item.name} - (
                        {item.dept_type == "aided" ? "R" : "SF"})
                      </td>
                      <td>{item.shortname}</td>
                      <td>{item.medium}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Spin>
      </div>
    </DepartmentCmsLayout>
  );
};

export default withRouter(DeptCoursesList);
