import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import PsContext from '../../../../../context'
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import axios from 'axios';
import { Spin } from 'antd';
import toast from 'react-hot-toast';

const ViewWebPage = (props) => {

    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    const [originalText, setOriginalText] = useState('');

    useEffect(() => {
        if(props.page)
            setOriginalText(props.dataSource.template);
        else
            setOriginalText(props.dataSource.content);
    }, []);
    
    const field = (fieldName => (props.dataSource[fieldName] || ''));

    return (
        <>
            <Spin spinning={loader}>

                <Row>
                    <Col md={12} >
                        <div dangerouslySetInnerHTML={{ __html: originalText }}></div>

                    </Col>



                </Row>


            </Spin>
        </>
    );
};

export default ViewWebPage;
