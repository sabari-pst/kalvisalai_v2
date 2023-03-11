import React, { useState, useContext, useEffect } from "react";
import FileManager from ".";
import PsModalWindow from "../../../utils/PsModalWindow";

const FileBrowserModal = (props) => {
  return (
    <PsModalWindow {...props}>
      <FileManager
        multipleSelect={props.multipleSelect}
        onSuccess={props.onSuccess}
      />
    </PsModalWindow>
  );
};

export default FileBrowserModal;
