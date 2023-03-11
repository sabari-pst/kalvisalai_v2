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
  groupByMultiple,
  jsonToQuery,
  momentDate,
  upperCase,
} from "../../../utils";
import { Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../utils/serviceUrl";
import PsModalWindow from "../../../utils/PsModalWindow";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../utils/data";
import ModuleAccess from "../../../context/moduleAccess";
import { listSmsLogs } from "../../../models/utilities";
import SendManualSmsAlert from "./SendManualSmsAlert";

const StudentAttendanceManualSms = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

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
  });

  useEffect(() => {
    if (!loader) loadData();
  }, [JSON.stringify(tableParams.pagination)]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    const form = new FormData();
    listSmsLogs(
      "1&sms_sent_for=student&sms_type=student_absent&" +
        jsonToQuery(getRandomuserParams(tableParams))
    ).then((res) => {
      if (res.data) {
        setDataList(res.data);
        setDataView(res.data);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.count,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });
      }
      setLoader(false);
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
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
      title: "Sent Date",
      dataIndex: "sms_date",
      width: 110,
      render: (text, record) => momentDate(record.sms_date, "DD-MMM-YYYY "),
    },
    {
      title: "Sent time",
      dataIndex: "sms_date",
      width: 80,
      render: (text, record) => momentDate(record.sms_date, "hh:mm A"),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <>
          {record.name}
          <br />
          {record.code}
        </>
      ),
    },

    {
      title: "SMS Sent To",
      dataIndex: "sms_sent_mobile",
      width: 120,
    },
    {
      title: "Message",
      dataIndex: "sms_template_content",
    },
    {
      title: "Manage",
      dataIndex: "id",
      width: 80,
      align: "center",
      render: (text, record, index) => (
        <>
          {/*<ModuleAccess module="student_hostellers" action="action_update">
            <Button size="sm" variant="transparent" title="Edit">
              <i className="fa-solid fa-pen fs-6"></i>
            </Button>
          </ModuleAccess>
          <ModuleAccess module="student_hostellers" action="action_delete">
            <Button size="sm" variant="transparent" title="Remove">
              <i className="fa-solid fa-trash-can fs-6"></i>
            </Button>
      </ModuleAccess>*/}
        </>
      ),
    },
  ];

  return (
    <>
      <CardFixedTop title="Student Attendance SMS Logs">
        <ul className="list-inline mb-0">
          <ModuleAccess module="stu_att_manual_sms" action="action_create">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => setShowAdd(true)}
              >
                <i className="fa-regular fa-paper-plane fs-5 px-1"></i> Send SMS
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={(e) => loadData()}
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
                placeholder="Search by Mobile No"
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
              Total Logs : {tableParams.pagination?.total}
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
        size="md"
        title="Send SMS"
        show={showAdd}
        onHide={(e) => setShowAdd(false)}
      >
        <SendManualSmsAlert
          onSuccess={(e) => {
            loadData();
            setShowAdd(false);
          }}
        />
      </PsModalWindow>
    </>
  );
};

export default withRouter(StudentAttendanceManualSms);
