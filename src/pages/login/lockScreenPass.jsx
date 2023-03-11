import React from "react";
import { Modal } from "react-bootstrap";

const LockScreenPass = (props) => {
  return (
    <div>
      <Modal show={true} centered>
        <Modal.Body>
          <div className="text-center">
            <b>Enter Your Password</b>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default LockScreenPass;
