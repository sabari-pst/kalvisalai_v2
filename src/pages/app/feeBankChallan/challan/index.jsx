import React from "react";
import ChallanLayout from "./challanLayout";

const Challan = (props) => {
  return (
    <>
      <table width="100%">
        <tr>
          <td width="33%" align="center">
            <ChallanLayout title="COLLEGE COPY" {...props} />
          </td>
          <td width="33%" align="center">
            <ChallanLayout title="STUDENT COPY" {...props} />
          </td>
          <td width="33%" align="center">
            <ChallanLayout title="BANK COPY" {...props} />
          </td>
        </tr>
      </table>
      <div style={{ pageBreakAfter: "always" }}></div>
    </>
  );
};

export default Challan;
