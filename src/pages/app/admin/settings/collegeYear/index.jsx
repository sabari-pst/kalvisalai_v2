import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Button, Card, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Spin, Radio, Space, Tabs } from "antd";

import PsContext from "../../../../../context";
import ModuleAccess from "../../../../../context/moduleAccess";
import { CardFixedTop, upperCase } from "../../../../../utils";
import PsModalWindow from "../../../../../utils/PsModalWindow";

import { ServiceUrl } from "../../../../../utils/serviceUrl";
import toast from "react-hot-toast";
import axios from "axios";
import AddCollegeYear from "./addCollegeYear";
import EditCollegeYear from "./editCollegeYear";

const CollegeYear = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [editData, setEditData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const loadData = () => {
    setDataList([]);
    setDataView([]);
    setLoader(true);

    axios.post(ServiceUrl.SETTINGS.LIST_COLLEGE_YEAR).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
        setDataView(res["data"].data);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (item) => {
    if (!window.confirm('Do you want to delete "' + item.name + '"?')) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    axios.post(ServiceUrl.ADMISSION.DELETE_SMS_TEMPLATES, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Deleted");
        loadData();
      } else {
        toast.error(res["data"].message || "Errora");
      }
      setLoader(false);
    });
  };

  const handleSearch = (e) => {
    let v = upperCase(e.target.value);
    let d = dataList.filter(
      (item) => upperCase(item.college_year).indexOf(v) > -1
    );
    setDataView(d);
  };
  return (
    <>
      <CardFixedTop title="College Year">
        <ul className="list-inline mb-0">
          <ModuleAccess module="settings_college_year" action="action_create">
            <li className="list-inline-item">
              <Button
                type="button"
                variant="white"
                className="border-start ms-2"
                onClick={() => setAddModal(true)}
              >
                <i className="fa-solid fa-plus pe-1"></i> New
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={loadData}
            >
              <i className="fa fa-rotate fs-5 px-1"></i>
            </Button>
          </li>
        </ul>
      </CardFixedTop>
      <div className="container mt-2">
        <Row className="mb-2">
          <Col md={3}>
            <InputGroup size="sm">
              <InputGroup.Text>
                <i className="fa-solid fa-magnifying-glass"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search"
                onChange={handleSearch}
              />
            </InputGroup>
          </Col>
        </Row>
        <Spin spinning={loader}>
          <div className="tableFixHead ps-table">
            <table className="table-hover">
              <thead>
                <tr>
                  <th width="60">S.No</th>
                  <th>College Year</th>
                  <th>Start Year</th>
                  <th>End Year</th>
                  <th>Current Sem</th>
                  <th width="100">Manage</th>
                </tr>
              </thead>
              <tbody>
                {dataView.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td align="center">{i + 1}</td>
                      <td>{item.college_year}</td>
                      <td className="text-primarys">{item.start_year}</td>
                      <td>{item.end_year}</td>
                      <td>
                        {item.current_semester == 1
                          ? "ODD"
                          : item.current_semester == "0"
                          ? "EVEN"
                          : ""}
                      </td>
                      <td align="center">
                        <ModuleAccess
                          module="settings_college_year"
                          action="action_update"
                        >
                          <div class="btn-group">
                            <Button
                              type="button"
                              size="sm"
                              variant="transparent"
                              onClick={() => {
                                setEditData(item);
                                setEditModal(true);
                              }}
                            >
                              <i className="fa-solid fa-pencil"></i>
                            </Button>
                          </div>
                        </ModuleAccess>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Spin>
      </div>
      <PsModalWindow
        title="Edit Template"
        show={editModal}
        onHide={() => setEditModal(false)}
      >
        <EditCollegeYear
          dataSource={editData}
          afterFinish={() => {
            loadData();
            setEditModal(false);
          }}
          onHide={() => setEditModal(false)}
        />
      </PsModalWindow>
      <PsModalWindow
        title="Add College Year"
        show={addModal}
        onHide={() => setAddModal(false)}
      >
        <AddCollegeYear
          afterFinish={() => {
            loadData();
          }}
          onHide={() => setAddModal(false)}
        />
      </PsModalWindow>
    </>
  );
};

export default CollegeYear;
