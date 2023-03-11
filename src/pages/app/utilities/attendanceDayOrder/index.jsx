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
  customSorting,
  groupByMultiple,
  jsonToQuery,
  momentDate,
  timeTableDayFromNumber,
  upperCase,
} from "../../../../utils";
import { Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";

import ModuleAccess from "../../../../context/moduleAccess";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../../utils/data";
import AddDayOrder from "./addDayOrder";
import EditDayOrder from "./editDayOrder";

const AttendanceDayOrder = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  let dayOrderCount = context.settingValue("attendance_day_order_count");
  let dayOrderInDayName = context.settingValue(
    "attendance_dayorder_as_day_name"
  );

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: DEFAULT_PAGE_LIST_SIZE,
    },
    total: 0,
  });

  const resetAll = () => {
    setDataView([]);
    setDataList([]);
    setViewData([]);
  };

  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    name: params.pagination?.name,
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
        ServiceUrl.UTILITIES.LIST_DAY_ORDERS +
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
    form.append("day_order_date", item.day_order_date);
    axios.post(ServiceUrl.UTILITIES.DELETE_DAY_ORDER, form).then((res) => {
      if (res["data"].status == "1") {
        let m = dataList.filter((obj) => obj.id != item.id);
        setDataList(m);
        setDataView(m);
        toast.success(res["data"].message || "Deleted");
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleEdit = (item) => {
    setViewData(item);
    setShowEdit(true);
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
      title: "Date",
      dataIndex: "day_order_date",
      render: (text, item, index) =>
        momentDate(item.day_order_date, "DD-MMM-YYYY"),
    },

    {
      title: "Day Order",
      dataIndex: "day_order_value",
      render: (text, item, index) =>
        timeTableDayFromNumber(item.day_order_value, dayOrderInDayName),
    },

    {
      title: "Manage",
      dataIndex: "id",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess module="util_att_day_order" action="action_update">
            <Button
              size="sm"
              variant="transparent"
              title="Edit Group"
              onClick={(e) => handleEdit(record)}
            >
              <i className="fa-solid fa-pen fs-6"></i>
            </Button>
          </ModuleAccess>
          <ModuleAccess module="util_att_day_order" action="action_delete">
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
      <CardFixedTop title="Attendance Day Order">
        <ul className="list-inline mb-0">
          <ModuleAccess module="util_att_day_order" action="action_create">
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
        <Row className="mt-3">
          <Col md={2}>
            <InputGroup size="sm">
              <Form.Control
                type="month"
                size="sm"
                placeholder="Search"
                onChange={(e) =>
                  setTableParams({
                    ...tableParams,
                    pagination: {
                      current: 1,
                      pageSize: tableParams.pagination.pageSize,
                      name: e.target.value,
                    },
                  })
                }
              />
            </InputGroup>
          </Col>
          <Col md={10}>
            <div className="text-end fs-sm fw-bold">
              Total no of Data : {tableParams.pagination.total || 0}
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
        title="Add Day Order"
        onHide={(e) => setShowAdd(false)}
        show={showAdd}
        size="sm"
      >
        <AddDayOrder
          onSuccess={(e) => getReport()}
          onHide={(e) => setShowAdd(false)}
        />
      </PsModalWindow>

      <PsModalWindow
        title="Edit Day Order"
        onHide={(e) => setShowEdit(false)}
        show={showEdit}
        size="sm"
      >
        <EditDayOrder
          dataSource={viewData}
          onHide={(e) => setShowEdit(false)}
          onSuccess={(e) => {
            setShowEdit(false);
            setViewData([]);
            getReport();
          }}
        />
      </PsModalWindow>
    </>
  );
};

export default withRouter(AttendanceDayOrder);
