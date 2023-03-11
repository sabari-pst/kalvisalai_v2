import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../../context";
import { CardFixedTop, getFileLiveUrl, upperCase } from "../../../../utils";
import { Image, Spin, Tabs } from "antd";

import DepartmentCmsLayout from "../departmentCmsLayout";
import SyllabusPageContent from "./syllabusPageContent";
import SyllabusList from "./syllabusList";

const DeptSyllabus = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [currentTab, setCurrentTab] = useState("list");

  return (
    <DepartmentCmsLayout>
      <CardFixedTop title="Syllabus">
        <ul className="list-inline mb-0">
          <li className="list-inline-item"></li>
        </ul>
      </CardFixedTop>
      <div className="container">
        <Tabs onChange={(key) => setCurrentTab(key)} activeKey={currentTab}>
          <Tabs.TabPane key="list" tab="Syllabus List" />
          <Tabs.TabPane key="content" tab="Syllabus Page Content" />
        </Tabs>
        {currentTab == "list" && <SyllabusList />}
        {currentTab == "content" && <SyllabusPageContent />}
      </div>
    </DepartmentCmsLayout>
  );
};

export default withRouter(DeptSyllabus);
