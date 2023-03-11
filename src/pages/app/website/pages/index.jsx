import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../../context";
import { CardFixedTop, jsonToQuery, momentDate } from "../../../../utils";
import { Spin, Table } from "antd";
import ModuleAccess from "../../../../context/moduleAccess";
import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";

const Pages = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    total: 0,
  });

  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    title: params.pagination?.title,
    //...params,
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (!loader) loadData();
  }, [JSON.stringify(tableParams.pagination)]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    axios
      .post(
        ServiceUrl.WEBSITE_CMS.LIST_PAGES +
          "?type=page&" +
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

  const deletePage = (item) => {
    if (!window.confirm("Do you want to delete ?")) return;
    setLoader(false);
    const form = new FormData();
    form.append("id", item.id);
    axios.post(ServiceUrl.WEBSITE_CMS.DELETE_PAGE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Deleted");
        loadData();
      } else {
        toast.error(res["data"].message || "Error");
        setLoader(false);
      }
    });
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
      title: "Created",
      dataIndex: "ididate",
      width: 160,
      align: "center",
      render: (text, record, index) =>
        momentDate(record.idate, "DD/MM/YYYY hh:mm A"),
    },
    {
      title: "Page Title",
      dataIndex: "title",
      render: (text, record) => record.title,
    },
    {
      title: "Manage",
      dataIndex: "id",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess module="cms_pages" action="action_update">
            <Link
              to={`/app/web/pages/edit/${record.id}/${record.seo_slug}`}
              className="btn btn-transparent"
            >
              <i className="fa-solid fa-pen fs-6"></i>
            </Link>
          </ModuleAccess>
          <ModuleAccess module="cms_pages" action="action_delete">
            <Button
              size="sm"
              variant="transparent"
              title="Remove Page"
              onClick={(e) => deletePage(record)}
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
      <CardFixedTop title="Pages">
        <ul className="list-inline mb-0">
          <ModuleAccess module="cms_pages" action="action_create">
            <li className="list-inline-item">
              <Link
                to="/app/web/pages/new"
                className="btn btn-white border-start"
              >
                <i className="fa-solid fa-plus  fs-5 px-1"></i> Add Page
              </Link>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              type="button"
              variant="transparent"
              className="border-start"
              onClick={loadData}
            >
              <i className="fa-solid fa-arrows-rotate fs-5 px-1"></i>Refresh
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
                placeholder="Search by Title"
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
                      title: e.target.value,
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
              {tableParams.pagination.total || 0} Pages
            </div>
          </Col>
        </Row>
        <Card className="mt-3">
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
      </div>
    </>
  );
};

export default withRouter(Pages);
