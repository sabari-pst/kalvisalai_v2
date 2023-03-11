import React, { useState, useContext } from "react";
import PsContext from "../../../../context";
import { upperCase } from "../../../../utils";
import SelectCashbook from "../../selectCashbook";

const CompanyTitle = (props) => {
  const context = useContext(PsContext);

  return (
    <>
      <div className="header_company_title">
        {upperCase(context.settingValue("print_header_name"))}
        <br />
      </div>
      <SelectCashbook />
    </>
  );
};

export default CompanyTitle;
