import { Table } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { withRouter } from "react-router-dom";
import PsContext from "../../../../context";
import ModuleAccess from "../../../../context/moduleAccess";
import { CardFixedTop, jsonToQuery, momentDate } from "../../../../utils";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../../utils/data";
import PsOffCanvasWindow from "../../../../utils/PsOffCanvasWindow";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import NewConductCertificate from "./newConductCertificate";

const ConductCertificate = (props) => {
  const context = useContext(PsContext);
  const [loader, setLoader] = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [editData, setEditData] = useState([]);

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

    axios
      .get(
        ServiceUrl.STUDENTS.LIST_CONDUCT_CERTIFICATES +
          "?&" +
          jsonToQuery(getRandomuserParams(tableParams))
      )
      .then((res) => {
        if (res["data"].status == "1") {
          let d = res["data"].data;
          setDataList(d);
          setDataView(d);
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

  const handleDeleteClick = (item) => {
    if (!window.confirm("Do you want to delete?")) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    form.append("student_uuid", item.student_uuid);
    axios
      .post(ServiceUrl.STUDENTS.DELETE_CONDUCT_CERTIFICATE, form)
      .then((res) => {
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

  const handlePrintClick = (item) => {
    setEditData(item);
    setShowAdd(true);
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
      title: "Generated Date",
      dataIndex: "generate_date",
      width: 150,
      align: "left",
      render: (text, record, index) =>
        momentDate(record.generate_date, "DD-MM-YYYY"),
    },

    { title: "Student Name", dataIndex: "name" },
    {
      title: "Batch",
      dataIndex: "batch",
      width: 120,
    },
    {
      title: "Semester",
      dataIndex: "semester",
      align: "center",
      width: 80,
    },
    {
      title: "Course Name",
      dataIndex: "course_name",
      render: (text, record, index) =>
        `${record.degree_name}-${record.course_name} ${
          record.dept_type == "unaided" ? "(SF)" : "(R)"
        }`,
    },
    {
      title: "Manage",
      dataIndex: "id",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess
            module="student_conduct_certificate"
            action="action_print"
          >
            <Button
              size="sm"
              variant="transparent"
              title="Print"
              onClick={(e) => handlePrintClick(record)}
            >
              <i className="fa-sharp fa-solid fa-print fa-pen fs-6"></i>
            </Button>
          </ModuleAccess>
          <ModuleAccess
            module="student_conduct_certificate"
            action="action_delete"
          >
            <Button
              size="sm"
              variant="transparent"
              title="Remove "
              onClick={(e) => handleDeleteClick(record)}
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
      <CardFixedTop title="Conduct Certificates">
        <ul className="list-inline mb-0">
          <ModuleAccess
            module="student_conduct_certificate"
            action="action_create"
          >
            <li className="list-inline-item">
              <Button
                size="sm"
                variant="transparent"
                className="fs-6 border-start"
                onClick={(e) => setShowAdd(true)}
              >
                <i className="fa-solid fa-plus px-2"></i> New
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              size="sm"
              variant="transparent"
              className="fs-6 border-start"
              onClick={(e) => getReport()}
            >
              <i className="fa-solid fa-arrows-rotate px-2"></i> Refresh
            </Button>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container py-2">
        <Row>
          <Col md={5}>
            <InputGroup size="sm">
              <InputGroup.Text>
                <i className="fa-solid fa-magnifying-glass"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by Admission No, Register No, Student Name"
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
            </InputGroup>
          </Col>
          <Col md={7}>
            <div className="text-end fs-sm fw-bold mt-2">
              Total Certificates : {tableParams.pagination.total || 0}
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
                  scroll={{ y: "calc(100vh - 250px)" }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <PsOffCanvasWindow
        show={showAdd}
        title="New Conduct Certificate"
        onHide={(e) => {
          setShowAdd(false);
          setEditData([]);
        }}
        size="md"
      >
        <NewConductCertificate
          onHide={(e) => setShowAdd(false)}
          dataSource={editData}
        />
      </PsOffCanvasWindow>
    </>
  );
};

export default withRouter(ConductCertificate);
