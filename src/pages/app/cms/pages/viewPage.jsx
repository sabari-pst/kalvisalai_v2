import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import $ from "jquery";
import { Badge, ButtonGroup, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

import PsContext from "../../../../context";

import { capitalizeFirst, CardFixedTop, upperCase } from "../../../../utils";
import axios from "axios";
import { ServiceUrl } from "../../../../utils/serviceUrl";
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
  Image,
} from "antd";
import { PsCollapse } from "../../components";
import { contentTypes } from "../../../../utils/data";
import { baseUrl } from "../../../../utils";
import moment from "moment";

import ImgCrop from "antd-img-crop";
// Editor styles

const ViewPage = (props) => {
  const history = useHistory();
  const [addForm] = Form.useForm();
  const { Option } = Select;
  const { Panel } = Collapse;
  const context = useContext(PsContext);
  const { TextArea } = Input;
  const [contentType] = useState(props.match.params.content_type);
  const [contentId] = useState(props.match.params.id);
  const [viewData, setViewData] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    loadData(contentId);
  }, [contentType]);
  const loadData = (id) => {
    setLoader(true);
    var form = new FormData();
    form.append("id", id);
    form.append("type", contentType);
    axios.post("v1/admin/website-cms/list", form).then((res) => {
      if (res["data"].status === "1") {
        let mydata = res["data"].data[0];

        setViewData(mydata);
        setLoader(false);
      } else {
        message.error(res["data"].message || "Error");
      }
    });
  };
  return (
    <>
      <CardFixedTop
        title={
          "View " +
          capitalizeFirst(props.match.params.content_type.replace("-", " "))
        }
      >
        <ul className="list-inline mb-0">
          <li className="list-inline-item">
            <Link
              className="btn btn-transparent border-start ms-2"
              to={"/app/cms/contents/" + contentType + "/list"}
            >
              <i className="fa-solid fa-arrow-left fs-5 px-1"></i> Back to{" "}
              {capitalizeFirst(
                props.match.params.content_type.replace("-", " ")
              )}
            </Link>
          </li>
        </ul>
      </CardFixedTop>

      <div className="container mt-3">
        <Card
        /* title={"Add " + capitalizeFirst(props.match.params.content_type.replace("-", " "))} extra={<Button href={"#" + props.match.params.userId + "/admin/contents/" + props.match.params.content_type + "/list"} ><i className="fa-solid fa-list pe-2" ></i>List {capitalizeFirst(props.match.params.content_type.replace("-", " "))}</Button>} */
        >
          <Spin spinning={loader}>
            {viewData && Object.keys(viewData).length > 0 && (
              <>
                <Form
                  name="basic"
                  form={addForm}
                  labelAlign="left"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 20 }}
                  initialValues={{ remember: true }}
                  autoComplete="off"
                >
                  <Row gutter={16}>
                    <Col className="gutter-row" span={12}>
                      {contentType !== contentTypes.ANNOUNCEMENT &&
                        contentType !== contentTypes.SLIDER && (
                          <Form.Item
                            label="category"
                            name="category"
                            rules={[
                              {
                                required: true,
                                message: "Category is required",
                              },
                            ]}
                          >
                            {viewData.category_name}
                          </Form.Item>
                        )}
                      <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true }]}
                      >
                        {viewData.title}
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                      {contentType !== contentTypes.ANNOUNCEMENT && (
                        <Form.Item
                          label="Feature Image"
                          name="feature_image"

                          // rules={[{ required: true, message: 'Feature Image is required' }]}
                        >
                          {viewData.feature_image && (
                            <Image
                              height={100}
                              src={
                                baseUrl +
                                "website-cms/cms-image/" +
                                viewData.feature_image
                              }
                            ></Image>
                          )}
                        </Form.Item>
                      )}
                    </Col>
                  </Row>
                  {(contentType === contentTypes.SLIDER ||
                    contentType === contentTypes.GALLERY) && (
                    <Form.Item
                      wrapperCol={{ offset: 0, span: 24 }}
                      label="Content"
                      name="content"
                      labelCol={{ span: 24, offset: 0 }}
                      style={{ marginTop: "0px" }}
                      rules={[
                        { required: true, message: "Content is required" },
                      ]}
                    >
                      {viewData.content}
                    </Form.Item>
                  )}

                  {(contentType === contentTypes.ANNOUNCEMENT ||
                    contentType === contentTypes.ARTICLE ||
                    contentType === contentTypes.PAGE ||
                    contentType === contentTypes.EVENT) && (
                    <Form.Item
                      wrapperCol={{ offset: 0, span: 24 }}
                      label="Content"
                      name="content_html"
                      labelCol={{ span: 24, offset: 0 }}
                      style={{ marginTop: "0px" }}
                      rules={[
                        {
                          type: "object",
                          required: true,
                          message: "Content is required",
                        },
                      ]}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: viewData.content_html,
                        }}
                      ></div>
                    </Form.Item>
                  )}

                  {(contentType === contentTypes.ARTICLE ||
                    contentType === contentTypes.PAGE ||
                    contentType === contentTypes.EVENT) && (
                    <Collapse accordion ghost>
                      <Panel header="SEO Info" key="1">
                        <Form.Item
                          wrapperCol={{ offset: 0, span: 24 }}
                          label="Slug/Url"
                          name="slug"
                          labelCol={{ span: 4, offset: 0 }}
                          //  style={{ marginTop: '0px' }}

                          //rules={[{ required: true, message: 'Name is required' }]}
                        >
                          {viewData.slug}
                        </Form.Item>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={12}>
                            <Form.Item label="Meta Title" name="meta_title">
                              {viewData.meta_title}
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={12}>
                            <Form.Item
                              label="Meta Description"
                              name="meta_description"
                            >
                              {viewData.meta_description}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={12}>
                            <Form.Item
                              label="Meta Keywords"
                              name="meta_keywords"
                            >
                              {viewData.meta_keywords}
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={12}>
                            <Form.Item label="SEO Tags" name="seo_tags">
                              {viewData.seo_tags}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Panel>
                    </Collapse>
                  )}
                </Form>
              </>
            )}
          </Spin>
        </Card>
      </div>
    </>
  );
};

export default ViewPage;
