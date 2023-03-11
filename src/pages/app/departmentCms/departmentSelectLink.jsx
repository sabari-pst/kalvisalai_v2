import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button } from "react-bootstrap";

import { withRouter } from "react-router-dom";

import PsContext from "../../../context";
import DpartmentSelectPopup from "./dpartmentSelectPopup";

const DepartmentSelectLink = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [academicDepartment, setAcademicDepartment] = useState(
    context.user?.academic_department
  );

  const handleChangeClick = () => {
    if (context.allowedAccess("allow_to_view_multiple_dept_cms", "action_list"))
      setShowModal(true);
  };

  return (
    <>
      {context.user.academic_department && (
        <li
          className="border-start fw-bold px-2 cursor-pointer "
          onClick={(e) => handleChangeClick()}
        >
          <div style={{ fontSize: "11px" }}>
            {context.user?.academic_department_name}- (
            {context.user?.academic_department_type == "aided" ? "R" : "SF"})
            <i
              className="ms-1 fa-solid fa-chevron-down"
              style={{ fontSize: "9px" }}
            ></i>
          </div>
        </li>
      )}

      {showModal && (
        <DpartmentSelectPopup
          show={showModal}
          onHide={(e) => setShowModal(false)}
        />
      )}
    </>
  );
};

export default withRouter(DepartmentSelectLink);
