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
  upperCase,
} from "../../../../utils";
import { Spin, Table } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";

import { listCourseSubjects, liststDepartments } from "../../../../models/hr";
import EditCourse from "./editcourse";
import AddCourse from "./addcourse";
import ModuleAccess from "../../../../context/moduleAccess";
import { CustomDropDown } from "../../components";
import { listAllCoursesV2 } from "../../../../models/courses";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../../utils/data";

const CourseMaster = (props) => {
  const context = useContext(PsContext);
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
      pageSize: DEFAULT_PAGE_LIST_SIZE,
    },
    total: 0,
  });

  useEffect(() => {
    listAllCoursesV2().then((res) => {
      if (res) setStDepartments(res);
    });
  }, []);

  const resetAll = () => {
    setDataView([]);
    setDataList([]);
    setViewData([]);
  };

  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    name: params.pagination?.name,
    course_id: params.pagination?.course_id,
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
    listCourseSubjects(
      "1&" + jsonToQuery(getRandomuserParams(tableParams))
    ).then((res) => {
      if (res.data) {
        setDataList(res.data);
        setDataView(res.data);
        let s = groupByMultiple(res.data, function (obj) {
          return [obj.academic_year, obj.semester];
        });
        //console.log(s);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.count,
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
    axios.post(ServiceUrl.SETTINGS.DELETE_COURSE_SUBJECT, form).then((res) => {
      if (res["data"].status == "1") {
        let m = dataList.filter((obj) => obj.id != item.id);
        setDataList(m);
        setDataView(m);
        toast.success("Course Subject Deleted");
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const handleSearch = (e) => {
    let m = dataList.filter(
      (item) =>
        upperCase(item.subject_name).indexOf(upperCase(e.target.value)) > -1 ||
        upperCase(item.course_type).indexOf(upperCase(e.target.value)) > -1
    );

    setDataView(m);
  };

  const handleEdit = (item) => {
    setViewData(item);
    setShowEdit(true);
  };

  const deptListchange = (v, dept) => {
    let d = dataList;
    if (v == "0") {
      setTableParams({
        ...tableParams,
        pagination: {
          current: 1,
          pageSize: tableParams.pagination.pageSize,
          name: "",
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    } else {
      setTableParams({
        ...tableParams,
        pagination: {
          current: 1,
          pageSize: tableParams.pagination.pageSize,
          name: "",
          course_id: v,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    }
  };

  const getInnerOptions = (items) => {
    let rv = [];
    items.map((item, i) => {
      rv.push({
        label: `${item.degreename} - ${item.name} (${
          item.dept_type == "unaided" ? "SF" : "R"
        })`,
        value: item.id,
      });
    });
    return rv;
  };
  const getOptions = () => {
    let s = groupByMultiple(stDepartments, function (obj) {
      return [obj.academic_dept_type];
    });
    let rv = [];
    rv.push({
      label: "All",
      value: "0",
    });
    s.map((item, i) => {
      rv.push({
        label: upperCase(item[0].academic_dept_type),
        options: getInnerOptions(item),
      });
    });

    return rv;
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
      title: "Course Type",
      dataIndex: "course_type",
      width: 100,
      align: "center",
      render: (text, item, index) => <>{upperCase(text)}</>,
    },
    {
      title: "Academic Year",
      dataIndex: "academic_year",
      width: 120,
      align: "center",
    },
    { title: "Sem", dataIndex: "semester", width: 70, align: "center" },
    { title: "Course", dataIndex: "course_name" },
    { title: "Subject Name", dataIndex: "subject_name" },
    {
      title: "Manage",
      dataIndex: "id",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <>
          <ModuleAccess
            module="academic_course_subject_allocate"
            action="action_update"
          >
            <Button
              size="sm"
              variant="transparent"
              title="Edit Group"
              onClick={(e) => handleEdit(record)}
            >
              <i className="fa-solid fa-pen fs-6"></i>
            </Button>
          </ModuleAccess>
          <ModuleAccess
            module="academic_course_subject_allocate"
            action="action_delete"
          >
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
      <CardFixedTop title="Course Wise Subject Allocation">
        <ul className="list-inline mb-0">
          <ModuleAccess
            module="academic_course_subject_allocate"
            action="action_create"
          >
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
          <Col md={3}>
            <CustomDropDown
              dataSource={stDepartments}
              options={getOptions()}
              placeholder="Select Course"
              displayField={(item) => `${item.degreename} - ${item.name}`}
              onChange={deptListchange}
              defaultOption={true}
            />
          </Col>
          <Col md={4}>
            <InputGroup size="sm">
              <Form.Control
                size="sm"
                placeholder="Search by Subject Name"
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
          <Col md={5}>
            <div className="text-end fs-sm fw-bold">
              Total no of Subjects : {tableParams.pagination.total || 0}
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
        title="Allocat Subject"
        onHide={(e) => setShowAdd(false)}
        show={showAdd}
        size="md"
      >
        <AddCourse onSuccess={(e) => getReport()} />
      </PsModalWindow>

      <PsModalWindow
        title="Edit Allocated Subject"
        onHide={(e) => setShowEdit(false)}
        show={showEdit}
        size="md"
      >
        <EditCourse
          dataSource={viewData}
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

export default withRouter(CourseMaster);
