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

import PsContext from "../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  customSorting,
  groupByMultiple,
  jsonToQuery,
  momentDate,
  upperCase,
} from "../../../utils";
import { Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../utils/serviceUrl";
import PsModalWindow from "../../../utils/PsModalWindow";

import { CustomDropDown } from "../components/";
import { liststDepartments, listsubject } from "../../../models/hr";

import ModuleAccess from "../../../context/moduleAccess";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../utils/data";
import PsOffCanvasWindow from "../../../utils/PsOffCanvasWindow";
import LeftStudentEntry from "./leftStudentEntry";

const SubjectMaster = (props) => {
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
    search: params.pagination?.search,
    academic_department: params.pagination?.dept,
    //...params,
  });

  useEffect(() => {
    if (!loader) getReport();
  }, [JSON.stringify(tableParams.pagination)]);

  const getReport = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    axios
      .post(
        ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO +
          "?status=1&left=1&" +
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
            },
          });
        }
        setLoader(false);
      });
  };

  const handleDeleteClick = (item) => {
    if (!window.confirm("Do you want to delete?")) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    axios.post(ServiceUrl.SETTINGS.DELETE_SUBJECT, form).then((res) => {
      if (res["data"].status == "1") {
        let m = dataList.filter((obj) => obj.id != item.id);
        setDataList(m);
        setDataView(m);
        toast.success("Subject Deleted");
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleSearch = (e) => {
    let m = dataList.filter(
      (item) =>
        upperCase(item.subject_name).indexOf(upperCase(e.target.value)) > -1 ||
        upperCase(item.subject_code).indexOf(upperCase(e.target.value)) > -1 ||
        upperCase(item.department_name).indexOf(upperCase(e.target.value)) >
          -1 ||
        upperCase(item.branch_place).indexOf(upperCase(e.target.value)) > -1
    );

    setDataView(m);
  };

  const handleEdit = (item) => {
    setViewData(item);
    setShowEdit(true);
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
        },
      });
    } else {
      setTableParams({
        ...tableParams,
        pagination: {
          current: 1,
          pageSize: tableParams.pagination.pageSize,
          name: "",
          dept: v,
        },
      });
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
      title: "Left On",
      dataIndex: "lefton",
      width: 100,
      render: (text, item) => momentDate(item.lefton, "DD-MMM-YYYY"),
    },
    { title: "Admission No", dataIndex: "admissionno", width: 120 },
    { title: "Register No", dataIndex: "registerno", width: 120 },
    {
      title: "Course",
      dataIndex: "course_name",
      render: (text, item, index) => (
        <>
          {item.degree_name} {item.course_shortname} (
          {item.dept_type == "aided" ? "R" : "SF"})
        </>
      ),
    },
    {
      title: "Student Name",
      dataIndex: "name",
      render: (text, item, index) =>
        `${item.name} ${item.initial ? item.initial : ""}`,
    },

    {
      title: "Father Name",
      dataIndex: "fathername",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      width: 150,
      render: (text, item, index) => (
        <>
          {item.mobile} <br />
          {item.fatherphone}
        </>
      ),
    },
    {
      title: "Reason",
      dataIndex: "left_reason",
    },
    {
      title: "Manage",
      dataIndex: "id",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess module="students_manage_left" action="action_update">
            <Button
              size="sm"
              variant="transparent"
              title="View"
              onClick={(e) => handleEdit(record)}
            >
              <i className="fa-solid fa-eye fs-6"></i>
            </Button>
          </ModuleAccess>
          <ModuleAccess module="students_manage_left" action="action_update">
            <Button
              size="sm"
              variant="transparent"
              title="Edit"
              onClick={(e) => handleEdit(record)}
            >
              <i className="fa-solid fa-pen fs-6"></i>
            </Button>
          </ModuleAccess>
          <ModuleAccess module="students_manage_left" action="action_delete">
            <Button
              size="sm"
              variant="transparent"
              title="Remove"
              onClick={(e) => handleDeleteClick(record)}
            >
              <i className="fa-solid fa-trash-can fs-6"></i>
            </Button>
          </ModuleAccess>
        </>
      ),
    },
  ];

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

  const getInnerOptions = (items) => {
    let rv = [];
    items.map((item, i) => {
      rv.push({
        label: `${item.department}  - ${
          item.dept_type == "unaided" ? "(SF)" : "(R)"
        } `,
        value: item.id,
      });
    });
    return rv;
  };
  const getOptions = () => {
    let m = customSorting(stDepartments, ["aided", "unaided"], "dept_type");
    let s = groupByMultiple(m, function (obj) {
      return [obj.dept_type];
    });
    let rv = [];
    rv.push({
      label: "All",
      value: "0",
    });
    s.map((item, i) => {
      rv.push({
        label: `${upperCase(item[0].dept_type)}`,
        options: getInnerOptions(item),
      });
    });

    return rv;
  };

  return (
    <>
      <CardFixedTop title="Left Students">
        <ul className="list-inline mb-0">
          <ModuleAccess module="students_manage_left" action="action_create">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => setShowAdd(true)}
              >
                <i className="fa fa-plus fs-5 px-1"></i> New
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={getReport}
            >
              <i className="fa fa-rotate fs-5 px-1"></i> Refresh
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container">
        <Spin spinning={loader}>
          <Row className="mt-3">
            <Col md={3}>
              <CustomDropDown
                dataSource={stDepartments}
                options={getOptions()}
                placeholder="Department"
                displayField={(item) => `${item.department}`}
                onChange={deptListchange}
                defaultOption={true}
              />
            </Col>
            <Col md={4}>
              <InputGroup size="sm">
                <Form.Control
                  size="sm"
                  placeholder="Search by Register No, Name, Admission No, Mobile"
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
                        search: e.target.value,
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
                Total no of Students : {tableParams.pagination.total || 0}
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
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>

      <PsOffCanvasWindow
        show={showAdd}
        title="Left Student Entry"
        onHide={(e) => setShowAdd(false)}
        size="md"
      >
        {showAdd && (
          <LeftStudentEntry
            onSuccess={(e) => {
              setShowAdd(false);
              getReport();
            }}
          />
        )}
      </PsOffCanvasWindow>
    </>
  );
};

export default withRouter(SubjectMaster);
