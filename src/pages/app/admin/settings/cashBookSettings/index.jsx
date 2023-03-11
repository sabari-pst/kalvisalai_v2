import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Button, Card, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Spin, Radio, Space, Tabs } from "antd";

import PsContext from "../../../../../context";
import { CardFixedTop, upperCase } from "../../../../../utils";
import PsModalWindow from "../../../../../utils/PsModalWindow";
import EditCashbook from "./editCashbook";
import AddCashBook from "./addCashBook";
import { ServiceUrl } from "../../../../../utils/serviceUrl";
import toast from "react-hot-toast";
import axios from "axios";
import { listCashbooks } from "../../../../../models/settings";

const CashBookSettings = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [editData, setEditData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const loadData = () => {
    setDataList([]);
    setLoader(true);
    listCashbooks().then((res) => {
      if (res) setDataList(res);
      setLoader(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (item) => {
    if (
      !window.confirm('Do you want to delete "' + item.cashbook_name + '"?')
    ) {
      return;
    }
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    axios.post(ServiceUrl.SETTINGS.DELETE_CASHBOOK, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Deleted");
        loadData();
      } else {
        toast.error(res["data"].message || "Errora");
      }
      setLoader(false);
    });
  };
  return (
    <>
      <CardFixedTop title="Cash Books">
        <ul className="list-inline mb-0">
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
        <Row>
          <Spin spinning={loader}>
            <div className="tableFixHead ps-table">
              <table className="table-hover">
                <thead>
                  <tr>
                    <th width="60">S.No</th>
                    <th>Cashbook Name</th>
                    <th width="120">Allow Aided</th>
                    <th width="120">Allow Un-Aided</th>
                    <th width="120">Allow Transport</th>
                    <th width="120">Allow Hostel</th>
                    <th width="120">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className={
                          item.active_status == "0" ? "bg-red-100" : ""
                        }
                      >
                        <td>{i + 1}</td>
                        <td>{item.cashbook_name}</td>
                        <td align="center">
                          {item.allow_aided == "1" && (
                            <span className="text-success fw-bold">Yes</span>
                          )}
                        </td>
                        <td align="center">
                          {item.allow_unaided == "1" && (
                            <span className="text-success fw-bold">Yes</span>
                          )}
                        </td>
                        <td align="center">
                          {item.allow_transport == "1" && (
                            <span className="text-success fw-bold">Yes</span>
                          )}
                        </td>
                        <td align="center">
                          {item.allow_hostel == "1" && (
                            <span className="text-success fw-bold">Yes</span>
                          )}
                        </td>
                        <td align="center">
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

                            <Button
                              type="button"
                              size="sm"
                              variant="transparent"
                              onClick={() => handleDelete(item)}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Spin>
        </Row>
      </div>
      <PsModalWindow
        title="Edit Cashbook"
        show={editModal}
        onHide={() => setEditModal(false)}
        size="md"
      >
        <EditCashbook
          dataSource={editData}
          afterFinish={() => {
            loadData();
            setEditModal(false);
          }}
        />
      </PsModalWindow>
      <PsModalWindow
        title="New Cashbook"
        show={addModal}
        onHide={() => setAddModal(false)}
        size="md"
      >
        <AddCashBook
          afterFinish={() => {
            loadData();
            setAddModal(false);
          }}
        />
      </PsModalWindow>
    </>
  );
};

export default CashBookSettings;
