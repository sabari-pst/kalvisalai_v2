import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import {
  Badge,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";
import ModuleAccess from "../../../../context/moduleAccess";

import { capitalizeFirst, CardFixedTop, upperCase } from "../../../../utils";
import NewFeeCategory from "./newFeeCategory";
import { listFeeCategoy } from "../../../../models/fees";
import axios from "axios";
import { formatCountdown } from "antd/lib/statistic/utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { Spin } from "antd";
import EditFeeCategory from "./editFeeCategory";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const FeeCategory = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);
  const [viewData, setViewData] = useState([]);

  useEffect(() => {
    if (context.cashbook.id) loadData();
  }, [JSON.stringify(context.cashbook)]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    listFeeCategoy().then((res) => {
      if (res) {
        setDataList(res);
        setDataView(res);
      }
      setLoader(false);
    });
  };

  const handleSearch = (e) => {
    let v = upperCase(e.target.value);
    let d = dataList.filter(
      (item) => upperCase(item.category_name).indexOf(v) > -1
    );
    setDataView(d);
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to delete?")) {
      return false;
    }

    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    axios.post(ServiceUrl.FEE_CATEGORY.DELETE_CATEGORY, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        setDataView(dataList.filter((obj) => obj.id !== item.id));
      } else toast.error(res["data"].message || "Error");

      setLoader(false);
    });
  };

  const handleEdit = (item) => {
    setViewData(item);
    setEditModal(true);
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Fee Category">
          <ul className="list-inline mb-0">
            <ModuleAccess
              module={"fee_settings_category"}
              action={"action_create"}
            >
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
                onClick={(e) => loadData()}
              >
                <i className="fa fa-rotate fs-5 px-1"></i>
              </Button>
            </li>
          </ul>
        </CardFixedTop>

        <div className="container mt-2">
          <Row className="">
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroup.Text>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e)}
                />
              </InputGroup>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12}>
              <Spin spinning={loader}>
                <div
                  className="tableFixHead ps-table"
                  style={{ maxHeight: "calc(100vh - 150px)" }}
                >
                  <table>
                    <thead>
                      <tr>
                        <th width="60">S.No</th>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Print Name</th>
                        <th>Account No</th>
                        <th>Bank Account</th>
                        <th>Sub Account</th>
                        <th width="100" className="text-end">
                          Amount
                        </th>
                        <th width="120" className="text-center">
                          Online Pay
                        </th>
                        <th width="120" className="text-center">
                          Status
                        </th>
                        <th width="100" className="text-center">
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
                            <td>{item.id}</td>
                            <td>{item.category_name}</td>
                            <td>{item.category_print_name}</td>
                            <td align="">{item.category_account_no}</td>
                            <td align="">{item.bank_print_name}</td>
                            <td align="">{item.sub_account_id}</td>
                            <td align="right">{item.category_amount}</td>
                            <td align="center">
                              {item.allow_online_pay == "1" ? (
                                <Badge size="sm" bg="success">
                                  Yes
                                </Badge>
                              ) : (
                                "No"
                              )}
                            </td>
                            <td align="center">
                              {item.active_status == "1" ? (
                                <Badge size="sm" bg="success">
                                  Active
                                </Badge>
                              ) : (
                                <Badge size="sm" bg="danger">
                                  In-Active
                                </Badge>
                              )}
                            </td>
                            <td align="center">
                              <ModuleAccess
                                module={"fee_settings_category"}
                                action={"action_update"}
                              >
                                <Button
                                  size="sm"
                                  variant="transparent"
                                  title="Edit"
                                  onClick={(e) => handleEdit(item, e)}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </Button>
                              </ModuleAccess>
                              <ModuleAccess
                                module={"fee_settings_category"}
                                action={"action_delete"}
                              >
                                <Button
                                  size="sm"
                                  variant="transparent"
                                  title="Delete"
                                  onClick={(e) => handleDelete(item)}
                                >
                                  <i className="fa-regular fa-trash-can"></i>
                                </Button>
                              </ModuleAccess>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Spin>
            </Col>
          </Row>
        </div>
      </CashbookLayout>

      {addModal && (
        <NewFeeCategory
          title="New Fee Category"
          size="md"
          show={addModal}
          onSuccess={(e) => loadData()}
          onHide={(e) => setAddModal(false)}
        />
      )}

      {editModal && (
        <EditFeeCategory
          title="Edit Fee Category"
          size="md"
          show={editModal}
          onSuccess={(e) => {
            setEditModal(false);
            loadData();
          }}
          onHide={(e) => setEditModal(false)}
          dataSource={viewData}
        />
      )}
    </>
  );
};

export default FeeCategory;
