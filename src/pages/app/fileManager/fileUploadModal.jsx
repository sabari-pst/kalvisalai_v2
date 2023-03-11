import React, { useState, useContext, useEffect } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import PsContext from "../../../context";
import { formatFileSize } from "../../../utils";
import { ServiceUrl } from "../../../utils/serviceUrl";
import axios from "axios";
import { toast } from "react-hot-toast";
import LoaderSubmitButton from "../../../utils/LoaderSubmitButton";

const FileUploadModal = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploadBtnText, setUploadBtnText] = useState("");

  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleSelectFiles = (e) => {
    try {
      let files = e.target.files;
      setFilesToUpload(files);
      setUploadBtnText("Upload to server");
    } catch (er) {}
  };

  const getSelectedFiles = () => {
    try {
      var rv = [];
      //var d = this.state.filesToUpload.fileList;
      var d = filesToUpload;
      for (var i = 0; i < Object.keys(d).length; i++) {
        rv.push(
          <div className="hb-filemanager-selected-files">
            <div className="hb-filemanager-selected-files-name">
              {d[i].name}
            </div>
            <span style={{ color: "darkgrey", fontSize: "11px" }}>
              {formatFileSize(d[i].size)}
            </span>{" "}
            &emsp;
            <span style={{ color: "darkgrey", fontSize: "11px" }}>
              {d[i].type}
            </span>
            {/*<div className="hb-filemanage-selected-files-remove" >
						<span className="ion-ios7-close-empty"></span>
						</div>*/}
          </div>
        );
      }
      return rv;
    } catch (er) {}
  };

  const uploadFilesToServer = (e) => {
    e.preventDefault();
    setLoader(true);

    var $this = this;
    const config = {
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadPercentage(percentCompleted);
        //$this.setState({ uploadPercentage: percentCompleted });
      },
    };

    const data = new FormData();
    for (var x = 0; x < filesToUpload.length; x++) {
      data.append("files[]", filesToUpload[x]);
    }
    data.append("path", props.uploadPath);
    //data.append("item", this.state.currentSelectedItem);

    axios
      .post(ServiceUrl.WEBSITE_CMS.FILES_UPLOAD, data, config)
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");

          if (props.onSuccess) props.onSuccess(props.uploadPath);
        } else {
          //message.error(res["data"].message);
          //this.setState({ uploadFilesText: "Upload to server" });
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <div>
      {filesToUpload && filesToUpload.length < 1 && (
        <div>
          <label for="hb_file-upload" className="hb-custom-file-upload">
            <div className="text-center hb-filemanager-upload-container">
              <div style={{ fontSize: "50px" }}>
                <span className="fa-solid fa-arrow-up-from-bracket"></span>
              </div>
              <div>Select files to upload</div>
            </div>
          </label>
          <input
            type="file"
            id="hb_file-upload"
            multiple={true}
            onChange={handleSelectFiles}
          />
        </div>
      )}

      {filesToUpload && filesToUpload.length > 0 && (
        <div>
          {uploadPercentage != 0 && (
            <ProgressBar animated color="info" now={uploadPercentage} />
          )}

          <div className="hb-filemanage-upload-filelist mt-2">
            {getSelectedFiles()}
          </div>
          <div className="text-center mt-3">
            <form
              action=""
              method="post"
              encType="multipart/form-data"
              id="frmhb_UploadFiles"
              onSubmit={uploadFilesToServer}
            >
              <LoaderSubmitButton text="Upload To Server" loading={loader} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadModal;
