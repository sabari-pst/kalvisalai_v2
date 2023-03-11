import React, { useState } from 'react';
import { Offcanvas  } from 'react-bootstrap';

const PsOffCanvasWindow=(props)=>{

  const {show, onHide, title, size='sm', placement='end'} = props;

  return(
    <React.Fragment>
        <Offcanvas show={show} onHide={onHide}  backdrop="static" className={`offcanvas-${size}-${placement}`} placement={placement} > 
            <Offcanvas.Header closeButton>
                {title}
            </Offcanvas.Header>
            <Offcanvas.Body>
                {props.children}
            </Offcanvas.Body>
        </Offcanvas>
    </React.Fragment>
  );

};

export default PsOffCanvasWindow;