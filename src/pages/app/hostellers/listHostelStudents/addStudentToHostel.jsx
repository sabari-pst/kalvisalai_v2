import React, { useState } from "react";
import PsModalWindow from "../../../../utils/PsModalWindow";
import HostelAdmission from "./hostelAdmission";

const AddStudentToHostel = (props) => {
  return (
    <>
      <PsModalWindow {...props}>
        {props.show && <HostelAdmission {...props} />}
      </PsModalWindow>
    </>
  );
};

export default AddStudentToHostel;
