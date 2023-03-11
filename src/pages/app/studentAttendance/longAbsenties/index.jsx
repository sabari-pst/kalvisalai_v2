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
  semesterValue,
  upperCase,
} from "../../../../utils";
import { Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";

import { listHolidays } from "../../../../models/hr";

import AddHoliday from "./addHoliday";
import ModuleAccess from "../../../../context/moduleAccess";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../../utils/data";

const LongAbsenties = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddSunday, setShowAddSunday] = useState(false);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: DEFAULT_PAGE_LIST_SIZE,
    },
    total: 0,
  });

  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    name: params.pagination?.name,
    //...params,
  });

  useEffect(() => {
    if (!loader) getReport();
  }, [JSON.stringify(tableParams.pagination)]);

  const resetAll = () => {
    setDataView([]);
    setDataList([]);
    setViewData([]);
  };

  const getReport = () => {
    setLoader(true);
    setShowAddSunday(false);
    setDataList([]);
    setDataView([]);
    const form = new FormData();
    axios
      .get(
        ServiceUrl.STUDENTS.LONG_ABSENT_STUDENTS +
          "?status=1&" +
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
    form.append("student_uuid", item.student_uuid);
    axios
      .post(ServiceUrl.STUDENTS.DELETE_LONG_ABSENT_STUDENT, form)
      .then((res) => {
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

  const handleSearch = (e) => {
    let m = dataList.filter(
      (item) =>
        upperCase(item.holiday_name).indexOf(upperCase(e.target.value)) > -1
    );

    setDataView(m);
  };

  const handleEdit = (item) => {
    setViewData(item);
    setShowEdit(true);
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "id",
      width: 50,
      align: "center",
      render: (text, record, index) =>
        tableParams.pagination.pageSize * (tableParams.pagination.current - 1) +
        index +
        1,
    },
    {
      title: "Reg.No",
      dataIndex: "registerno",
      width: 150,
      render: (text, record) => `${record.admissionno || record.registerno}`,
    },
    {
      title: "Student Name",
      dataIndex: "name",
    },

    {
      title: "Course",
      dataIndex: "course_name",
      render: (text, item, inde) =>
        `${item.degree_name} - ${item.course_name} (${
          item.dept_type == "unaided" ? "SF" : "R"
        })`,
    },
    {
      title: "Batch",
      dataIndex: "batch",
      width: 100,
    },
    {
      title: "Sem",
      dataIndex: "semester",
      width: 60,
      render: (text, item, inde) => `${semesterValue(item.semester)}`,
    },
    {
      title: "Date & Reason",
      dataIndex: "absent_from",
      render: (text, item, inde) => (
        <>
          From : <b>{momentDate(item.absent_from, "DD-MM-YYYY")}</b> - To :{" "}
          <b>{momentDate(item.absent_to, "DD-MM-YYYY")}</b>
          <br />
          {item.absent_reason}
        </>
      ),
    },

    {
      title: "Manage",
      dataIndex: "id",
      width: 60,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess
            module="stu_attendance_long_absenties"
            action="action_delete"
          >
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

  return (
    <>
      <CardFixedTop title="Long Absenties">
        <ul className="list-inline mb-0">
          {/*<ModuleAccess module="stu_attendance_long_absenties" action="action_create">
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

         */}
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
        <Row className="mt-3">
          <Col md={4}>
            <InputGroup size="sm">
              <Form.Control
                size="sm"
                placeholder="Search"
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
          <Col md={8}>
            <div className="text-end fs-sm fw-bold">
              Total no of Students : {dataView.length}
            </div>
          </Col>
          <Col md={12} className="mt-2">
            <Card>
              <Card.Body className="px-0 py-0">
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
      </div>

      <PsModalWindow
        title="Add Holiday"
        onHide={(e) => setShowAdd(false)}
        show={showAdd}
      >
        <AddHoliday onSuccess={(e) => getReport()} />
      </PsModalWindow>
    </>
  );
};

export default withRouter(LongAbsenties);
