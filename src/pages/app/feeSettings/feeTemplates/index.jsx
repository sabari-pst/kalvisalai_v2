import React, { useState, useContext, useEffect, useRef } from "react";
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

import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  upperCase,
} from "../../../../utils";

import axios from "axios";

import { ServiceUrl } from "../../../../utils/serviceUrl";
import { Spin, Table } from "antd";
import SelectRecords from "../../feeAssigning/classWiseFeeAssigning/selectRecords";
import { listFeeCategoy } from "../../../../models/fees";
import LoaderSubmitButton from "../../../../utils/LoaderSubmitButton";
import CashbookLayout from "../../selectCashbook/cashbookLayout";

const FeeTemplates = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [selecteRecords, setSelectedRecords] = useState([]);
  const buttonRef = useRef(null);

  const [categories, setCategories] = useState([]);

  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [valuesToUpdate, setValuesToUpdate] = useState([]);

  useEffect(() => {
    listFeeCategoy("1").then((res) => res && setCategories(res));
  }, []);

  useEffect(() => {
    if (context.cashbook.id) {
      if (selecteRecords && selecteRecords.course_type) {
        loadData();
      }
    }
  }, [selecteRecords, JSON.stringify(context.cashbook)]);

  const loadData = () => {
    setLoader(true);
    const form = new FormData();
    form.append("academic_year", selecteRecords.academic_year);
    form.append("semester", selecteRecords.semester);
    axios.post(ServiceUrl.FEES.LIST_TEMPLATES, form).then((res) => {
      if (res["data"].status == "1") {
        setDataList(res["data"].data);
      }
      setLoader(false);
    });
  };

  const columns = () => {
    if (selecteRecords && selecteRecords.course_type) {
      let s = JSON.parse(selecteRecords.courses);
      let dv = [];
      dv.push({
        title: "S.No",
        dataIndex: "id",
        fixed: "left",
        width: 50,
      });
      dv.push({
        title: "Course Name",
        dataIndex: "course_name",
        fixed: "left",
        width: 250,
      });

      categories.map((cat, j) => {
        dv.push({
          title: cat.category_name,
          dataIndex: cat.id,
          width: 150,
          render: (text, record, index) =>
            context.allowedAccess(
              "fee_settings_feetemplate",
              "action_create"
            ) ? (
              <Form.Control
                type="number"
                size="sm"
                className="text-end fw-bold"
                onChange={(e) => updateAmount(record, cat.id, e)}
                value={getAmount(record, cat.id)}
              />
            ) : (
              <span>{getAmount(record, cat.id)}</span>
            ),
        });
      });
      dv.push({
        title: "Total",
        dataIndex: "total",
        fixed: "right",
        width: 100,
        align: "right",
        render: (text, record, index) => <b>{getTotal(record)}</b>,
      });
      return dv;
    }
  };

  const getSource = () => {
    if (selecteRecords && selecteRecords.course_type) {
      let s = JSON.parse(selecteRecords.courses);
      let dv = [];
      s.map((item, i) => {
        let x = [];
        x["id"] = i + 1;
        x["course_id"] = item.id;
        let ty = upperCase(item.coursetype) == "SELF" ? "SF" : "R";
        x["course_name"] = `${item.degreename} - ${item.name} ${ty})`;
        categories.map((cat, j) => {
          x[cat.id] = cat.category_name;
        });
        dv.push(x);
      });

      return dv;
    }
  };

  const getTotal = (item) => {
    let dl = dataList;
    let courseData = dl.filter((obj) => obj.course_id == item.course_id);
    let total = 0;
    courseData.map(
      (item) =>
        item.fee_category_amount &&
        (total = parseFloat(total) + parseFloat(item.fee_category_amount))
    );
    return parseFloat(total).toFixed(2);
  };

  const getAmount = (item, catId) => {
    let dl = dataList;
    let index = dl.findIndex(
      (obj) => obj.fee_category_id == catId && obj.course_id == item.course_id
    );
    return index > -1 ? dl[index]["fee_category_amount"] : "";
  };

  const updateAmount = (item, catId, e) => {
    let dl = [...dataList];
    let vu = [...valuesToUpdate];
    let index = dl.findIndex(
      (obj) => obj.fee_category_id == catId && obj.course_id == item.course_id
    );

    let i = vu.findIndex(
      (obj) => obj.fee_category_id == catId && obj.course_id == item.course_id
    );

    if (index > -1) {
      dl[index]["fee_category_amount"] = e.target.value;

      if (i > -1) {
        vu[i]["fee_category_amount"] = e.target.value;
      } else {
        vu.push({
          template_id: dl[index]["id"],
          course_id: item.course_id,
          fee_category_id: catId,
          fee_category_amount: e.target.value,
        });
      }
    } else {
      dl.push({
        course_id: item.course_id,
        fee_category_id: catId,
        fee_category_amount: e.target.value,
      });
      vu.push({
        course_id: item.course_id,
        fee_category_id: catId,
        fee_category_amount: e.target.value,
      });
    }

    setValuesToUpdate(vu);
    setDataList(dl);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (valuesToUpdate.length < 1) {
      toast.error("There is no changes to update");
      return;
    }
    if (!window.confirm("Do you want to update")) return;
    setLoader(true);
    axios
      .post(ServiceUrl.FEES.SAVE_TEMPLATE, new FormData(e.currentTarget))
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");
          setValuesToUpdate([]);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Fee Templates">
          <ul className="list-inline mb-0">
            <ModuleAccess
              module={"fee_settings_feetemplate"}
              action={"action_create"}
            >
              {selecteRecords && selecteRecords.course_type && (
                <li className="list-inline-item">
                  <Button
                    type="button"
                    onClick={(e) => buttonRef.current.click()}
                    disabled={loader}
                    size="sm"
                  >
                    <i className="fa-solid fa-check px-2"></i>Update Template
                  </Button>
                </li>
              )}
            </ModuleAccess>
            <li className="list-inline-item border-start ms-2">
              <Button
                type="button"
                onClick={(e) => {
                  setSelectedRecords([]);
                  setDataList([]);
                  setValuesToUpdate([]);
                  setDataView([]);
                }}
                disabled={loader}
                variant="transparent"
              >
                <i className="fa-solid fa-xmark px-2"></i> Reset
              </Button>
            </li>
          </ul>
        </CardFixedTop>

        <div className="container">
          {selecteRecords && !selecteRecords.course_type && (
            <Row className="mt-4">
              <Col md={6}>
                <SelectRecords
                  wihtOutProgram={true}
                  onSuccess={(r) => setSelectedRecords(r)}
                />
              </Col>
            </Row>
          )}

          {selecteRecords && selecteRecords.course_type && (
            <>
              <Table
                columns={columns()}
                loading={loader}
                size="small"
                scroll={{ y: "calc(100vh - 150px)" }}
                dataSource={getSource()}
                pagination={{ pageSize: 100 }}
              />

              <form
                action=""
                method="post"
                id="frm_add_fee_template_v2"
                onSubmit={handleFormSubmit}
              >
                <input
                  type="hidden"
                  name="template"
                  value={JSON.stringify(valuesToUpdate)}
                />
                <input
                  type="hidden"
                  name="academic_year"
                  value={selecteRecords.academic_year}
                />
                <input
                  type="hidden"
                  name="semester"
                  value={selecteRecords.semester}
                />
                <Button
                  type="submit"
                  ref={buttonRef}
                  size="sm"
                  disabled={loader}
                >
                  Update Template
                </Button>
              </form>
            </>
          )}
        </div>
      </CashbookLayout>
    </>
  );
};

export default FeeTemplates;
