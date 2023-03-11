import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { momentDate } from '../../../../utils';
import { listCommunity, listReligions } from '../../../../models/settings';


const FamilyDetails = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);

    const field=(fieldName)=>{
        if(props.dataSource && props.dataSource[fieldName]) return props.dataSource[fieldName];
    }
   
   return (
        <>
            <Card>
                <Card.Header className="fw-bold">Family Details</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3}><label>Father Name & Occupation <span className="text-danger">*</span></label></Col>
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold text-uppercase"
                                name="fathername"
                                placeholder="Father Name "
                                defaultValue={field('fathername')}
                                required
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="fatheroccupation"
                                placeholder="Father Occupation"
                                defaultValue={field('fatheroccupation')}
                            />
                        </Col>
                    </Row>
                    
                    <Row className="mt-2">
                        <Col md={3}><label>Father Mobile & Income <span className="text-danger"></span></label></Col>
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="fatherphone"
                                placeholder="Father Phone No "
                                defaultValue={field('fatherphone')}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="number"
                                size="sm"
                                className="fw-bold"
                                name="fatherincome"
                                placeholder="Father Income"
                                defaultValue={field('fatherincome')}
                            />
                        </Col>
                    </Row>
                    
                    <Row className="mt-2">
                        <Col md={3}><label>Mother Name & Occupation <span className="text-danger"></span></label></Col>
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold text-uppercase"
                                name="mothername"
                                placeholder="Mother Name "
                                defaultValue={field('mothername')}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="motheroccupation"
                                placeholder="Mother Occupation"
                                defaultValue={field('motheroccupation')}
                            />
                        </Col>
                    </Row>
                    
                    <Row className="mt-2">
                        <Col md={3}><label>Mother Mobile & Income <span className="text-danger"></span></label></Col>
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="motherphone"
                                placeholder="Mother Phone No "
                                defaultValue={field('motherphone')}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="number"
                                size="sm"
                                className="fw-bold"
                                name="motherincome"
                                placeholder="Mother Income"
                                defaultValue={field('motherincome')}
                            />
                        </Col>
                    </Row>
                    
                    {props.married && (<Row className="mt-2">
                        <Col md={3}><label>Partner Name & Mobile <span className="text-danger"></span></label></Col>
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="partnername"
                                placeholder="Partner Name"
                                defaultValue={field('partnername')}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="number"
                                size="sm"
                                className="fw-bold"
                                name="partnermobile"
                                placeholder="Partner Contact No"
                                defaultValue={field('partnermobile')}
                            />
                        </Col>
                    </Row>)}

                    <Row className="mt-2">
                        <Col md={3}><label>Family Annual Income <span className="text-danger"></span></label></Col>
                        <Col md={5}>
                            <Form.Control
                                type="number"
                                size="sm"
                                className="fw-bold"
                                name="annualincome"
                                placeholder="Family Annual Income"
                                defaultValue={field('annualincome')}
                            />
                        </Col>
                    </Row>
                    

                </Card.Body>
            </Card>
        </>
    );
};

export default withRouter(FamilyDetails);