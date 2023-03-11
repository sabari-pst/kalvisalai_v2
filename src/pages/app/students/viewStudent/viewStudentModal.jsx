import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';


import PsOffCanvasWindow from '../../../../utils/PsOffCanvasWindow';
import ViewStudent from '.';

const ViewStudentModal = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    

   return (
        <>
            <PsOffCanvasWindow {...props} >
                    <ViewStudent uuid={props.dataSource.uuid} />
            </PsOffCanvasWindow>

        </>
    );
};

export default withRouter(ViewStudentModal);