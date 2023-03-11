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
  upperCase,
} from "../../../../utils";
import { Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";

import { CustomDropDown } from "../../components/";
import ModuleAccess from "../../../../context/moduleAccess";
import { listNaacReports } from "../../../../models/naac";

const NaacSsrReport = (props) => {
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
      pageSize: 10,
    },
    total: 0,
  });

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

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
    listNaacReports(
      "1",
      "&" + jsonToQuery(getRandomuserParams(tableParams))
    ).then((res) => {
      if (res) {
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

  const handleDeleteClick = (item) => {
    if (!window.confirm("Do you want to delete?")) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    axios.post(ServiceUrl.NAAC.REMOVE_REPORT, form).then((res) => {
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
      title: "Criteria",
      dataIndex: "criteria_title",
      render: (text, record, index) =>
        `${record.criteria_code}. ${record.criteria_title}`,
    },
    {
      title: "Criteria Group",
      dataIndex: "criteria_group_code",
      render: (text, record, index) =>
        `${record.criteria_group_code}. ${record.criteria_group_title}`,
    },
    {
      title: "Type",
      dataIndex: "report_type",
      render: (text, record, index) => `${upperCase(record.report_type)}`,
      width: 100,
    },
    {
      title: "Report Title",
      dataIndex: "criteria_group_code",
      render: (text, record, index) =>
        `${record.report_code}. ${record.report_title}`,
    },
    {
      title: "Manage",
      dataIndex: "id",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess module="naac_ssr_report" action="action_update">
            <Link
              to={`/app/naac/ssr-report/edit/${record.id}`}
              className="btn btn-sm btn-transparent"
            >
              <i className="fa-solid fa-pen fs-6"></i>
            </Link>
          </ModuleAccess>
          <ModuleAccess module="naac_ssr_report" action="action_delete">
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
      <CardFixedTop title="NAAC SSR Report">
        <ul className="list-inline mb-0">
          <ModuleAccess module="naac_ssr_report" action="action_create">
            <li className="list-inline-item">
              <Link
                className="btn btn-sm border-start ms-2 fs-6"
                to="/app/naac/ssr-report/new"
              >
                <i className="fa fa-plus fs-6 px-1"></i> New
              </Link>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={getReport}
            >
              <i className="fa fa-rotate fs-6 px-1"></i> Refresh
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container">
        <Spin spinning={loader}>
          <Row className="mt-3">
            <Col md={4}>
              <InputGroup size="sm">
                <Form.Control
                  size="sm"
                  placeholder="Search Title"
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
                Total no of Reports : {tableParams.pagination.total || 0}
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
    </>
  );
};

export default withRouter(NaacSsrReport);
