import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../../context';
import { Image, Spin, Tabs } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import { calculateAge, capitalizeFirst, momentDate, semesterValue, upperCase, yearBySem } from '../../../../../utils';
import { SELECT_USER_PHOTO } from '../../../../../utils/data';

const FamilyDetailsCard = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState(props.dataSource);
    const [dataView, setDataView] = useState(props.dataSource);

    const field=(fieldName)=>{

        if(dataView && dataView[fieldName]) return dataView[fieldName];
    }
    
    const colMdFirst=(text, value)=>{
            return <Row className="mt-2">
                <Col md={2}>
                    <label>{text}</label>
                </Col>
                <Col md={10}>
                    <Form.Control
                        type="text"
                        size="sm"
                        className="fw-bold"
                        value={value}
                    />
                </Col>
            </Row>;
    };


   return (
        <>
                  
            <Row className="mt-2" >
                <Col md={9}>
                    <Card >
                        <Card.Header className="fw-bold">Family Details</Card.Header>
                        <Card.Body>

                            {colMdFirst('Father Name',field('fathername'))}

                            <Row className="mt-2">
                                <Col md={2}>
                                    <label>Occupation </label>
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        className="fw-bold"
                                        value={upperCase(field('fatheroccupation'))}
                                    />
                                </Col>
                                <Col md={2}>
                                    <label>Phone No</label>
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        className="fw-bold"
                                        value={upperCase(field('fatherphone'))}
                                    />
                                </Col>
                            </Row>

                            {colMdFirst('Mother Name',field('mothername'))}
                           
                            <Row className="mt-2">
                                <Col md={2}>
                                    <label>Occupation </label>
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        className="fw-bold"
                                        value={upperCase(field('motheroccupation'))}
                                    />
                                </Col>
                                <Col md={2}>
                                    <label>Phone No</label>
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        className="fw-bold"
                                        value={upperCase(field('motherphone'))}
                                    />
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card>
                        <Card.Header className="fw-bold">Special Category</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={8}>
                                    <label>Physically Challanged</label>
                                </Col>
                                <Col md={4}>                                            
                                    <Form.Control
                                        size="sm"
                                        className="fw-bold"
                                        value={field('is_physicall_challenged')=='1' ? 'Yes' : 'No'}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={8}>
                                    <label>Child of Ex.Ser.Man</label>
                                </Col>
                                <Col md={4}>                                            
                                    <Form.Control
                                        size="sm"
                                        className="fw-bold"
                                        value={field('is_exserviceman')=='1' ? 'Yes' : 'No'}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={8}>
                                    <label>Minority Student</label>
                                </Col>
                                <Col md={4}>                                            
                                    <Form.Control
                                        size="sm"
                                        className="fw-bold"
                                        value={field('is_minority')=='1' ? 'Yes' : 'No'}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={8}>
                                    <label>Scholarship</label>
                                </Col>
                                <Col md={4}>                                            
                                    <Form.Control
                                        size="sm"
                                        className="fw-bold"
                                        value={field('is_scholarship_holder')=='1' ? 'Yes' : 'No'}
                                    />
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={8}>
                                    <label>In Sports</label>
                                </Col>
                                <Col md={4}>                                            
                                    <Form.Control
                                        size="sm"
                                        className="fw-bold"
                                        value={field('is_sportsman')=='1' ? 'Yes' : 'No'}
                                    />
                                </Col>
                            </Row>
                            
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


        </>
    );
};

export default withRouter(FamilyDetailsCard);