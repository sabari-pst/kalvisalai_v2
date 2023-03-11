import React, { useState, useContext, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import PsContext from "../../../context";
import {
  CardFixedTop,
  formatFileSize,
  getFileLiveUrl,
  removeBothSlash,
  S3_BUCKET_HOME_PATH,
  siteUrl,
  SITE_FILE_DOWNLOAD_DIR,
  upperCase,
} from "../../../utils";
import PsModalWindow from "../../../utils/PsModalWindow";
import { ServiceUrl } from "../../../utils/serviceUrl";
import FileUploadModal from "./fileUploadModal";
import "./index.css";
import {
  getFileBgColor,
  getFileTypeImage,
  getFolderName,
  isImage,
} from "./functions";
import { Dropdown, Menu, Spin, Image } from "antd";
import { toast } from "react-hot-toast";
import CreateFolderModal from "./createFolderModal";
import ModuleAccess from "../../../context/moduleAccess";

const FileManager = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [startPath, setStartPath] = useState("");
  const [fileList, setFileList] = useState([]);
  const [fileView, setFileView] = useState([]);

  const [selectedItem, setSelectedItem] = useState("");
  const [selectedPrefix, setSelectedPrefix] = useState("");

  const [multiSelectedItems, setMultiSelectedItems] = useState([]);

  const multipleSelect = props.onSuccess;

  useEffect(() => {
    listFiles();
  }, []);

  useEffect(() => {
    if (selectedPrefix.length > 0) listFiles();
  }, [selectedPrefix]);

  const listFiles = () => {
    setLoader(true);
    const form = new FormData();
    if (selectedPrefix) form.append("parent", selectedPrefix);

    axios
      .post(ServiceUrl.WEBSITE_CMS.FILES_LIST_DIRECTORY, form)
      .then((res) => {
        let d = res["data"].data;
        let contents = d.Contents || [];
        let commonPrefixes = d.CommonPrefixes || [];
        let dl = [...contents, ...commonPrefixes];

        setFileList(dl);
        setFileView(dl);
        setStartPath(d.Prefix);
        setSelectedPrefix("");
        setSelectedItem("");
        setLoader(false);
      });
  };

  const handleDoubleClick = (item) => {
    setSelectedPrefix(item.Prefix);
  };

  const getPreviousPaths = (items, index) => {
    let p = "";
    items.map((item, i) => {
      if (i <= index) p += item + "/";
    });

    return S3_BUCKET_HOME_PATH + p;
  };

  const FilePathBreadCrump = (path) => {
    if (!path || path.length < 1) return "";
    path = path.replace(S3_BUCKET_HOME_PATH, "");
    let paths = removeBothSlash(path).split("/");
    let rv = [];
    paths.map((item, i) => {
      rv.push(
        <li
          className="breadcrumb-item"
          onClick={(e) =>
            i != paths.length - 1 &&
            setSelectedPrefix(getPreviousPaths(paths, i))
          }
        >
          {i != paths.length - 1 ? (
            <a className="border-bottom">{item}</a>
          ) : (
            <span>{item}</span>
          )}
        </li>
      );
    });
    return <ol className="breadcrumb hb-breadcrumb">{rv}</ol>;
  };

  const handleDeleteFile = (path) => {
    if (!window.confirm("Do you want to delete?")) return;
    setLoader(true);
    const form = new FormData();
    form.append("KeyName", selectedItem);
    axios.post(ServiceUrl.WEBSITE_CMS.REMOVE_FILE, form).then((res) => {
      if (res["data"].status == "1") {
        toast.success(res["data"].message || "Success");
        setSelectedPrefix(path);
      } else {
        toast.error(res["data"].message || "Error");
      }
      setLoader(false);
    });
  };

  const menuItems = [
    {
      label: "1st menu item",
      key: "1",
    },
    {
      label: "2nd menu item",
      key: "2",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];

  const contextDropDown = (item) => {
    return (
      <>
        {item.Key && (
          <Dropdown
            overlay={
              <Menu theme="light" style={{ minWidth: "150px" }}>
                <Menu.Item onClick={(e) => fileOpenClick(item)}>
                  <i className="fa-regular fa-eye me-2"></i>Open
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={(e) => copyLinkClick(item)}>
                  <i className="fa-solid fa-link me-2"></i>Copy Link
                </Menu.Item>

                <Menu.Item onClick={(e) => fileOpenClick(item, "download")}>
                  <i className="fa-regular fa-circle-down me-2"></i>Download
                </Menu.Item>
                <Menu.Divider />

                {context.allowedAccess("cms_file_manager", "action_delete") && (
                  <>
                    <Menu.Item onClick={(e) => handleDeleteFile(item.Key)}>
                      <i className="fa-regular fa-trash-can me-2"></i>
                      Delete
                    </Menu.Item>
                    <Menu.Divider />
                  </>
                )}

                <Menu.Item>
                  <i className="fa-solid fa-arrow-up-right-from-square me-2"></i>
                  Details
                </Menu.Item>
              </Menu>
            }
            trigger={[!multipleSelect && "contextMenu"]}
          >
            <div>
              {isImage(item) ? (
                <>
                  <span className="fm_img_size_top">
                    {formatFileSize(item.Size)}
                  </span>
                  <Image
                    preview={false}
                    src={getFileLiveUrl(item)}
                    style={{ height: "80px", width: "100%" }}
                    placeholder={
                      <Image src={getFileLiveUrl(item)} preview={false} />
                    }
                  />
                </>
              ) : (
                <div
                  style={{
                    backgroundImage: `url(${getFileTypeImage(
                      item.Prefix || item.Key
                    )})`,
                    height: "80px",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "auto 100%",
                    backgroundPosition: "center",
                  }}
                ></div>
              )}
            </div>
          </Dropdown>
        )}
        {item.Prefix && (
          <div
            style={{
              backgroundImage: `url(${getFileTypeImage(
                item.Prefix || item.Key
              )})`,
              height: "80px",
              backgroundRepeat: "no-repeat",
              backgroundSize: "auto 100%",
              backgroundPosition: "center",
            }}
          ></div>
        )}
      </>
    );
  };

  const fileOpenClick = (item, type = "open") => {
    let url = siteUrl + SITE_FILE_DOWNLOAD_DIR + item.Key;
    var a = document.createElement("a");
    a.href = url;
    if (type == "open") a.target = "_blank";
    if (type == "download") a.download = getFolderName(item.Key);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyLinkClick = (item) => {
    let url = siteUrl + SITE_FILE_DOWNLOAD_DIR + item.Key;
    navigator.clipboard.writeText(url);
    toast.success("Link Copied");
  };

  const handleFileSearch = (e) => {
    let d = fileList;
    let x = d.filter(
      (item) =>
        upperCase(item.Prefix || item.Key).indexOf(upperCase(e.target.value)) >
        -1
    );

    setFileView(x);
  };

  const handleFileClick = (item) => {
    if (multipleSelect) {
      if (item.Prefix) return;
      //setMultiSelectedItems
      let v = item.Prefix || item.Key;
      let s = [...multiSelectedItems];
      let index = s.findIndex((obj) => obj == v);
      if (index > -1) s = s.filter((obj) => obj != v);
      else s.push(v);
      setMultiSelectedItems(s);
    } else {
      setSelectedItem(item.Prefix || item.Key);
    }
  };

  const checkItemSelected = (item) => {
    let v = item.Prefix || item.Key;
    if (multipleSelect) {
      let s = [...multiSelectedItems];
      let index = s.findIndex((obj) => obj == v);
      return index > -1 ? true : false;
      setMultiSelectedItems(s);
    } else {
      return selectedItem == v;
    }
  };

  const onSelectedFileBtnClick = () => {
    if (props.onSuccess) props.onSuccess(multiSelectedItems);
  };

  return (
    <>
      {/*<div>
        <CardFixedTop title="File Manager">
          <ul className="list-inline mb-0">
            <li className="list-inline-item">
              <Button
                variant="white"
                className="border-start ms-2"
                onClick={(e) => setShowUpload(true)}
              >
                <i className="fa-solid fa-arrow-up-from-bracket fs-5 px-1"></i>{" "}
                Upload
              </Button>
            </li>
          </ul>
        </CardFixedTop>
  </div>*/}

      <div className="container  bg-light px-0 py-2">
        <Card>
          <Card.Header>
            <Button
              type="button"
              variant="transparent"
              size="sm"
              onClick={(e) => {
                setSelectedPrefix("");
                listFiles();
              }}
            >
              <i className="fa-solid fa-home"></i>
            </Button>
            {FilePathBreadCrump(startPath)}
            <div className="float-end">
              {multipleSelect && multiSelectedItems.length > 0 && (
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">
                    <Button
                      variant="white"
                      className="border-start border-end mx-2"
                      size="sm"
                      onClick={(e) => onSelectedFileBtnClick()}
                    >
                      <i className="fa-solid fa-check fs-6 px-1"></i> Use
                      Selected Files
                    </Button>
                  </li>
                </ul>
              )}
              {!props.onSuccess && (
                <ul className="list-inline mb-0">
                  <ModuleAccess
                    module="cms_file_manager"
                    action="action_delete"
                  >
                    {selectedItem && (
                      <li className="list-inline-item">
                        <Button
                          variant="white"
                          className="border-start border-end mx-2"
                          size="sm"
                          onClick={(e) => handleDeleteFile(startPath)}
                        >
                          <i className="fa-regular fa-trash-can fs-6 px-1"></i>
                        </Button>
                      </li>
                    )}
                  </ModuleAccess>
                  <li className="list-inline-item">
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Search files"
                      onChange={(e) => handleFileSearch(e)}
                    />
                  </li>
                  <ModuleAccess
                    module="cms_file_manager"
                    action="action_create"
                  >
                    <li className="list-inline-item">
                      <Button
                        variant="white"
                        className="border-start ms-2"
                        size="sm"
                        onClick={(e) => setShowAddFolder(true)}
                      >
                        <i className="fa-solid fa-plus fs-6 px-1"></i> New
                        Folder
                      </Button>
                    </li>
                  </ModuleAccess>
                  <ModuleAccess
                    module="cms_file_manager"
                    action="action_create"
                  >
                    <li className="list-inline-item">
                      <Button
                        variant="white"
                        className="border-start ms-2"
                        size="sm"
                        onClick={(e) => setShowUpload(true)}
                      >
                        <i className="fa-solid fa-arrow-up-from-bracket fs-6 px-1"></i>{" "}
                        Upload
                      </Button>
                    </li>
                  </ModuleAccess>
                </ul>
              )}
            </div>
          </Card.Header>
          <Card.Body
            style={{ height: "calc(100vh - 115px)", overflowY: "scroll" }}
            className="bg-silver-100"
          >
            <Spin spinning={loader}>
              <Row>
                {fileView.map((item, i) => {
                  return (
                    <Col md={2} className="mb-2">
                      <Card
                        className={
                          checkItemSelected(item) ? "hb-file-selected" : ""
                        }
                      >
                        <Card.Body
                          className="text-center px-2 py-2"
                          style={{
                            backgroundColor: getFileBgColor(
                              item.Prefix || item.Key
                            ),
                            cursor: "pointer",
                          }}
                          onClick={(e) => handleFileClick(item)}
                          onDoubleClick={(e) =>
                            item.Prefix && handleDoubleClick(item)
                          }
                        >
                          {/*<img
                          src={getFileTypeImage(item.Prefix || item.Key)}
                          style={{ maxWidth: "100%" }}
                      />*/}
                          {contextDropDown(item)}
                        </Card.Body>
                        <Card.Footer
                          className="text-start "
                          style={{ fontSize: "11px" }}
                        >
                          <div className="hide-text-overflow">
                            {getFolderName(item.Prefix || item.Key)}
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Spin>
          </Card.Body>
        </Card>
      </div>

      <PsModalWindow
        show={showUpload}
        title="File Upload"
        onHide={(e) => setShowUpload(false)}
        size="md"
      >
        <FileUploadModal
          uploadPath={startPath}
          onSuccess={(pre) => {
            setShowUpload(false);
            setSelectedPrefix(pre);
          }}
        />
      </PsModalWindow>

      <PsModalWindow
        show={showAddFolder}
        title="Create Folder"
        onHide={(e) => setShowAddFolder(false)}
        size="sm"
      >
        <CreateFolderModal
          uploadPath={startPath}
          onSuccess={(pre) => {
            setShowAddFolder(false);
            setSelectedPrefix(pre);
          }}
        />
      </PsModalWindow>
    </>
  );
};

export default FileManager;
