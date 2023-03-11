import React from "react";
import PsOffCanvasWindow from "../../../../utils/PsOffCanvasWindow";
import MarkLongAbsent from "./markLongAbsent";

const MarkLongAbsentWindow = (props) => {
  return (
    <div>
      <PsOffCanvasWindow
        title="Mark Student Long Absent"
        onHide={props.onHide}
        {...props}
      >
        <MarkLongAbsent {...props} />
      </PsOffCanvasWindow>
    </div>
  );
};
export default MarkLongAbsentWindow;
