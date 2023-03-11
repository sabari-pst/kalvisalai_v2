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
  ButtonGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  momentDate,
  upperCase,
} from "../../../../utils";
import { Spin } from "antd";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import PsModalWindow from "../../../../utils/PsModalWindow";

import { NoDataFound } from "../../components";
import ModuleAccess from "../../../../context/moduleAccess";

import AddSubjectNature from "./addSubjectNature";
import { listSubjectNatures } from "../../../../models/settings";
import EditSubjectNature from "./editSubjectNature";

const SubjectNatures = (props) => {
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showCourseLink, setShowCourseLink] = useState(false);

  const [activeId, setActiveId] = useState("");

  const [activeDeptType, setActiveDeptType] = useState("");

  const [fromDate, setFromDate] = useState(
    momentDate(new Date(), "YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(momentDate(new Date(), "YYYY-MM-DD"));

  useEffect(() => {
    getReport();
  }, []);

  const resetAll = () => {
    setDataView([]);
    setDataList([]);
    setViewData([]);
  };

  const getReport = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);

    listSubjectNatures().then((res) => {
      if (res) {
        setDataList(res);
        setDataView(res);
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
    axios.post(ServiceUrl.SETTINGS.REMOVE_SUBJECT_NATURE, form).then((res) => {
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

  const handleSearch = (e) => {
    let m = dataList.filter(
      (item) =>
        upperCase(item.subject_nature_name).indexOf(upperCase(e.target.value)) >
        -1
    );

    setDataView(m);
  };

  const handleEdit = (item) => {
    setViewData(item);
    setShowEdit(true);
  };

  const handleCourseLink = (item) => {
    setViewData(item);
    setShowCourseLink(true);
  };

  useEffect(() => {
    let s = dataList;
    if (activeDeptType != "") {
      s = s.filter(
        (item) => upperCase(item.coursetype) == upperCase(activeDeptType)
      );
    }
    setDataView(s);
  }, [activeDeptType]);

  return (
    <>
      <CardFixedTop title="Subject Nature">
        <ul className="list-inline mb-0">
          <ModuleAccess module="academic_subject_nature" action="action_create">
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
        <Spin spinning={loader}>
          <Row className="mt-3">
            <Col md={4}>
              <InputGroup size="sm">
                <Form.Control
                  size="sm"
                  placeholder="Search by Name"
                  onChange={(e) => handleSearch(e)}
                />
                <InputGroup.Text>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </InputGroup.Text>
              </InputGroup>
            </Col>
            <Col md={8}>
              <div className="text-end fs-sm fw-bold">
                Total no of Subject Natures : {dataView.length}
              </div>
            </Col>
            <Col md={12} className="mt-2">
              <Card>
                <Card.Body className="px-0 py-0">
                  <div
                    className="tableFixHead"
                    style={{ maxHeight: "calc(100vh - 150px)" }}
                  >
                    <table className="">
                      <thead>
                        <tr>
                          <th width="60">S.No</th>
                          <th>Subject Nature Name</th>
                          <th width="120">Order</th>
                          <th width="90" className="text-center">
                            #
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataView.map((item, i) => {
                          return (
                            <tr
                              key={i}
                              className={
                                item.active_status == "0" ? "text-danger" : ""
                              }
                            >
                              <td>{i + 1}</td>
                              <td>{item.subject_nature_name}</td>
                              <td align="center">{item.display_order}</td>
                              <td align="center">
                                <ModuleAccess
                                  module="academic_subject_nature"
                                  action="action_update"
                                >
                                  <Button
                                    size="sm"
                                    variant="transparent"
                                    title="Edit Group"
                                    onClick={(e) => handleEdit(item)}
                                  >
                                    <i className="fa-solid fa-pen fs-6"></i>
                                  </Button>
                                </ModuleAccess>
                                <ModuleAccess
                                  module="academic_subject_nature"
                                  action="action_delete"
                                >
                                  <Button
                                    size="sm"
                                    variant="transparent"
                                    title="Remove Group"
                                    onClick={(e) => handleDeleteClick(item)}
                                  >
                                    <i className="fa-solid fa-trash-can fs-6"></i>
                                  </Button>
                                </ModuleAccess>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {!loader && dataView.length < 1 && (
                      <NoDataFound className="my-4" />
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>

      <PsModalWindow
        title="Add Subject Nature"
        onHide={(e) => setShowAdd(false)}
        show={showAdd}
        size="sm"
      >
        <AddSubjectNature onSuccess={(e) => getReport()} />
      </PsModalWindow>

      <PsModalWindow
        title="Edit Subject Nature"
        onHide={(e) => setShowEdit(false)}
        show={showEdit}
        size="sm"
      >
        <EditSubjectNature
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

export default withRouter(SubjectNatures);
