import React, { useState, useEffect, useContext, useCallback } from "react";

import PsContext from "../../../context";
import SelectCashbookModal from "./selectCashbookModal";

const CashbookLayout = (props) => {
  const context = useContext(PsContext);

  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (context.allowedAccess("allow_to_view_multiple_cashbook", "action_list"))
      if (!context.cashbook.id) setShowModal(true);
  }, [JSON.stringify(context.cashbook)]);

  return context.cashbook.id ? (
    <div>{props.children}</div>
  ) : (
    <div>
      <SelectCashbookModal
        show={showModal}
        onHide={(e) => setShowModal(false)}
        backdrop="static"
      />
    </div>
  );
};

export default CashbookLayout;
