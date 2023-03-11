import React, { useState, useEffect, useContext, useCallback } from "react";
import $ from "jquery";
import { Link, useHistory, withRouter } from "react-router-dom";

import PsContext from "../../../../context";
import { CardFixedTop, getFileLiveUrl, upperCase } from "../../../../utils";
import { Image, Spin } from "antd";

import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
import { toast } from "react-hot-toast";
import DepartmentCmsLayout from "../departmentCmsLayout";
import { listAllCoursesV2 } from "../../../../models/courses";
import ModuleAccess from "../../../../context/moduleAccess";
import PsModalWindow from "../../../../utils/PsModalWindow";
import AddSlider from "./addSlider";

const DeptSliders = (props) => {
  const context = useContext(PsContext);
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [addModal, setAddModal] = useState(false);

  useEffect(() => {
    if (context.user.academic_department) loadData();
  }, [JSON.stringify(context.user)]);

  const loadData = () => {
    setLoader(true);
    axios
      .get(
        ServiceUrl.DEPT_CMS.LIST_SLIDERS +
          "?status=1&academic_department=" +
          context.user.academic_department
      )
      .then((res) => {
        if (res["data"].status == "1") {
          setDataList(res["data"].data);
          setDataView(res["data"].data);
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  const handleDelete = (item) => {
    if (!window.confirm("Do you want to delete ?")) return;
    setLoader(true);
    const form = new FormData();
    form.append("id", item.id);
    form.append("academic_department", context.user.academic_department);
    axios.post(ServiceUrl.DEPT_CMS.DELETE_SLIDER, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Deleted");
        let dv = dataList.filter((obj) => obj.id != item.id);
        setDataList(dv);
        setDataView(dv);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  return (
    <DepartmentCmsLayout>
      <CardFixedTop title="Sliders">
        <ul className="list-inline mb-0">
          <ModuleAccess module="dept_cms_sliders" action="action_create">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => setAddModal(true)}
              >
                <i className="fa-solid fa-plus fs-6 px-1"></i> New Slider
              </Button>
            </li>
          </ModuleAccess>
          <li className="list-inline-item">
            <Button
              variant="white"
              className="border-start ms-2"
              onClick={(e) => loadData()}
            >
              <i className="fa-solid fa-rotate-right fs-6 px-1"></i> Refresh
            </Button>
          </li>
        </ul>
      </CardFixedTop>
      <div className="container py-3">
        <Spin spinning={loader}>
          <div className="tableFixHead ps-table">
            <table>
              <thead>
                <tr>
                  <th width="90">S.No</th>
                  <th>Slider Image</th>
                  <th width="60">Order</th>
                  <th width="70">Manage</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <Image
                          src={getFileLiveUrl(item.file_path)}
                          preview={{
                            src: getFileLiveUrl(item.file_path, true),
                          }}
                        />
                      </td>
                      <td align="center">{item.display_order}</td>
                      <td align="center">
                        <ModuleAccess
                          module="dept_cms_sliders"
                          action="action_delete"
                        >
                          <Button
                            type="button"
                            size="sm"
                            variant="white"
                            onClick={(e) => handleDelete(item)}
                          >
                            <i className="fa fa-trash-can fs-6"></i>
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
      </div>

      {addModal && (
        <PsModalWindow
          show={addModal}
          onHide={(e) => setAddModal(false)}
          title="Add Slider"
          size="md"
        >
          <AddSlider
            onSuccess={(e) => {
              setAddModal(false);
              loadData();
            }}
          />
        </PsModalWindow>
      )}
    </DepartmentCmsLayout>
  );
};

export default withRouter(DeptSliders);
