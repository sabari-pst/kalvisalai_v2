import React, { useState, useEffect, useContext, useCallback } from "react";
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
import { Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";

import ModuleAccess from "../../../../context/moduleAccess";
import AddStudentToHostel from "./addStudentToHostel";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../../utils/data";
import EditHostelAdmission from "./editHostelAdmission";

const ListHostelStudents = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

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

  const getReport = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    axios
      .get(
        ServiceUrl.STUDENTS.LIST_HOSTEL_STUDENTS +
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
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    name: params.pagination?.name,
  });

  useEffect(() => {
    if (!loader) getReport();
  }, [JSON.stringify(tableParams.pagination)]);

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
      title: "Course",
      dataIndex: "course_name",
      render: (text, record) =>
        `${record.degree_name} ${record.course_name} (${
          record.dept_type == "aided" ? "R" : "SF"
        })`,
    },
    {
      title: "Reg.No",
      dataIndex: "registerno",
      width: 120,
      render: (text, record) => `${record.registerno || record.admissionno} `,
    },
    {
      title: "Student Name",
      dataIndex: "name",
      render: (text, record) => `${record.name} ${record.initial || ""}`,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: 60,
      render: (text, record) => upperCase(record.gender),
    },
    {
      title: "Father Name",
      dataIndex: "fathername",
    },
    {
      title: "Joining Date",
      dataIndex: "joining_date",
      width: 100,
      render: (text, record) => momentDate(record.joining_date, "DD-MMM-YYYY"),
    },
    {
      title: "Floor",
      dataIndex: "floor_no",
      width: 60,
    },
    {
      title: "Room",
      dataIndex: "room_no",
      width: 60,
    },
    {
      title: "Manage",
      dataIndex: "id",
      width: 80,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess module="student_hostellers" action="action_update">
            <Button
              size="sm"
              variant="transparent"
              title="Edit"
              onClick={(e) => handleEdit(record)}
            >
              <i className="fa-solid fa-pen fs-6"></i>
            </Button>
          </ModuleAccess>
          <ModuleAccess module="student_hostellers" action="action_delete">
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

  const handleEdit = (item) => {
    setViewData(item);
    setShowEdit(true);
  };

  const handleDeleteClick = (item) => {
    if (!window.confirm("Do you want to delete?")) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    form.append("student_uuid", item.student_uuid);
    axios.post(ServiceUrl.STUDENTS.DELETE_HOSTEL_STUDENT, form).then((res) => {
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
      <CardFixedTop title="Hostel Students">
        <ul className="list-inline mb-0">
          <ModuleAccess module="student_hostellers" action="action_create">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => setShowAdd(true)}
              >
                <i className="fa fa-plus fs-5 px-1"></i> New Admission
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
          <Col md={4}>
            <InputGroup size="sm">
              <Form.Control
                size="sm"
                placeholder="Search by Student Name,Register No"
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
              Total Students : {dataView.length}
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

      <AddStudentToHostel
        show={showAdd}
        title="New Hostel Admission"
        size="lg"
        onHide={(e) => setShowAdd(false)}
        onSuccess={(e) => {
          getReport();
        }}
      />

      <PsModalWindow
        size="lg"
        title="Edit Admission Details"
        show={showEdit}
        onHide={(e) => setShowEdit(false)}
      >
        {showEdit && (
          <EditHostelAdmission
            dataSource={viewData}
            onSuccess={(e) => {
              setShowEdit(false);
              getReport();
            }}
          />
        )}
      </PsModalWindow>
    </>
  );
};

export default withRouter(ListHostelStudents);
