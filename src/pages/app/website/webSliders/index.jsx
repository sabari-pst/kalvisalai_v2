import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../../context";
import {
  CardFixedTop,
  getFileLiveUrl,
  jsonToQuery,
  momentDate,
} from "../../../../utils";
import { Image, Spin, Table } from "antd";
import ModuleAccess from "../../../../context/moduleAccess";
import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";
import AddSlider from "./addSlider";
import EditSlider from "./editSlider";

const WebSliders = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewData, setViewData] = useState([]);

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
          "?type=slider&" +
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

  const handleEdit = (item) => {
    setViewData(item);
    setEditModal(true);
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
      title: "Image",
      dataIndex: "feature_image",
      width: 200,
      render: (text, record) => (
        <Image
          src={getFileLiveUrl(record.feature_image)}
          style={{ maxHeight: "120px" }}
          preview={true}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (text, record) => record.title,
    },
    {
      title: "Order",
      dataIndex: "row_order",
      width: 90,
      align: "center",
      render: (text, record) => record.row_order != "0" && record.row_order,
    },
    {
      title: "Manage",
      dataIndex: "id",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess module="cms_web_sliders" action="action_update">
            <Button
              size="sm"
              variant="transparent"
              title="Remove"
              onClick={(e) => handleEdit(record)}
            >
              <i className="fa-solid fa-pen fs-6"></i>
            </Button>
          </ModuleAccess>
          <ModuleAccess module="cms_web_sliders" action="action_delete">
            <Button
              size="sm"
              variant="transparent"
              title="Remove"
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
      <CardFixedTop title="Sliders">
        <ul className="list-inline mb-0">
          <ModuleAccess module="cms_web_sliders" action="action_create">
            <li className="list-inline-item">
              <Button
                type="button"
                variant="transparent"
                className="border-start"
                onClick={(e) => setAddModal(true)}
              >
                <i className="fa-solid fa-plus fs-5 px-1"></i>New Slider
              </Button>
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
              {tableParams.pagination.total || 0} Gallery
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

      {addModal && (
        <AddSlider
          show={addModal}
          onHide={(e) => setAddModal(false)}
          size="lg"
          backdrop="staic"
          title="New Slider"
          onSuccess={(e) => loadData()}
        />
      )}

      {editModal && (
        <EditSlider
          show={editModal}
          backdrop="staic"
          onHide={(e) => setEditModal(false)}
          size="lg"
          title="Edit Slider"
          dataSource={viewData}
          onSuccess={(e) => loadData()}
        />
      )}
    </>
  );
};

export default withRouter(WebSliders);
