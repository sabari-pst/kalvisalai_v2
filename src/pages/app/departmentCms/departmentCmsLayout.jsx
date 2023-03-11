import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button } from "react-bootstrap";

import { withRouter } from "react-router-dom";

import PsContext from "../../../context";
import DpartmentSelectPopup from "./dpartmentSelectPopup";

const DepartmentCmsLayout = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [academicDepartment, setAcademicDepartment] = useState(
    context.user?.academic_department
  );

  useEffect(() => {
    if (
      context.allowedAccess("allow_to_view_multiple_dept_cms", "action_list")
    ) {
      if (!context.user.academic_department) setShowModal(true);
      setAcademicDepartment(context.user.academic_department);
    }
  }, [context.user.academic_department]);

  return (
    <>
      {academicDepartment ? <div>{props.children}</div> : <div></div>}
      {showModal && (
        <DpartmentSelectPopup
          show={showModal}
          onHide={(e) => setShowModal(false)}
        />
      )}
    </>
  );
};

export default withRouter(DepartmentCmsLayout);
