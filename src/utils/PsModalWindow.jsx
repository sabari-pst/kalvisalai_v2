import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { Modal } from 'react-bootstrap';

const PsModalWindow=(props)=>{

  const {show, onHide, title, size='sm', } = props;

  useEffect(() => {
    const handler = (e) => {
      if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
        e.stopImmediatePropagation();
      }
    };
    document.addEventListener("focusin", handler);
    return () => document.removeEventListener("focusin", handler);
  }, []);

  

  return(
    <React.Fragment>
        <Modal show={show} onHide={onHide} backdrop="static" size={size} > 
            <Modal.Header closeButton>
                {title}
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
        </Modal>
    </React.Fragment>
  );

};

export default PsModalWindow;