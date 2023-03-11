import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../../context";
import { groupByMultiple, jsonToQuery, upperCase } from "../../../../utils";
import { Table } from "antd";

import {
  Card,
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  ButtonGroup,
} from "react-bootstrap";

import ModuleAccess from "../../../../context/moduleAccess";

import { getDepartmentFiles } from "../../../../models/cms";

import AddSyllabus from "./addSyllabus";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../../utils/data";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";
import EditSyllabus from "./editSyllabus";

const SyllabusList = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [batches, setBatches] = useState([]);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewData, setViewData] = useState([]);

  const [editorContent, setEditorContent] = useState("");
  const rowType = "syllabus";

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
    batch: params.pagination?.batch,
    academic_department: context.user.academic_department,
    row_type: rowType,
  });

  useEffect(() => {
    if (context.user.academic_department) loadData();
  }, [JSON.stringify(context.user)]);

  useEffect(() => {
    if (!loader) loadData();
  }, [JSON.stringify(tableParams.pagination)]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    getDepartmentFiles(
      "1&" + jsonToQuery(getRandomuserParams(tableParams))
    ).then((res) => {
      if (res.status == "1") {
        setDataList(res.data);
        setDataView(res.data);
        setBatches(res.batch);
      }
      setLoader(false);
    });
  };

  const field = (fieldName) => {
    return dataList?.[fieldName];
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to delete ?")) return;
    setLoader(true);
    const form = new FormData();
    form.append("academic_department", item.academic_department);
    form.append("id", item.id);
    form.append("row_type", item.row_type);
    axios.post(ServiceUrl.DEPT_CMS.DELETE_FILE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        loadData();
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
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
      title: "Type",
      dataIndex: "course_type",
      width: 100,
      render: (text, record, index) => upperCase(record.course_type),
    },
    {
      title: "Batch",
      dataIndex: "batch",
      width: 150,
    },
    { title: "File Title", dataIndex: "file_title" },
    {
      title: "Manage",
      dataIndex: "id",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess module="dept_cms_syllabus" action="action_update">
            <Button
              size="sm"
              variant="transparent"
              title="Edit"
              onClick={(e) => handleEdit(record)}
            >
              <i className="fa-solid fa-pen fs-6"></i>
            </Button>
          </ModuleAccess>
          <ModuleAccess module="dept_cms_syllabus" action="action_delete">
            <Button
              size="sm"
              variant="transparent"
              title="Remove"
              onClick={(e) => handleDelete(record)}
            >
              <i className="fa-solid fa-trash-can fs-6"></i>
            </Button>
          </ModuleAccess>
        </>
      ),
    },
  ];

  const innerOptions = (items) => {
    return items.map((item) => (
      <option value={item.batch}>{item.batch}</option>
    ));
  };

  const batchOptions = () => {
    let rv = [];
    let m = groupByMultiple(batches, function (obj) {
      return [obj.course_type];
    });
    m.map((items) =>
      rv.push(
        <optgroup label={upperCase(items[0].course_type)}>
          {innerOptions(items)}
        </optgroup>
      )
    );
    return rv;
  };

  return (
    <div>
      <Row>
        <Col md={3}>
          <InputGroup size="sm">
            <InputGroup.Text>Batch</InputGroup.Text>
            <Form.Control
              as="select"
              size="sm"
              className="fw-bold form-control form-control-sm"
              onChange={(e) => {
                setTableParams({
                  ...tableParams,
                  pagination: {
                    current: 1,
                    pageSize: tableParams.pagination.pageSize,
                    name: "",
                    batch: e.target.value,
                  },
                });
              }}
            >
              <option value="">-All-</option>
              {batchOptions()}
            </Form.Control>
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup size="sm">
            <Form.Control
              size="sm"
              placeholder="Search by Title"
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
        <Col md={3}></Col>
        <Col md={2}>
          <ButtonGroup>
            <ModuleAccess module="dept_cms_syllabus" action="action_create">
              <Button
                type="button"
                size="sm"
                variant="outline-secondary"
                onClick={(e) => setAddModal(true)}
              >
                <i className="fa fa-plus me-1"></i>Add Syllabus
              </Button>
            </ModuleAccess>
            <Button
              type="button"
              size="sm"
              variant="outline-secondary"
              onClick={(e) => loadData()}
            >
              <i className="fa fa-rotate-right me-1"></i>Refresh
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row className="mt-3">
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
                scroll={{ y: "calc(100vh - 250px)" }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {addModal && (
        <AddSyllabus
          show={addModal}
          title="Add Syllabus"
          size="md"
          rowType="syllabus"
          onHide={(e) => setAddModal(false)}
          onSuccess={(e) => loadData()}
        />
      )}

      {editModal && (
        <EditSyllabus
          show={editModal}
          title="Edit Syllabus"
          size="md"
          rowType="syllabus"
          dataSource={viewData}
          onHide={(e) => setEditModal(false)}
          onSuccess={(e) => {
            setEditModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default withRouter(SyllabusList);
