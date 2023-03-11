import { Spin } from "antd";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import PsContext from "../../../../context";
import ModuleAccess from "../../../../context/moduleAccess";

import {
  capitalizeFirst,
  CardFixedTop,
  momentDate,
  upperCase,
} from "../../../../utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import SearchStudent from "../../feePayment/newFeePayment/searchStudent";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const FeeDelete = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState([]);

  const [payments, setPayments] = useState([]);
  const [paid, setPaid] = useState([]);
  const [unPaid, setUnPaid] = useState([]);
  const [unPaidSource, setUnPaidSource] = useState([]);

  useEffect(() => {
    if (context.cashbook.id)
      if (selectedStudent && selectedStudent.uuid) loadPayments();
  }, [selectedStudent, JSON.stringify(context.cashbook)]);

  const loadPayments = () => {
    setLoader(true);
    const form = new FormData();
    form.append("student_uuid", selectedStudent.uuid);
    form.append("type", "all");
    axios.post(ServiceUrl.FEES.LIST_PAYMENT, form).then((res) => {
      if (res["data"].status == "1") {
        let d = res["data"].data;

        setPayments(d);

        let ups = d.filter(
          (item) => item.bill_id == null && item.is_cancelled == 0
        );
        setUnPaid(ups);
        setUnPaidSource(ups);
      } else {
      }
      setLoader(false);
    });
  };

  const resetAll = () => {
    setSelectedStudent([]);
    setUnPaid([]);
    setUnPaidSource([]);
    setPaid([]);
    setPayments([]);
  };

  const getUnPaidTotal = () => {
    let total = 0;
    unPaid.map(
      (item) => (total = parseFloat(total) + parseFloat(item.fee_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  const field = (fieldName) => {
    if (payments && payments.length > 0 && payments[0][fieldName])
      return [payments[0][fieldName]];
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to delete")) return;
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    form.append("student_uuid", item.student_uuid);
    form.append("cashbook_id", item.cashbook_id);
    form.append("semester", item.semester);
    form.append("fee_category_id", item.fee_category_id);
    form.append("fee_amount", item.fee_amount);
    axios.post(ServiceUrl.FEES.DELETE_ASSIGNED_FEE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        loadPayments();
      } else {
        toast.error(res["data"].message || "Error");
      }
    });
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Delete Assigned Fee">
          <ul className="list-inline mb-0">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => resetAll()}
              >
                <i className="fa fa-xmark fs-6 px-1"></i> Reset
              </Button>
            </li>
          </ul>
        </CardFixedTop>

        <div className="container py-2">
          {(!selectedStudent || !selectedStudent.id) && (
            <Row>
              <Col md={10}>
                <SearchStudent onSuccess={(stu) => setSelectedStudent(stu)} />
              </Col>
            </Row>
          )}

          {selectedStudent && selectedStudent.id && (
            <div>
              <Spin spinning={loader}>
                <Row>
                  <Col md={3}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Adm. No / Reg. No</InputGroup.Text>
                      <Form.Control
                        type="text"
                        size="sm"
                        className="fw-bold "
                        value={field("registerno") || field("admissionno")}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={5}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Name</InputGroup.Text>
                      <Form.Control
                        type="text"
                        size="sm"
                        className="fw-bold "
                        value={field("student_name")}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <InputGroup size="sm">
                      <InputGroup.Text>Course</InputGroup.Text>
                      <Form.Control
                        type="text"
                        size="sm"
                        className="fw-bold "
                        value={`${field("degree_name")}-${field(
                          "course_name"
                        )} ${field("course_type") == "self" ? "(SF)" : "(R)"}`}
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <div
                  className="tableFixHead ps-table bg-white mt-2"
                  style={{ height: "calc(100vh - 250px)" }}
                >
                  <table>
                    <thead>
                      <tr>
                        <th width="50">S.No</th>
                        <th width="120">Assigned On</th>
                        <th>Fee Category Name</th>
                        <th width="80">Sem</th>
                        <th width="150">Amount</th>
                        <th width="90">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unPaid.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td align="center">{i + 1}</td>
                            <td className="" align="center">
                              {momentDate(item.created_on, "DD-MM-YYYY")}
                            </td>
                            <td className="">
                              {item.category_print_name || item.category_name}
                            </td>
                            <td align="center">{item.semester}</td>
                            <td align="right" className="">
                              {item.fee_amount}
                            </td>
                            <td align="center">
                              <ModuleAccess
                                module="fee_settings_delete"
                                action="action_delete"
                              >
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="transparent"
                                  onClick={(e) => handleDelete(item)}
                                >
                                  <i className="fa-sharp fa-solid fa-trash-can fs-6"></i>
                                </Button>
                              </ModuleAccess>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-light">
                      <tr className="fw-bold ">
                        <td></td>
                        <td align="" colSpan={2}>
                          Total Records in list {unPaid.length}
                        </td>
                        <td align="right" className="">
                          Total :{" "}
                        </td>
                        <td align="right" className="">
                          {getUnPaidTotal()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Spin>
            </div>
          )}
        </div>
      </CashbookLayout>
    </>
  );
};

export default FeeDelete;
