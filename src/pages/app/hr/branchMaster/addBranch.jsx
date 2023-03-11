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


const AddBranch = (props) => {

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
        axios.post(ServiceUrl.HR.SAVE_BRANCH, $("#frm_saveBranch").serialize()).then(res => {
            if (res['data'].status == '1') {
                document.getElementById("frm_saveBranch").reset();
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
            <Spin spinning={loader} >

                <Form
                    method="post"
                    noValidate
                    validated={validated}
                    id="frm_saveBranch"
                    onSubmit={handleFormSubmit}
                >

                    <Row className="">
                        <Col md={12}>
                            <label>Branch Name<span className="text-danger">*</span></label>
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
                        <Col md={6}>
                            <label>Place</label>
                            <Form.Control
                                type="text"
                                name="place"
                                size="sm"
                                className='fw-bold'
                            />
                        </Col>
                        <Col md={6}>
                            <label>City</label>
                            <Form.Control
                                type="text"
                                name="city"
                                className='fw-bold'
                                size="sm"
                            />
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col md={6}>
                            <label>State</label>
                            <Form.Control
                                type="text"
                                name="state"
                                className='fw-bold'
                                size="sm"
                            />
                        </Col>
                        <Col md={6}>
                            <label>Pincode</label>
                            <Form.Control
                                type="number"
                                name="pincode"
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
        </>
    );
};

export default withRouter(AddBranch);
