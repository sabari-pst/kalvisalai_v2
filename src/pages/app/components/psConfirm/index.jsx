import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";


const createPromise = () => {
    let resolver;
    return [ new Promise(( resolve, reject ) => {

        resolver = resolve
    }), resolver]
}

const PsConfirm=(props) => {

    const [ open, setOpen ] = useState(false);
    const [ resolver, setResolver ] = useState({ resolver: null })
    const [ label, setLabel ] = useState('')
    const [yesText, setYesText] = useState('Ok');
    const [noText, setNoText] = useState('Cancel');
    
    const getConfirmation = async (text, yes_text=false, no_text=false) => {
          setLabel(text);
            if(yes_text) setYesText(yes_text);
            if(no_text) setNoText(no_text);
          setOpen(true);
          const [ promise, resolve ] = await createPromise()
          setResolver({ resolve })
          return promise;
    }
  
    const onClick = async(status) => {
          setOpen(false);
          resolver.resolve(status)
    }
  
    const Confirmation = () => (
        <Modal show={open} centered={true} >
            <Modal.Body>
                {label}
            <hr />
                <center>
                    <Button className="me-2" variant="outline-dark" size="sm" onClick={ () => onClick(false)}> {noText} </Button>
                    <Button size="sm" variant="outline-dark" onClick={ () => onClick(true)}> {yesText} </Button>
                </center>
            </Modal.Body>
        </Modal>
    )
  
    return [ getConfirmation, Confirmation ]

};

export default PsConfirm;