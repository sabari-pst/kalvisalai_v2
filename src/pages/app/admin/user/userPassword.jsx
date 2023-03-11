import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import PsContext from '../../../../context'
import { ServiceUrl } from '../../../../utils/serviceUrl';
import axios from 'axios';
import { Spin } from 'antd';
import toast from 'react-hot-toast';

const UserPassword = (props) => {

    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(() => {

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
        axios.post(ServiceUrl.ADMISSION.USER_CHANGE_PASSWORD, $("#frm_UpdatePage").serialize()).then(res => {
            if (res['data'].status == '1') {
                toast.success(res['data'].message || 'Success');

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
                <Form noValidate validated={validated} method="post" id="frm_UpdatePage" onSubmit={handleFormSubmit}>
                    <Row>
                        <Col md={12} >

                            <input type="hidden" name="id" value={field('id')} />

                            <Row >

                                <Col >
                                    <label className="control-label">Old Password <span className="text-danger">*</span></label>
                                    <Form.Control
                                        type="password"
                                        name="old_password"
                                        size="sm"

                                        required
                                    />
                                </Col>
                            </Row>
                            <Row >
                                <Col>
                                    <label className="control-label">New Password <span className="text-danger">*</span></label>
                                    <Form.Control
                                        type="password"
                                        name="new_password"
                                        size="sm"

                                        required
                                    />
                                </Col>
                            </Row>
                            <Row >
                                <Col>
                                    <label className="control-label">Confirm New Password <span className="text-danger">*</span></label>
                                    <Form.Control
                                        type="password"
                                        name="confirm_new_password"
                                        size="sm"

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

export default UserPassword;
