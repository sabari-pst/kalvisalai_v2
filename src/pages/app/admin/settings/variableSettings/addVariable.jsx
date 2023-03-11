import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import PsContext from '../../../../../context'
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import axios from 'axios';
import { Spin } from 'antd';
import toast from 'react-hot-toast';

const AddVariable = (props) => {

    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    const [originalText, setOriginalText] = useState('');


    useEffect(() => {

    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true);
        axios.post(ServiceUrl.ADMISSION.ADD_VARIABLE_SETTINGS, $("#frm_AddVariable").serialize()).then(res => {
            if (res['data'].status == '1') {
                toast.success(res['data'].message || 'Success');
                context.loadSettings();
                if (props.afterFinish)
                    props.afterFinish();
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }


    return (
        <>
            <Spin spinning={loader}>
                <Form noValidate validated={validated} method="post" id="frm_AddVariable" onSubmit={handleFormSubmit}>
                    <Row>
                        <Col md={12} >


                            <Row >
                                <Col md={6}>

                                    <label className="control-label">Field for <span className="text-danger">*</span></label>
                                    <Form.Control
                                        type="text"
                                        name="field_for"
                                        size="sm"
                                        required
                                    />

                                </Col>

                                <Col md={6}>
                                    <label className="control-label">UG/PG <span className="text-danger"></span></label>
                                    <Form.Control
                                        type="text"
                                        name="ug_pg"
                                        size="sm"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <label className="control-label">Course Type <span className="text-danger"></span></label>
                                    <Form.Control
                                        type="text"
                                        name="course_type"
                                        size="sm"                                        
                                    />
                                </Col>
                                <Col md={6}>
                                    <label className="control-label">Field Name <span className="text-danger">*</span></label>
                                    <Form.Control
                                        type="text"
                                        name="field_name"
                                        size="sm"
                                        defaultValue=""
                                        required
                                    />
                                </Col>


                            </Row>


                            <Row className='mt-2'>
                                <Col md={12}>
                                    <label className="control-label">Description <span className="text-danger">*</span></label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        size="sm"
                                        rows="3"
                                        value={originalText}
                                        onChange={e => setOriginalText(e.target.value)}
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-2' >
                                <Col md={6}>
                                    <label className="control-label">Field Type<span className="text-danger">*</span></label>
                                    <Form.Control
                                        as="select"
                                        name='field_type'
                                        size='sm'

                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="string"> String </option>
                                        <option value="multistring"> Multiline String </option>
                                        <option value="yesno"> Yes or No </option>
                                        <option value="number"> Number </option>

                                    </Form.Control>
                                </Col>

                            </Row>

                            <Row className='mt-3'>
                                <Col md={12}>
                                    <div className='text-end'>
                                        <Button type="submit" variant="primary">
                                            <i className="fa-solid fa-check me-2"></i> Save
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

export default AddVariable;
