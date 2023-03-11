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
import { listUserRoles } from '../../../../models/users';

const NewUserLogin = (props) => {

    const context = useContext(PsContext);
  
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);
    const [employee, setEmployee] = useState([]);

    const [userRoles, setUserRoles] = useState([]);

    useEffect(()=>{
        loadRoles();
    },[]);

    const loadRoles=()=>{
        setLoader(true);
        listUserRoles(1).then(res=>{
            if(res) setUserRoles(res);
            setLoader(false);
        });
    }

    const handleFormSubmit=(e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if(form.checkValidity() === false){
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true);
        axios.post(ServiceUrl.ADMISSION.NEW_USER_LOGIN, $("#frm_addUserLogin").serialize()).then(res=>{
            if(res['data'].status=='1'){    
                document.getElementById("frm_addUserLogin").reset();
                setEmployee([]);
                
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

    const getEmployee=(empcode)=>{
        setLoader(true);
        axios.get(ServiceUrl.HR.EMPLOYEE_BY_CODE+'?emp_code='+empcode).then(res=>{
            if(res['data'].status=='1'){
                setEmployee(res['data'].data[0]);
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
                    id="frm_addUserLogin"
                    onSubmit={handleFormSubmit}
                >
                   <Row className="">
                        <Col md={3}>
                            <label >User Name <span className="text-danger">*</span></label>
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                name="user_name"
                                size="sm"
                                className="fw-bold"
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={3}>
                            <label>Password <span className="text-danger">*</span></label>
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                type="password"
                                name="password"
                                size="sm"
                                className="fw-bold"
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={3}>
                            <label>Confirm Pass. <span className="text-danger">*</span></label>
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                type="password"
                                name="confirm_password"
                                size="sm"
                                className="fw-bold"
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={3}>
                            <label>Role/Access <span className="text-danger">*</span></label>
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                as="select"
                                name="role_uid"
                                size="sm"
                                className="fw-bold"
                                required
                            >
                                <option value="">-Select-</option>
                                {userRoles.map(item => <option value={item.id}>{item.role_name}</option>)}
                                {/*<option value="masteradmin"> Master Admin </option>
                                <option value="accountant"> Accountant </option>
                                <option value="hod"> HOD </option>
    <option value="teacher"> Teacher </option>*/}
                            </Form.Control>
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={12}>
                            <label className="fs-sm fw-bold">Employee Information</label>
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={3}>
                            <label>Emp. Code <span className="text-danger">*</span></label>
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                name="employee_code"
                                size="sm"
                                className="fw-bold"
                                onBlur={e => getEmployee(e.target.value)}
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={3}>
                            <label>Emp. Name <span className="text-danger"></span></label>
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                name="employee_name"
                                size="sm"
                                className="fw-bold"
                                value={employee.emp_name || ''}
                                readOnly
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={3}>
                            <label>Phone <span className="text-danger"></span></label>
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                name="employee_phone"
                                size="sm"
                                className="fw-bold"
                                value={employee.emp_personal_mobile || ''}
                                readOnly
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={3}>
                            <label>Status <span className="text-danger">*</span></label>
                        </Col>
                        <Col md={9}>
                            <Form.Control
                                as="select"
                                name="status"
                                size="sm"
                                className="fw-bold"
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

export default withRouter(NewUserLogin);
