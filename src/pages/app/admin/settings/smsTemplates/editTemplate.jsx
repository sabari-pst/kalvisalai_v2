import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import PsContext from '../../../../../context'
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import axios from 'axios';
import { Spin } from 'antd';
import toast from 'react-hot-toast';

const EditTemplate = (props) => {

    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    const [originalText, setOriginalText] = useState('');

    useEffect(() => {
        setOriginalText(props.dataSource.template);
    }, []);
    const field = (fieldName => (props.dataSource[fieldName] || ''));

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true);
        axios.post(ServiceUrl.ADMISSION.UPDATE_SMS_TEMPLATES, $("#frm_UpdateTemplate").serialize()).then(res => {
            if (res['data'].status == '1') {
                toast.success(res['data'].content || 'Success');

                if (props.afterFinish)
                    props.afterFinish();
            }
            else {
                toast.error(res['data'].content || 'Error');
            }
            setLoader(false);
        });
    }


    return (
        <>
            <Spin spinning={loader}>
                <Form noValidate validated={validated} method="post" id="frm_UpdateTemplate" onSubmit={handleFormSubmit}>
                    <Row>
                        <Col md={12} >

                            <input type="hidden" name="id" value={field('id')} />
                            <Row >
                                <Col md={12}>

                                    <label className="control-label">Template for <span className="text-danger">*</span></label>
                                    <Form.Control
                                        type="text"
                                        name="template_for"
                                        size="sm"
                                        defaultValue={field('template_for')}
                                        required
                                    />
                                    <ul style={{ fontSize: '11px' }} >
                                        <li>Don't use Special Characters and Space</li>
                                        <li>Use underscore (_) only</li>
                                    </ul>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <label className="control-label">Template Id <span className="text-danger">*</span></label>
                                    <Form.Control
                                        type="text"
                                        name="template_id"
                                        size="sm"
                                        defaultValue={field('template_id')}
                                        required
                                    />
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col md={12}>
                                    <label className="control-label">Template <span className="text-danger">*</span></label>
                                    <Form.Control
                                        as="textarea"
                                        name="template"
                                        size="sm"
                                        rows="6"
                                        value={originalText}
                                        onChange={e => setOriginalText(e.target.value)}
                                        required
                                    />
                                </Col>
                            </Row>

                            <Row className='mt-3'>
                                <Col md={12}>
                                    <div className='text-end'>
                                        <Button type="submit" variant="primary">
                                            <i className="fa-solid fa-check me-2"></i> Update
                                        </Button>
                                    </div>
                                </Col>
                            </Row>


                        </Col>


                    </Row>
                </Form>

            </Spin>
        </>
    );
};

export default EditTemplate;
