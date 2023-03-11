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
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  jsonToQuery,
  momentDate,
  upperCase,
} from "../../../../utils";
import { Spin, Pagination, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";
import PsOffCanvasWindow from "../../../../utils/PsOffCanvasWindow";
import { listHrGrades, liststDepartments } from "../../../../models/hr";

import AddEmployee from "./addEmployee";
import EditEmployee from "./editEmployee";
import ModuleAccess from "../../../../context/moduleAccess";
import { CustomDropDown } from "../../components";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../../utils/data";

const Employees = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [stDepartments, setStDepartments] = useState([]);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: DEFAULT_PAGE_LIST_SIZE,
    },
    total: 0,
  });

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  useEffect(() => {
    liststDepartments("1").then((res) => {
      if (res) setStDepartments(res);
    });
  }, []);

  const resetAll = () => {
    setDataView([]);
    setDataList([]);
    setViewData([]);
  };

  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    name: params.pagination?.name,
    academic_department: params.pagination?.academic_department,
    //...params,
  });

  useEffect(() => {
    if (!loader) getReport();
  }, [JSON.stringify(tableParams.pagination)]);

  const getReport = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    const form = new FormData();
    axios
      .get(
        ServiceUrl.HR.LIST_EMPLOYEES +
          "?" +
          jsonToQuery(getRandomuserParams(tableParams))
      )
      .then((res) => {
        if (res["data"].status == "1") {
          setDataList(res["data"].data);
          setDataView(res["data"].data);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: res["data"].count,
              // 200 is mock data, you should read it from server
              // total: data.totalCount,
            },
          });
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const deptListchange = (v, dept) => {
    let d = dataList;
    if (v == "0") {
      setTableParams({
        ...tableParams,
        pagination: {
          current: 1,
          pageSize: tableParams.pagination.pageSize,
          name: "",
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    } else {
      setTableParams({
        ...tableParams,
        pagination: {
          current: 1,
          pageSize: tableParams.pagination.pageSize,
          name: "",
          academic_department: v,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    }
  };

  const handleDeleteClick = (item) => {
    if (!window.confirm("Do you want to delete?")) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    form.append("uuid", item.uuid);
    axios.post(ServiceUrl.HR.REMOVE_EMPLOYEE, form).then((res) => {
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

  const handleStatusChange = (item, e) => {
    if (!window.confirm("Do you want to change status?")) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    form.append("uuid", item.uuid);
    form.append("status", e.target.checked);
    axios.post(ServiceUrl.HR.CHANGE_EMPLOYEE_STATUS, form).then((res) => {
      if (res["data"].status == "1") {
        getReport();
        toast.success(res["data"].message || "Success");
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleSearch = (e) => {
    let m = dataList.filter(
      (item) =>
        upperCase(item.emp_personal_mobile).indexOf(upperCase(e.target.value)) >
          -1 || upperCase(item.emp_name).indexOf(upperCase(e.target.value)) > -1
    );

    setDataView(m);
  };

  const handleEdit = (item) => {
    setViewData(item);
    setShowEdit(true);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      //setData([]);
    }
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      width: 70,
      align: "center",
      render: (text, record, index) =>
        tableParams.pagination.pageSize * (tableParams.pagination.current - 1) +
        index +
        1,
    },
    {
      title: "Emp.Code",
      dataIndex: "emp_code",
      width: 100,
    },
    { title: "Employee Name", dataIndex: "emp_name" },
    {
      title: "Gender",
      dataIndex: "emp_gender",
      width: 100,
      render: (text, record, index) => upperCase(record.emp_gender),
    },
    { title: "Mobile", dataIndex: "emp_personal_mobile" },
    {
      title: "Department",
      dataIndex: "emp_academic_department_name",
      render: (text, record) =>
        `${record.emp_academic_department_name} ${
          record.emp_academic_dept_type &&
          record.emp_academic_dept_type == "unaided"
            ? " - (SF)"
            : " - (R)"
        }`,
    },
    { title: "Role", dataIndex: "emp_role_name" },
    {
      title: "Manage",
      dataIndex: "id",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess module="hr_employees" action="action_update">
            <Button
              size="sm"
              variant="transparent"
              title="Edit Group"
              onClick={(e) => handleEdit(record)}
            >
              <i className="fa-solid fa-pen fs-6"></i>
            </Button>
          </ModuleAccess>
          <ModuleAccess module="hr_employees" action="action_delete">
            <Button
              size="sm"
              variant="transparent"
              title="Remove Group"
              onClick={(e) => handleDeleteClick(record)}
            >
              <i className="fa-solid fa-trash-can fs-6"></i>
            </Button>
          </ModuleAccess>
        </>
      ),
    },
  ];

  return (
    <>
      <CardFixedTop title="Employees">
        <ul className="list-inline mb-0">
          <ModuleAccess module="hr_employees" action="action_create">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => setShowAdd(true)}
              >
                <i className="fa fa-plus fs-7 px-1"></i> New Employee
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={getReport}
            >
              <i className="fa fa-rotate fs-7 px-1"></i> Refresh
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container">
        <Row className="mt-3">
          <Col md={3}>
            <CustomDropDown
              dataSource={stDepartments}
              displayField={(item) =>
                `${item.department} - (${
                  item.dept_type == "aided" ? "R" : "SF"
                })`
              }
              onChange={deptListchange}
              defaultOption={true}
            />
          </Col>
          <Col md={4}>
            <InputGroup size="sm">
              <Form.Control
                size="sm"
                placeholder="Search by Employee Name, Employee Code, Mobile"
                //onChange={e => handleSearch(e)}
                onChange={(e) =>
                  ((e.target.value.length > 2 &&
                    e.target.value.length % 2 == 0) ||
                    e.target.value.length < 1) &&
                  setTableParams({
                    ...tableParams,
                    pagination: {
                      current: 1,
                      pageSize: tableParams.pagination.pageSize,
                      name: e.target.value,
                      // 200 is mock data, you should read it from server
                      // total: data.totalCount,
                    },
                  })
                }
              />
              <InputGroup.Text>
                <i className="fa-solid fa-magnifying-glass"></i>
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col md={5}>
            <div className="text-end fs-sm fw-bold">
              Total no of Employees : {tableParams.pagination.total || 0}
            </div>
          </Col>
          <Col md={12} className="mt-2">
            <Card>
              <Card.Body className="">
                <Table
                  bordered={true}
                  size="small"
                  columns={columns}
                  rowKey={(record) => record.id}
                  dataSource={dataView}
                  pagination={tableParams.pagination}
                  loading={loader}
                  onChange={handleTableChange}
                  scroll={{ y: "calc(100vh - 250px)" }}
                  rowClassName={(record, index) =>
                    record.active_status == "0" ? "bg-red-50" : ""
                  }
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <PsOffCanvasWindow
        title="New Employee"
        onHide={(e) => setShowAdd(false)}
        show={showAdd}
        size="lg"
      >
        <AddEmployee onSuccess={(e) => getReport()} />
      </PsOffCanvasWindow>

      <PsOffCanvasWindow
        title="Edit Employee"
        onHide={(e) => setShowEdit(false)}
        show={showEdit}
        size="lg"
      >
        <EditEmployee
          dataSource={viewData}
          onSuccess={(e) => {
            setShowEdit(false);
            setViewData([]);
            getReport();
          }}
        />
      </PsOffCanvasWindow>
    </>
  );
};

export default withRouter(Employees);
