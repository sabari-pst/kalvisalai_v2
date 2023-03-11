import React, { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bootstrap";

import ReactFileReader from "react-file-reader";
import { toast } from "react-hot-toast";
import { getFileLiveUrl } from "../../../../utils";
import { SELECT_USER_PHOTO } from "../../../../utils/data";

const StudentPhoto = (props) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [oldFile, setOldFile] = useState("");

  const getImage = () => {
    if (selectedFile && selectedFile.length > 0) return selectedFile;
    else if (oldFile && oldFile.length > 0) return getFileLiveUrl(oldFile);
    return SELECT_USER_PHOTO;
  };

  useEffect(() => {
    if (props.profilePhoto) setOldFile(props.profilePhoto);
  }, [props.profilePhoto]);

  const fileReaderChange = (file) => {
    var types = [
      "image/png",
      "image/jpeg",
      "image/JPEG",
      "image/jpg",
      "image/PNG",
      "image/JPG",
    ];
    if (!types.includes(file.fileList[0].type)) {
      toast.error(
        "Please select an Image with file extension .jpg or .png",
        "error"
      );
      return;
    }

    if (file.fileList[0].size < 80000) {
      toast.error("File size must greater than 80 kb", "error");
      return;
    }

    if (file.fileList[0].size > 300000) {
      toast.error("File size must less than 300 kb", "error");
      return;
    }

    setSelectedFile(file.base64);
  };

  const clearFile = () => {
    if (!window.confirm("Do you want to remove ?")) return;
    setSelectedFile("");
  };

  return (
    <div style={{ width: "180px", marginLeft: "atuo", marginRight: "auto" }}>
      <input type="hidden" name="student_photo" value={selectedFile} />
      {selectedFile && selectedFile.length > 0 && (
        <a className="img-close-btn" onClick={(e) => clearFile()}>
          x
        </a>
      )}
      <img
        src={getImage()}
        style={{ width: "180px", cursor: "pointer", height: "190px" }}
      />
      <ReactFileReader
        base64={true}
        handleFiles={fileReaderChange}
        fileTypes={[".jpg", ".png", ".JPG", ".PNG"]}
      >
        <Button size="sm" type="button" className="btn-block">
          <i className="fa-solid fa-file-image me-2"></i>
          {selectedFile && selectedFile.length > 0
            ? "Change Image"
            : "Select Image"}
        </Button>
      </ReactFileReader>
    </div>
  );
};

export default StudentPhoto;
