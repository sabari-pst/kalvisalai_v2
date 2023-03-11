import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Button, Card, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Spin, Radio, Space, Tabs } from 'antd';

import PsContext from '../../../../context';
import { CardFixedTop, upperCase } from '../../../../utils';
import PsModalWindow from '../../../../utils/PsModalWindow';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import toast from 'react-hot-toast';
import axios from 'axios';
import UserPassword from './userPassword';

const User = (props) => {

    const context = useContext(PsContext);

    const [loader, setLoader] = useState(false);
    const [viewData, setviewData] = useState([]);
    const [PasswordModal, setPasswordModal] = useState(false);
    useEffect(() => {
        LoadData();
    }, []);

    const LoadData = () => {
        setviewData([]);

        const form = new FormData();
        form.append('id', context.user.id);

        setLoader(true);
        axios.post(ServiceUrl.ADMISSION.USER_PROFILE, form).then(res => {
            if (res['data'].status == '1') {
                setviewData(res['data'].data);

            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }



    return (
        <>
            <CardFixedTop title="My Profile" >

            </CardFixedTop>
            <div className="container">

                <Row>
                    <Spin spinning={loader} >
                        <Row>
                            <Col md={12} >
                                <Row className='mt-3'>

                                    <Col md={2}>
                                        <label className="control-label">Username </label>
                                    </Col>
                                    <Col md={4}>
                                        : {viewData.username}

                                    </Col>

                                </Row>
                                <Row className='mt-3'>

                                    <Col md={2}>
                                        <label className="control-label">Employee Name </label>
                                    </Col>
                                    <Col md={4}>
                                        : {viewData.employee_name}

                                    </Col>

                                </Row>
                                <Row className='mt-3'>

                                    <Col md={2}>
                                        <label className="control-label">Employee Id </label>
                                    </Col>
                                    <Col md={4}>
                                        : {viewData.employee_id}

                                    </Col>

                                </Row>
                                <Row className='mt-3'>

                                    <Col md={2}>
                                        <label className="control-label">Employee Code </label>
                                    </Col>
                                    <Col md={4}>
                                        : {viewData.employee_code}

                                    </Col>

                                </Row>
                                <Row className='mt-3'>

                                    <Col md={2}>
                                        <label className="control-label">Role </label>
                                    </Col>
                                    <Col md={4}>
                                        : {viewData.role}

                                    </Col>

                                </Row>



                                <Row className='mt-3'>
                                    <Col md={12}>
                                        <div className='text-end'>
                                            <Button type="submit" variant="primary" onClick={() => {
                                                setPasswordModal(true);
                                            }}>
                                                <i className="fa-solid fa-key me-2"></i> Change Password
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>


                            </Col>


                        </Row>


                    </Spin>
                </Row>
            </div>

            <PsModalWindow title="Change Password" show={PasswordModal} onHide={() => setPasswordModal(false)} size="sm" >
                <UserPassword dataSource={viewData} afterFinish={() => { setPasswordModal(false); }} />
            </PsModalWindow>

        </>
    );
};

export default User;
