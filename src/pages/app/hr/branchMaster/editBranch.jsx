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

const EditBranch = (props) => {

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
        axios.post(ServiceUrl.HR.UPDATE_BRANCHE, $("#frm_UpdateHrBranch").serialize()).then(res => {
            if (res['data'].status == '1') {

                if (props.onSuccess)
                    props.onSuccess(res['data'].data);

                toast.success(res['data'].message || 'Success');
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }

    const field = (fieldName) => {
        if (props.dataSource && props.dataSource[fieldName])
            return props.dataSource[fieldName];
    }


    return (
        <>
            <Spin spinning={loader} >

                <Form
                    method="post"
                    noValidate
                    validated={validated}
                    id="frm_UpdateHrBranch"
                    onSubmit={handleFormSubmit}
                >

                    <input type="hidden" name="id" value={field('id')} />

                    <Row className="">
                        <Col md={12}>
                            <label>Branch Name <span className="text-danger">*</span></label>
                            <Form.Control
                                type="text"
                                name="name"
                                defaultValue={field("branch_name")}
                                size="sm"
                                className="fw-bold text-uppercase"
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
                                defaultValue={field("branch_place")}
                                size="sm"
                            />
                        </Col>
                        <Col md={6}>
                            <label>City</label>
                            <Form.Control
                                type="text"
                                name="city"
                                defaultValue={field("branch_city")}
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
                                defaultValue={field("branch_state")}
                                size="md"
                            />
                        </Col>
                        <Col md={6}>
                            <label>Pincode</label>
                            <Form.Control
                                type="number"
                                name="pincode"
                                defaultValue={field("branch_pincode")}
                                size="md"
                            />
                        </Col>
                    </Row>

                    <Row className="mt-1">
                        <Col md={12}>
                            <label>Status <span className="text-danger">*</span></label>
                            <Form.Control
                                as="select"
                                name="status"
                                className="fw-bold"
                                size="sm"
                                required
                            >
                                <option value="1" selected={field('active_status') == '1' ? 'selected' : ''} > Active </option>
                                <option value="0" selected={field('active_status') == '0' ? 'selected' : ''}  > In-Active </option>
                            </Form.Control>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col md={12}>
                            <div className="text-end">
                                <Button type="submit" size="sm" >
                                    <i className="fa-solid fa-check me-2"></i> Update
                                </Button>
                            </div>
                        </Col>
                    </Row>

                </Form>

            </Spin>
        </>
    );
};

export default withRouter(EditBranch);
