import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';

const PsCollapse=(props)=>{

    const history = useHistory();

    const [show, setShow] = useState(false);
   
    return(
        <>
          <Card>
            <Card.Header className="fw-bold cursor-pointer" onClick={e => setShow(!show)} >{props.title}
                <span className="float-end"><i className={show ? "fa-solid fa-caret-up" : "fa-solid fa-caret-down"}></i></span>
            </Card.Header>
            {show && (<Card.Body>
                {props.children}
            </Card.Body>)}
        </Card>
        </>
    );
};
export default PsCollapse;