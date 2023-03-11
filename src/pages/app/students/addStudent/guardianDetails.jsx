import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { momentDate } from '../../../../utils';
import { listCommunity, listReligions } from '../../../../models/settings';


const GuardianDetails = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);

    const [presentAddress, setPresentAddress] = useState([]);

    const handleAddressChange=(e)=>{
        let s = [...presentAddress];
        s[e.target.name] = e.target.value;
        setPresentAddress(s);
        props.onAddressChange(s);
    };

    
    const onCheckClick=(e)=>{
        if(e.target.checked)
        {
        }
    }

    const field=(fieldName)=>{
        if(props.dataSource && props.dataSource[fieldName]) return props.dataSource[fieldName];
    }
   
   return (
        <>
            <Card>
                <Card.Header className="fw-bold">Guardian Details</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3}><label>Name <span className="text-danger"></span></label></Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_name"
                                placeholder="Name"
                                defaultValue={field('guardian_name')}
                            />
                        </Col>                        
                    </Row>
                    <Row className="mt-2">
                        <Col md={3}><label>Relationship <span className="text-danger"></span></label></Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_relation"
                                placeholder="Relationship"
                                defaultValue={field('guardian_relation')}
                            />
                        </Col>                        
                    </Row>
                    <Row className="mt-2">
                        <Col md={3}><label>Occupation <span className="text-danger"></span></label></Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_occupation"
                                placeholder="Occupation"
                                defaultValue={field('guardian_occupation')}
                            />
                        </Col>                        
                    </Row>
                    <Row className="mt-2">
                        <Col md={3}><label>Phone & Mail<span className="text-danger"></span></label></Col>
                        <Col md={4}>
                            <Form.Control
                                type="number"
                                size="sm"
                                className="fw-bold"
                                name="guardian_mobile"
                                placeholder="Phone"
                                defaultValue={field('guardian_mobile')}
                            />
                        </Col>                        
                        <Col md={5}>
                            <Form.Control
                                type="email"
                                size="sm"
                                className="fw-bold"
                                name="guardian_email"
                                placeholder="Mail Id"
                                defaultValue={field('guardian_email')}
                            />
                        </Col>                        
                    </Row>
                    <Row className="mt-2">
                        <Col md={3}><label>Door No / Street <span className="text-danger"></span></label></Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_doorno"
                                placeholder="Door No"
                                defaultValue={field('guardian_doorno')}
                            />
                        </Col>                        
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_street"
                                placeholder="Street Name"
                                defaultValue={field('guardian_street')}
                            />
                        </Col>                        
                        {/*<Col md={5}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_place"
                                placeholder="Place Name"
                                defaultValue={field('guardian_place')}
                            />
                        </Col> */}                       
                    </Row>

                    <Row className="mt-2">
                        <Col md={3}><label>Taluk & District <span className="text-danger"></span></label></Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_taluk"
                                placeholder="Taluk Name"
                                defaultValue={field('guardian_taluk')}
                            />
                        </Col>   
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_district"
                                placeholder="District Name"
                                defaultValue={field('guardian_district')}
                            />
                        </Col>                         
                       {/*<Col md={5}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_city"
                                placeholder="City Name"
                                defaultValue={field('guardian_city')}
                            />
                        </Col>    */}                    
                    </Row>

                    <Row className="mt-2">
                        <Col md={3}><label>State <span className="text-danger"></span></label></Col>
                                            
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_state"
                                placeholder="State Name"
                                defaultValue={field('guardian_state')}
                            />
                        </Col>                        
                    </Row>
                    <Row className="mt-2">
                        <Col md={3}><label>Country & Pincode <span className="text-danger"></span></label></Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="guardian_country"
                                placeholder="Country Name"
                                defaultValue={field('guardian_country')}
                            />
                        </Col>                        
                        <Col md={5}>
                            <Form.Control
                                type="number"
                                size="sm"
                                className="fw-bold"
                                name="guardian_pincode"
                                placeholder="Pincode"
                                defaultValue={field('guardian_pincode')}
                            />
                        </Col>                        
                    </Row>
                   
                </Card.Body>
            </Card>
        </>
    );
};

export default withRouter(GuardianDetails);