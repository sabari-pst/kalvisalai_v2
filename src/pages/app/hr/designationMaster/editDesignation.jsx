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

const EditDesignation = (props) => {

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
        axios.post(ServiceUrl.HR.UPDATE_DESIGNATION, $("#frm_UpdateHrDesignation").serialize()).then(res => {
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

            <PsModalWindow {...props} >
                <Spin spinning={loader} >

                    <Form
                        method="post"
                        noValidate
                        validated={validated}
                        id="frm_UpdateHrDesignation"
                        onSubmit={handleFormSubmit}
                    >

                        <input type="hidden" name="id" value={field('id')} />

                        <Row className="">
                            <Col md={12}>
                                <label>Designation Name <span className="text-danger">*</span></label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    defaultValue={field("designation_name")}
                                    size="sm"
                                    className="fw-bold text-uppercase"
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
                                    defaultValue={field("designation_description")}
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
                                        <i className="fa-solid fa-check me-2"></i> Update
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

export default withRouter(EditDesignation);
