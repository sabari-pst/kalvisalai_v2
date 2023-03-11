import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';

import { Row, Col, Card, Modal, Button, Form, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { Spin } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import { momentDate } from '../../../../utils';


const ImportAttFromMachine = (props) => {

    const context = useContext(PsContext);
  
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);    
    const [attDate, setAttDate] = useState(momentDate(new Date(),'YYYY-MM'));

    const handleFormSubmit=(e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if(form.checkValidity() === false){
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true);
        axios.post(ServiceUrl.HR.ATT_MONTH_LOG, $("#frm_attSheetMonth").serialize()).then(res=>{
            if(res['data'].status=='1'){    
                
                if(props.onSuccess)
                    props.onSuccess(res['data'].data, attDate);

                    //toast.success(res['data'].message || 'Success');
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
                    id="frm_attSheetMonth"
                    onSubmit={handleFormSubmit}
                >

                    <Row className="mt-1">
                        <Col md={12}>
                            <label className="fs-sm">Attendance For the month of <span className="text-danger">*</span></label>
                            <Form.Control
                                type="month"
                                name="att_month"
                                max={momentDate(new Date(),'YYYY-MM')}
                                onChange={e => setAttDate(e.target.value)}
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
                                    <i className="fa-solid fa-check me-2"></i> Import Data
                                </Button>
                            </div>
                        </Col>
                    </Row>

                </Form>

            </Spin>
        </>
    );
};

export default withRouter(ImportAttFromMachine);
