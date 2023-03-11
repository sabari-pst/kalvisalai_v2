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

const AddHoliday = (props) => {

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
        axios.post(ServiceUrl.HR.SAVE_HOLIDAY, $("#frm_saveHrHoliday").serialize()).then(res=>{
            if(res['data'].status=='1'){    
                document.getElementById("frm_saveHrHoliday").reset();
                if(props.onSuccess)
                    props.onSuccess();

                    toast.success(res['data'].message || 'Success');
            }
            else{
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
                    id="frm_saveHrHoliday"
                    onSubmit={handleFormSubmit}
                >

                    <Row className="mt-1">
                        <Col md={12}>
                            <label className="fs-sm">Holiday Date <span className="text-danger">*</span></label>
                            <Form.Control
                                type="date"
                                name="holiday_date"
                                className="fw-bold"
                                size="sm"
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col md={12}>
                            <label className="fs-sm">Holiday Name <span className="text-danger">*</span></label>
                            <Form.Control
                                type="text"
                                name="holiday_name"
                                className="fw-bold"
                                size="sm"
                                required
                            />
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

export default withRouter(AddHoliday);
