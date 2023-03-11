import React, { useState, useContext, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import PsContext from "../../../context";
import { formatFileSize } from "../../../utils";
import { ServiceUrl } from "../../../utils/serviceUrl";
import axios from "axios";
import { toast } from "react-hot-toast";
import LoaderSubmitButton from "../../../utils/LoaderSubmitButton";

const CreateFolderModal = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [uploadBtnText, setUploadBtnText] = useState("");

  const uploadFilesToServer = (e) => {
    e.preventDefault();
    setLoader(true);

    var $this = this;
    const config = {
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        //$this.setState({ uploadPercentage: percentCompleted });
      },
    };

    const data = new FormData();

    data.append("path", props.uploadPath);
    data.append("FolderName", folderName);

    axios
      .post(ServiceUrl.WEBSITE_CMS.CREATE_FOLDER, data, config)
      .then((res) => {
        if (res["data"].status == "1") {
          toast.success(res["data"].message || "Success");

          if (props.onSuccess)
            props.onSuccess(props.uploadPath + folderName + "/");
        } else {
          toast.error(res["data"].message || "Error");
        }
        setLoader(false);
      });
  };

  return (
    <div>
      <div className="text-center mt-3">
        <form
          action=""
          method="post"
          encType="multipart/form-data"
          id="frmhb_UploadFiles"
          onSubmit={uploadFilesToServer}
        >
          <Form.Control
            type="text"
            name="FolderName"
            required
            placeholder="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <div className="mt-3">
            <LoaderSubmitButton
              text="Create Folder"
              type="submit"
              loading={loader}
              className="btn-block"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
