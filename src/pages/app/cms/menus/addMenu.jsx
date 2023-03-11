import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import PsContext from "../../../../context";
import { capitalizeFirst, CardFixedTop, upperCase } from "../../../../utils";
import axios from "axios";
import {
  Spin,
  Row,
  Col,
  message,
  DatePicker,
  Form,
  Input,
  Select,
  Button,
  Card,
  Upload,
  Collapse,
  Space,
  Radio,
  Switch,
} from "antd";
import { PsCollapse } from "../../components";
import { contentTypes } from "../../../../utils/data";
import { baseUrl } from "../../../../utils";
import moment from "moment";
import { ServiceUrl } from "../../../../utils/serviceUrl";
const AddMenu = (props) => {
  const history = useHistory();
  const [addForm] = Form.useForm();
  const { Option } = Select;
  const { Panel } = Collapse;
  const context = useContext(PsContext);
  const { TextArea } = Input;
  const { dataItem, onFinish, onCancel } = props;
  const [pageData, setPageData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selLinkType, setSelLinkType] = useState("page");

  useEffect(() => {
    LoadPages();
    addForm.setFieldsValue({ linktype: "page" });
  }, []);

  const LoadPages = () => {
    var form = new FormData();
    form.append("type", "page");
    axios.post(ServiceUrl.WEBSITE_CMS.LIST_PAGES + "?type=page").then((res) => {
      if (res["data"].status === "1") {
        setLoader(false);
        setPageData(res["data"].data);
      } else {
        message.error(res["data"].message || "Error");
        setLoader(false);
      }
    });
  };

  const onFinishForm = (values) => {
    setLoader(true);
    var processedValues = {};
    Object.entries(values).forEach(([key, value], index) => {
      if (value) {
        processedValues[key] = value;
      }
    });
    if (values.activestatus) processedValues["activestatus"] = "active";
    else processedValues["activestatus"] = "inactive";
    if (values.menulink) {
      var PageSlugData = pageData.find((item) => item.id === values.menulink);
      if (PageSlugData) {
        processedValues["postid"] = values.menulink;
        processedValues["menulink"] = PageSlugData.seo_slug;
      }
    }
    processedValues["parentid"] = dataItem.parentid;
    processedValues["menuorder"] = parseInt(dataItem.menuorder || 0) + 1;

    var form = new FormData();
    Object.entries(processedValues).forEach(([key, value], index) => {
      form.append(key, value);
    });

    axios.post("v1/admin/website-cms/add-menu", form).then((res) => {
      if (res["data"].status === "1") {
        message.success(res["data"].message || "Success");
        setLoader(false);
        onFinish();
      } else {
        message.error(res["data"].message || "Error");
        setLoader(false);
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onLinkTypeChange = (e) => {
    setSelLinkType(e.target.value);
  };
  return (
    <>
      <Spin spinning={loader}>
        <Form
          name="basic"
          //layout = 'vertical'
          form={addForm}
          labelAlign="left"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={onFinishForm}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Enter title" }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            label="Link Type"
            name="linktype"

            // rules={[{ required: true, message: 'Page Link is required' }]}
          >
            <Radio.Group
              defaultValue="page"
              buttonStyle="solid"
              onChange={onLinkTypeChange}
            >
              <Radio.Button value="page">Page</Radio.Button>
              <Radio.Button value="custom">Custom</Radio.Button>
              <Radio.Button value="external">External</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {selLinkType === "page" && (
            <>
              <Form.Item
                label="Page Link"
                name="menulink"
                rules={[{ required: true, message: "Page Link is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Page Link"
                  optionFilterProp="children"
                  //onChange={courseStatusOnChange}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {pageData.map((d) => (
                    <Option key={d.id}>{d.title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
          {selLinkType !== "page" && (
            <>
              <Form.Item
                label="Page Link"
                name="menulink"
                rules={[{ required: true, message: "Page Link is required" }]}
              >
                <Input />
              </Form.Item>
            </>
          )}

          <Form.Item
            label="Status"
            name="activestatus"
            valuePropName="checked"

            // rules={[{ required: true, message: 'Page Link is required' }]}
          >
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
            <Space>
              <Button
                type="primary"
                style={{ background: "grey" }}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default AddMenu;
