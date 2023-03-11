import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { listCashbooks } from "../../../../models/settings";

const SelectCashBookDropDown = (props) => {
  const [loader, setLoader] = useState(false);
  const [cashbooks, setCashbooks] = useState([]);

  useEffect(() => {
    setLoader(true);
    listCashbooks("1").then((res) => {
      if (res) setCashbooks(res);
      setLoader(false);
    });
  }, []);

  return (
    <div>
      <Form.Control
        as="select"
        name={props.name || "cashbook_id"}
        className="fw-bold form-select form-select-sm"
        disabled={loader}
        size={props.size || "sm"}
        required
      >
        <option value="">-Select Cashbook-</option>
        {cashbooks.map((item) => (
          <option
            value={item.id}
            selected={
              props.defaultValue && props.defaultValue == item.id
                ? "selected"
                : ""
            }
          >
            {item.cashbook_name}
          </option>
        ))}
      </Form.Control>
      {loader && (
        <div style={{ float: "right", marginTop: "-30px" }}>
          <Spinner animation="border" role="status" variant="primary" />
        </div>
      )}
    </div>
  );
};

export default SelectCashBookDropDown;
