import { Spin } from "antd";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import PsContext from "../../../../context";
import ModuleAccess from "../../../../context/moduleAccess";
import SelectedRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";

import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  momentDate,
  upperCase,
} from "../../../../utils";
import { ServiceUrl } from "../../../../utils/serviceUrl";

import CashbookLayout from "../../selectCashbook/cashbookLayout";

const ClassWiseFeeDelete = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState([]);

  const [payments, setPayments] = useState([]);
  const [paid, setPaid] = useState([]);
  const [unPaid, setUnPaid] = useState([]);
  const [unPaidSource, setUnPaidSource] = useState([]);

  const [deleteList, setDeleteList] = useState([]);

  useEffect(() => {
    console.log(selectedCourse);
    if (context.cashbook.id)
      if (selectedCourse && selectedCourse.course_id) loadPayments();
  }, [selectedCourse, JSON.stringify(context.cashbook)]);

  const loadPayments = () => {
    setLoader(true);
    const form = new FormData();
    form.append("student_uuid", "all");
    form.append("semester", selectedCourse.semester);
    form.append("academic_year", selectedCourse.academic_year);
    form.append("course_id", selectedCourse.course_id);
    form.append("section", selectedCourse.section);
    form.append("type", "unpaid");
    axios.post(ServiceUrl.FEES.LIST_PAYMENT, form).then((res) => {
      if (res["data"].status == "1") {
        let d = res["data"].data;

        setPayments(d);

        let ups = d.filter(
          (item) => item.bill_id == null && item.is_cancelled == 0
        );
        let x = groupByMultiple(ups, function (obj) {
          return [obj.student_uuid];
        });
        setUnPaid(x);
        setUnPaidSource(ups);
      } else {
      }
      setLoader(false);
    });
  };

  const resetAll = () => {
    setSelectedCourse([]);
    setUnPaid([]);
    setUnPaidSource([]);
    setPaid([]);
    setPayments([]);
    setDeleteList([]);
  };

  const getUnPaidTotal = (sour) => {
    let total = 0;
    sour.map(
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

  const handleDeleteAll = () => {
    if (!window.confirm("Do you want to delete")) return;
    setLoader(true);
    const form = new FormData();
    const item = unPaidSource[0];

    form.append("id_list", JSON.stringify(deleteList));
    form.append("course_id", item.course);
    form.append("academic_year", item.academic_year);
    form.append("cashbook_id", item.cashbook_id);
    form.append("semester", item.semester);

    axios.post(ServiceUrl.FEES.BULK_DELETE_ASSIGNED_FEE, form).then((res) => {
      if (res["data"].status == "1") {
        setDeleteList([]);
        toast.success(res["data"].message || "Success");
        loadPayments();
      } else {
        toast.error(res["data"].message || "Error");
      }
    });
  };

  const getTitle = () => {
    if (selectedCourse.course_id) {
      return `Class Wise Fee Delete > ${selectedCourse.academic_year} > ${
        selectedCourse.course_name
      } > ${selectedCourse.semester} Sem > ${upperCase(
        selectedCourse.section
      )}`;
    } else return "Class Wise Fee Delete";
  };

  const checkBoxClick = (item) => {
    let dl = [...deleteList];
    let exist = dl.findIndex((obj) => obj == item.id);
    if (exist > -1) dl = dl.filter((obj) => obj != item.id);
    else dl.push(item.id);
    setDeleteList(dl);
  };

  const checkExist = (item) => {
    let dl = [...deleteList];
    let exist = dl.findIndex((obj) => obj == item.id);
    return exist > -1 ? true : false;
  };

  const innerList = (items) => {
    return items.map((item, i) => {
      return (
        <tr key={i} className={checkExist(item) ? "bg-red-50" : ""}>
          <td align="center">{i + 1}</td>
          <td>
            <input
              type="checkbox"
              checked={checkExist(item)}
              onChange={(e) => checkBoxClick(item)}
            />
          </td>
          <td></td>
          <td className="" align="center">
            {momentDate(item.created_on, "DD-MM-YYYY")}
          </td>
          <td className="">{item.category_print_name || item.category_name}</td>
          <td align="center">{item.semester}</td>
          <td align="right" className="">
            {item.fee_amount}
          </td>
          <td align="center">
            <ModuleAccess
              module="fee_setting_delete_class_wise_duplicate"
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
    });
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title={getTitle()}>
          <ul className="list-inline mb-0">
            {deleteList.length > 0 && (
              <li className="list-inline-item fs-5">
                <ModuleAccess
                  module="fee_setting_delete_class_wise_duplicate"
                  action="action_delete"
                >
                  <Button
                    type="button"
                    size="sm"
                    variant="transparent"
                    className="border-start ms-2"
                    onClick={(e) => handleDeleteAll()}
                  >
                    <i className="fa-sharp fa-solid fa-trash-can me-1"></i>{" "}
                    Delete Selected
                  </Button>
                </ModuleAccess>
              </li>
            )}

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
          {(!selectedCourse || !selectedCourse.academic_year) && (
            <Row>
              <Col md={6}>
                <SelectedRecords
                  withSection={true}
                  onSuccess={(stu) => setSelectedCourse(stu)}
                />
              </Col>
            </Row>
          )}

          {selectedCourse && selectedCourse.academic_year && (
            <div>
              <Spin spinning={loader}>
                <div
                  className="tableFixHead ps-table bg-white mt-2"
                  style={{ height: "calc(100vh - 120px)" }}
                >
                  <table>
                    <thead>
                      <tr>
                        <th width="50">S.No</th>
                        <th>Reg.No</th>
                        <th>Student Name</th>
                        <th width="120">Assigned On</th>
                        <th>Fee Category Name</th>
                        <th width="80">Sem</th>
                        <th width="150">Amount</th>
                        <th width="90">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unPaid.map((items, i) => {
                        let item = items[0];
                        return (
                          <>
                            <tr key={i}>
                              <td align="center">{i + 1}</td>
                              <td>{item.registerno || item.admissionno}</td>
                              <td>
                                {item.student_name} {item.initial}
                              </td>
                              <td colSpan={5}></td>
                            </tr>
                            {innerList(items)}
                            <tr>
                              <td colSpan={5}></td>
                              <td align="right">Total :</td>
                              <td align="right">
                                <b>{getUnPaidTotal(items)}</b>
                              </td>
                              <td></td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-light">
                      <tr className="fw-bold ">
                        <td></td>
                        <td align="" colSpan={4}>
                          Total Records in list {unPaid.length}
                        </td>
                        <td align="right" className="">
                          Total :{" "}
                        </td>
                        <td align="right" className="">
                          {getUnPaidTotal(unPaidSource)}
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

export default ClassWiseFeeDelete;
