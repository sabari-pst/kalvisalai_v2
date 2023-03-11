import { Spin, Table } from "antd";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";

import PsContext from "../../../../context";

import {
  CardFixedTop,
  jsonToQuery,
  momentDate,
  upperCase,
  yearByBatch,
} from "../../../../utils";
import { DEFAULT_PAGE_LIST_SIZE } from "../../../../utils/data";

import { ServiceUrl } from "../../../../utils/serviceUrl";

import CashbookLayout from "../../selectCashbook/cashbookLayout";

const FineDefinitionLogs = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: DEFAULT_PAGE_LIST_SIZE,
    },
    total: 0,
  });

  useEffect(() => {
    if (context.cashbook.id) loadData();
  }, [JSON.stringify(context.cashbook)]);

  const getRandomuserParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    name: params.pagination?.name,
  });

  useEffect(() => {
    if (!loader) loadData();
  }, [JSON.stringify(tableParams.pagination)]);

  const loadData = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    const form = new FormData();
    axios
      .get(
        ServiceUrl.FEES.LIST_FINE_LOGS +
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
            },
          });
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
      title: "Date",
      dataIndex: "created_on",
      render: (text, record) => momentDate(record.created_on, "DD-MMM-YYYY"),
    },
    { title: "Type", dataIndex: "course_type", width: 100 },
    { title: "Batch", dataIndex: "batch" },
    { title: "Sem", dataIndex: "semester" },
    { title: "Category", dataIndex: "category_name" },
    { title: "Amount", dataIndex: "fine_amount", width: 100 },
    { title: "Records", dataIndex: "insert_count", width: 120 },
  ];

  return (
    <>
      <CashbookLayout>
        <CardFixedTop title="Fine Definition Logs">
          <ul className="list-inline mb-0"></ul>
        </CardFixedTop>

        <div className="container py-3">
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
                onChange={handleTableChange}
                scroll={{ y: "calc(100vh - 250px)" }}
              />
            </Card.Body>
          </Card>
        </div>
      </CashbookLayout>
    </>
  );
};

export default FineDefinitionLogs;
