import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';

import { Row, Col, Card, Modal, Button, Form, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { capitalizeFirst, CardFixedTop, upperCase } from '../../../../utils';
import { Spin } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';

import PsModalWindow from '../../../../utils/PsModalWindow';


const AddDepartment = (props) => {

    const context = useContext(PsContext);

    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true);
        axios.post(ServiceUrl.HR.SAVE_DEPARTMENT, $("#frm_saveDepartment").serialize()).then(res => {
            if (res['data'].status == '1') {
                document.getElementById("frm_saveDepartment").reset();
                if (props.onSuccess)
                    props.onSuccess();

                toast.success(res['data'].message || 'Success');
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }


    return (
        <>
            <PsModalWindow {...props} >
                <Spin spinning={loader} >

                    <Form
                        method="post"
                        noValidate
                        validated={validated}
                        id="frm_saveDepartment"
                        onSubmit={handleFormSubmit}
                    >

                        <Row className="">
                            <Col md={12}>
                                <label>Department Name<span className="text-danger">*</span></label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    className="text-uppercase fw-bold"
                                    size="sm"
                                    required
                                />
                            </Col>
                        </Row>

                        <Row className="mt-2">
                            <Col md={12}>
                                <label>Description</label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    className='fw-bold'
                                    size="sm"
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                        <Col md={12}>
                            <label>Status <span className="text-danger">*</span></label>
                            <Form.Control
                                as="select"
                                name="status"
                                size="sm"
                                className="fw-bold form-select form-select-sm"
                                required
                            >
                                <option value="1"> Active </option>
                                <option value="0"> In-Active </option>
                            </Form.Control>
                        </Col>
                    </Row>

                        <Row className="mt-3">
                            <Col md={12}>
                                <div className="text-end">
                                    <Button type="submit" size="sm" >
                                        <i className="fa-solid fa-check me-2"></i>Save
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                    </Form>

                </Spin>
            </PsModalWindow>
        </>
    );
};

export default withRouter(AddDepartment);
