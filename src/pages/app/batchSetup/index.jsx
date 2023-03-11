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

import PsContext from "../../../context";
import {
  capitalizeFirst,
  CardFixedTop,
  groupByMultiple,
  momentDate,
  upperCase,
} from "../../../utils";
import { Spin, Tabs } from "antd";
import PsModalWindow from "../../../utils/PsModalWindow";

import AddBatch from "./addBatch";
import { listBatches } from "../../../models/academicYears";
import BatchListCard from "./batchListCard";
import ModuleAccess from "../../../context/moduleAccess";
import { COURSE_TYPE_SORT_ORDER } from "../../../utils/data";

const BatchSetup = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [activeKey, setActiveKey] = useState(COURSE_TYPE_SORT_ORDER[0]);

  useEffect(() => {
    getReport();
  }, []);

  const resetAll = () => {
    setDataView([]);
    setDataList([]);
  };

  const getReport = () => {
    setLoader(true);
    setDataList([]);
    setDataView([]);
    const form = new FormData();
    listBatches().then((res) => {
      if (res) {
        setDataList(res);
        setDataView(res);
      }
      setLoader(false);
    });
  };

  const getData = (type) =>
    dataList.filter((item) => upperCase(item.type) == upperCase(type));

  return (
    <>
      <CardFixedTop title="Batch Setup">
        <ul className="list-inline mb-0">
          <ModuleAccess module="settings_batch_semester" action="action_create">
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
          <Tabs onChange={(k) => setActiveKey(k)}>
            {/*} <Tabs.TabPane tab="UG" key="ug" />
            <Tabs.TabPane tab="UG5Y" key="ug5y" />
            <Tabs.TabPane tab="PG" key="pg" />
            <Tabs.TabPane tab="MPhil" key="mphil" />
            <Tabs.TabPane tab="PhD" key="phd" />
            <Tabs.TabPane tab="Diploma" key="diploma" />
*/}
            {COURSE_TYPE_SORT_ORDER.map((item) => (
              <Tabs.TabPane tab={upperCase(item)} key={item} />
            ))}
          </Tabs>

          {dataList && dataList.length > 0 && (
            <BatchListCard
              dataSource={getData(activeKey)}
              onSuccess={getReport}
            />
          )}

          {/*} {activeKey == "ug" && (
            <BatchListCard dataSource={getData("ug")} onSuccess={getReport} />
          )}
          {activeKey == "ug5y" && (
            <BatchListCard dataSource={getData("ug5y")} onSuccess={getReport} />
          )}
          {activeKey == "pg" && (
            <BatchListCard dataSource={getData("pg")} onSuccess={getReport} />
          )}
          {activeKey == "mphil" && (
            <BatchListCard
              dataSource={getData("mphil")}
              onSuccess={getReport}
            />
          )}
          {activeKey == "phd" && (
            <BatchListCard dataSource={getData("phd")} onSuccess={getReport} />
          )}
          {activeKey == "diploma" && (
            <BatchListCard
              dataSource={getData("diploma")}
              onSuccess={getReport}
            />
          )}*/}
        </Spin>
      </div>

      <PsModalWindow
        title="Add Batch"
        onHide={(e) => setShowAdd(false)}
        show={showAdd}
      >
        <AddBatch onSuccess={(e) => getReport()} />
      </PsModalWindow>
    </>
  );
};

export default withRouter(BatchSetup);
