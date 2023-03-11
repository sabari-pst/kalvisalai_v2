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

const EditPage = (props) => {
  const history = useHistory();
  const [addForm] = Form.useForm();
  const { Option } = Select;
  const { Panel } = Collapse;
  const context = useContext(PsContext);
  const { TextArea } = Input;
  const [contentType] = useState(props.match.params.content_type);
  const [contentId] = useState(props.match.params.id);
  const [categoryData, setCategoryData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [imageRatio, setImageRatio] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const [viewData, setViewData] = useState([]);
  useEffect(() => {
    loadCategories();
    loadData(contentId);
  }, [contentType]);
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const loadData = (id) => {
    setLoader(true);
    var form = new FormData();
    form.append("id", contentId);
    form.append("type", contentType);
    axios.post("v1/admin/website-cms/list", form).then((res) => {
      if (res["data"].status === "1") {
        let mydata = res["data"].data[0];

        setViewData(mydata);
        if (mydata.image_ratio === "any") setImageRatio("any");
        else {
          let splitRatio = mydata.image_ratio.split(":");
          setImageRatio(splitRatio[0] + "/" + splitRatio[1]);
        }
        // setSelDate(mydata.dob)
        // if(mydata.feature_image) setImageUrl(baseUrl+mydata.feature_image);
        //message.success(mydata.category);
        if (mydata.seo_meta_keywords)
          mydata.seo_meta_keywords = mydata.seo_meta_keywords.split(",");
        if (mydata.seo_tags) mydata.seo_tags = mydata.seo_tags.split(",");
        addForm.setFieldsValue(mydata);

        addForm.setFieldsValue({
          content_html: { html: mydata.content_html },
        });
        setEditorValue(mydata.content_html);
        setLoader(false);
      } else {
        message.error(res["data"].message || "Error");
      }
    });
  };
  const loadCategories = () => {
    var form = new FormData();
    form.append("content_type", contentType);
    axios.post("v1/admin/website-cms/categories-list", form).then((res) => {
      if (res["data"].status === "1") {
        setLoader(false);
        setCategoryData(res["data"].data);
      } else {
        message.error(res["data"].message || "Error");
        setLoader(false);
      }
    });
  };
  const handleEditorChange = (content) => {
    setEditorValue(content);
    addForm.setFieldsValue({
      content_html: { html: content },
    });
    setEditorValue(content);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    UploadFile(file);
    return isJpgOrPng && isLt2M;
  };
  const handleFileChange = (info) => {
    if (info.file.status === "uploading") {
      setImgLoading(true);
      return;
    }
    /* if (info.file.status === 'done') {
			// Get this url from response in real world.
			message.success('done')
			getBase64(info.file.originFileObj, (url) => {
				setImgLoading(false);
				setImageUrl(url);
			});
		} */
  };
  const UploadFile = (file) => {
    console.log(file);
    getBase64(file, (data64) => {
      var form = new FormData();
      form.append("file_data", data64);
      form.append("file_name", file.name);
      var fileName = "public/cms_tmp/" + new Date().valueOf() + ".jpg";
      form.append("store_file_name", fileName);
      setUploadedFileName(fileName);

      axios.post("v1/admin/website-cms/upload-image", form).then((res) => {
        if (res["data"].status === "1") {
          setImgLoading(false);
          setImageUrl(baseUrl + fileName);
        } else {
          message.error(res["data"].message || "Error");
        }
      });
    });
  };
  const onFinish = (values) => {
    setLoader(true);
    var processedValues = {};
    Object.entries(values).forEach(([key, value], index) => {
      if (value) {
        if (key === "content_html") processedValues[key] = value.html;
        else processedValues[key] = value;
      }
    });
    //add photo if
    processedValues["id"] = contentId;
    if (uploadedFileName !== "")
      processedValues["feature_image"] = uploadedFileName;
    else delete processedValues["feature_image"];

    processedValues["type"] = contentType;
    //processedValues['content_status'] = 'draft';
    //processedValues['add_by'] = context.adminUser.username;

    if (processedValues["seo_meta_keywords"])
      processedValues["seo_meta_keywords"] =
        values["seo_meta_keywords"].join(",");

    if (processedValues["seo_tags"])
      processedValues["seo_tags"] = values["seo_tags"].join(",");

    var form = new FormData();
    Object.entries(processedValues).forEach(([key, value], index) => {
      form.append(key, value);
    });

    axios.post("v1/admin/website-cms/update", form).then((res) => {
      if (res["data"].status === "1") {
        message.success(res["data"].message || "Success");
        //console.log(res['data'].data);
        setLoader(false);
        history.push("/app/cms/contents/" + contentType + "/list");
      } else {
        message.error(res["data"].message || "Error");
        setLoader(false);
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const uploadButton = (
    <div>
      {/*   {imgLoading ? <LoadingOutlined /> : <PlusOutlined />} */}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const activeFrom_dateOnChange = (date) => {
    addForm.setFieldsValue({
      active_from_date: moment(date).format("YYYY-MM-DD"),
    });
  };
  const activeTo_dateOnChange = (date) => {
    addForm.setFieldsValue({
      active_to_date: moment(date).format("YYYY-MM-DD"),
    });
  };
  const onCategoryChange = (value) => {
    let selCategory = categoryData.find(
      (item) => parseInt(item.id) === parseInt(value)
    );
    //console.log(categoryData,value);
    if (selCategory) {
      if (selCategory.image_ratio === "any") setImageRatio("any");
      else {
        let splitRatio = selCategory.image_ratio.split(":");
        setImageRatio(splitRatio[0] + "/" + splitRatio[1]);
      }
    }
  };
  return (
    <>
      <CardFixedTop
        title={
          "Edit " +
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
              <Form
                name="basic"
                form={addForm}
                labelAlign="left"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 20 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Row gutter={16}>
                  <Col className="gutter-row" span={12}>
                    {contentType !== contentTypes.ANNOUNCEMENT && (
                      <Form.Item
                        label="category"
                        name="category"
                        rules={[
                          { required: true, message: "Category is required" },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Category"
                          optionFilterProp="children"
                          //onChange={courseStatusOnChange}
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onChange={onCategoryChange}
                        >
                          {categoryData.map((d) => (
                            <Option key={d.id}>{d.category_name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                    <Form.Item
                      label="Title"
                      name="title"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Active Date"
                      // name="membership_plan"
                      // rules={[{ required: true, message: 'Enter Amount' }]}
                    >
                      <Input.Group compact>
                        <Form.Item
                          // label="Active From_date"
                          name="active_from_date"
                          rules={[{ required: true, message: "From Date" }]}
                        >
                          <Space direction="vertical">
                            From{" "}
                            <DatePicker
                              onChange={activeFrom_dateOnChange}
                              format="DD/MM/YYYY"
                              //disabledDate={activeFrom_dateDisabled}
                              allowClear={false}
                              defaultValue={
                                viewData &&
                                moment(viewData.active_from_date, "YYYY-MM-DD")
                              }
                            />
                          </Space>
                        </Form.Item>
                        <Form.Item
                          // label="Active To_date"
                          name="active_to_date"
                          rules={[{ required: true, message: "To Date" }]}
                        >
                          <Space direction="vertical">
                            To{" "}
                            <DatePicker
                              onChange={activeTo_dateOnChange}
                              format="DD/MM/YYYY"
                              //disabledDate={activeTo_dateDisabled}
                              allowClear={false}
                              defaultValue={
                                viewData &&
                                moment(viewData.active_to_date, "YYYY-MM-DD")
                              }
                            />
                          </Space>
                        </Form.Item>
                      </Input.Group>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    {contentType !== contentTypes.ANNOUNCEMENT && (
                      <Form.Item
                        label="Feature Image"
                        name="feature_image"

                        // rules={[{ required: true, message: 'Feature Image is required' }]}
                      >
                        <Space>
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
                          {imageRatio && imageRatio !== "any" && (
                            <ImgCrop
                              grid
                              rotate
                              aspect={
                                parseInt(imageRatio.split("/")[0]) /
                                parseInt(imageRatio.split("/")[1])
                              }
                            >
                              <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                // action="http://localhost/24mtc/api//v1/admin/upload-image"
                                action={(file) => {
                                  //  UploadFile(file)
                                }}
                                beforeUpload={beforeUpload}
                                onChange={handleFileChange}
                              >
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt="avatar"
                                    style={{
                                      width: "100%",
                                    }}
                                  />
                                ) : (
                                  uploadButton
                                )}
                              </Upload>
                            </ImgCrop>
                          )}
                          {imageRatio && imageRatio === "any" && (
                            <Upload
                              name="avatar"
                              listType="picture-card"
                              className="avatar-uploader"
                              showUploadList={false}
                              // action="http://localhost/24mtc/api//v1/admin/upload-image"
                              action={(file) => {
                                //  UploadFile(file)
                              }}
                              beforeUpload={beforeUpload}
                              onChange={handleFileChange}
                            >
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt="avatar"
                                  style={{
                                    width: "100%",
                                  }}
                                />
                              ) : (
                                uploadButton
                              )}
                            </Upload>
                          )}
                        </Space>
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
                    rules={[{ required: true, message: "Content is required" }]}
                  >
                    <TextArea rows={5} maxLength={24} />
                  </Form.Item>
                )}

                {contentType !== contentTypes.SLIDER &&
                  contentType !== contentTypes.GALLERY && (
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
                      <div></div>{" "}
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
                        name="seo_slug"
                        labelCol={{ span: 4, offset: 0 }}
                        //  style={{ marginTop: '0px' }}

                        //rules={[{ required: true, message: 'Name is required' }]}
                      >
                        <Input />
                      </Form.Item>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={12}>
                          <Form.Item label="Meta Title" name="seo_meta_title">
                            <TextArea />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={12}>
                          <Form.Item
                            label="Meta Description"
                            name="seo_meta_description"
                          >
                            <TextArea />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={12}>
                          <Form.Item
                            label="Meta Keywords"
                            name="seo_meta_keywords"
                          >
                            <Select
                              mode="tags"
                              style={{
                                width: "100%",
                              }}
                              //onChange={handleChange}
                              tokenSeparators={[","]}
                            ></Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={12}>
                          <Form.Item label="SEO Tags" name="seo_tags">
                            <Select
                              mode="tags"
                              style={{
                                width: "100%",
                              }}
                              //onChange={handleChange}
                              tokenSeparators={[","]}
                            ></Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>
                )}

                <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Spin>
        </Card>
      </div>
    </>
  );
};

export default EditPage;
