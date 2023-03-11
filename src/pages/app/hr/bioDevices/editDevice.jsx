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


const EditDevice = (props) => {

    const context = useContext(PsContext);
  
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);
   
    const handleFormSubmit=(e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if(form.checkValidity() === false){
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true);
        axios.post(ServiceUrl.HR.UPDATE_BIOMETRIC_DEVICE, $("#frm_UpdateBioDevice").serialize()).then(res=>{
            if(res['data'].status=='1'){    

                if(props.onSuccess)
                    props.onSuccess(res['data'].data);

                    toast.success(res['data'].message || 'Success');
            }
            else{
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }

    const field=(fieldName)=>{
        if(props.dataSource && props.dataSource[fieldName])
            return props.dataSource[fieldName];
    }
  
    
    return (
        <>
            <Spin spinning={loader} >

                <Form
                    method="post"
                    noValidate
                    validated={validated}
                    id="frm_UpdateBioDevice"
                    onSubmit={handleFormSubmit}
                >

                    <input type="hidden" name="id" value={field('id')} />

                    <Row className="mt-1">
                        <Col md={12}>
                            <label>Device Serial No <span className="text-danger">*</span></label>
                            <Form.Control
                                type="text"
                                name="serial_no"
                                className="fw-bold"
                                size="sm"
                                defaultValue={field('device_serial_no')}
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={12}>
                            <label>Device Name <span className="text-danger">*</span></label>
                            <Form.Control
                                type="text"
                                name="device_name"
                                className="fw-bold"
                                size="sm"
                                defaultValue={field('device_name')}
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={12}>
                            <label>Model Name <span className="text-danger">*</span></label>
                            <Form.Control
                                type="text"
                                name="model_name"
                                className="fw-bold"
                                defaultValue={field('device_model')}
                                size="sm"
                            />
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={12}>
                            <label>Location <span className="text-danger">*</span></label>
                            <Form.Control
                                type="text"
                                name="location"
                                className="fw-bold"
                                size="sm"
                                defaultValue={field('device_location')}
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col md={12}>
                            <label>Status <span className="text-danger">*</span></label>
                            <Form.Control
                                as="select"
                                name="status"
                                className="fw-bold"
                                size="sm"
                                required
                            >
                                <option value="1" selected={field('active_status')=='1' ? 'selected' : ''} > Active </option>
                                <option value="0" selected={field('active_status')=='0' ? 'selected' : ''}  > In-Active </option>
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

export default withRouter(EditDevice);
