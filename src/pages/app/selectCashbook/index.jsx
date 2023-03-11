import React, { useState, useEffect, useContext, useCallback } from "react";

import PsContext from "../../../context";
import SelectCashbookModal from "./selectCashbookModal";

const SelectCashbook = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChangeClick = () => {
    if (context.allowedAccess("allow_to_view_multiple_cashbook", "action_list"))
      setShowModal(true);
  };

  return (
    <>
      {context.cashbook.id && (
        <div className="header_cashbook_name">
          {context.cashbook.cashbook_name}
          {context.allowedAccess(
            "allow_to_view_multiple_cashbook",
            "action_list"
          ) && (
            <span
              className="ps-2 cursor-pointer"
              onClick={(e) => handleChangeClick()}
            >
              <i className="fa-solid fa-angle-down"></i>
            </span>
          )}
        </div>
      )}

      <SelectCashbookModal
        show={showModal}
        onHide={(e) => setShowModal(false)}
        backdrop="static"
      />
    </>
  );
};

export default SelectCashbook;
