import { Table } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import PsContext from "../../../context";
import { CardFixedTop, jsonToQuery } from "../../../utils";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../utils/data";
import { ServiceUrl } from "../../../utils/serviceUrl";

const logMenus = [
  { text: "Student Add Logs", key: "add_student" },
  { text: "Student Edit Logs", key: "edit_student" },
  { text: "Student Transport Update Logs", key: "student_transport_update" },
];

const UserLogs = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);

  const [activeKey, setActiveKey] = useState("");

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

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
    action_name: params.pagination?.action_name,
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
        ServiceUrl.SETTINGS.LIST_USER_LOGS +
          "?status=1&" +
          jsonToQuery(getRandomuserParams(tableParams))
      )
      .then((res) => {
        if (res["data"].data) {
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
    },
    { title: "Type", dataIndex: "action_type", width: 80 },
    { title: "Action", dataIndex: "action_name" },
    { title: "Date & Time", dataIndex: "action_timestamp" },
    { title: "User Ip", dataIndex: "action_ip" },
    { title: "User", dataIndex: "employee_name" },
    { title: "Modified Data", dataIndex: "action_to_name" },
    { title: "Modified Data 1", dataIndex: "action_table_param1" },
    { title: "Modified Data 2", dataIndex: "action_table_param2" },
    { title: "Modified Data 3", dataIndex: "action_table_param3" },
    { title: "Modified Data 4", dataIndex: "action_table_param4" },
  ];

  const handleListClick = (item) => {
    setActiveKey(item.key);
    setTableParams({
      ...tableParams,
      pagination: {
        current: 1,
        pageSize: tableParams.pagination.pageSize,
        action_name: item.key,
        // 200 is mock data, you should read it from server
        // total: data.totalCount,
      },
    });
  };

  return (
    <div>
      <CardFixedTop title="User Logs">
        <ul className="list-inline mb-0">
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
      <div className="container py-3">
        <Row>
          {/*<Col md={3}>
            <ListGroup className="bg-white">
              {logMenus.map((item, i) => {
                return (
                  <ListGroup.Item className="border-bottom">
                    <a onClick={(e) => handleListClick(item)}>{item.text}</a>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>*/}
          <Col md={12}>
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
                  scroll={{ y: "calc(100vh - 210px)", x: "calc(100 - 210px)" }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default withRouter(UserLogs);
