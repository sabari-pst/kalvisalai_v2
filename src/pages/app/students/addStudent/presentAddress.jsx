import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { momentDate } from '../../../../utils';
import { listCommunity, listReligions } from '../../../../models/settings';


const PresentAddress = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);

    const [presentAddress, setPresentAddress] = useState({});

    const handleAddressChange=(e)=>{
        let s = presentAddress;        
       s[e.target.name] = e.target.value;
        setPresentAddress(s);
        //props.onAddressChange(s);
    };

    const getValue=(name)=>{
        return (presentAddress && presentAddress[name]);
    }
    const field=(fieldName)=>{
        if(props.dataSource && props.dataSource[fieldName]) return props.dataSource[fieldName];
    }

   
   return (
        <>
            <Card>
                <Card.Header className="fw-bold">Present Address</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3}><label>Street <span className="text-danger"></span></label></Col>
                        <Col md={2}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="doorno_present"
                                placeholder="Door No"
                                defaultValue={field('doorno_present')}
                            />
                        </Col>                        
                        <Col md={7}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="street_persent"
                                placeholder="Street Name"
                                defaultValue={field('street_persent')}
                            />
                        </Col>                        
                    </Row>
                    {/*<Row className="mt-2">
                        <Col md={3}><label>Place <span className="text-danger"></span></label></Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="place_present"
                                placeholder="Place Name"
                                defaultValue={field('place_present')}
                            />
                        </Col>                        
                    </Row>*/}
                    <Row className="mt-2">
                        <Col md={3}><label>Village / City <span className="text-danger"></span></label></Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="village_present"
                                placeholder="Village Name"
                                defaultValue={field('village_present')}
                            />
                        </Col>                        
                    </Row>
                    <Row className="mt-2">
                        <Col md={3}><label>Taluk <span className="text-danger"></span></label></Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="taluk_present"
                                placeholder="Taluk Name"
                                defaultValue={field('taluk_present')}
                            />
                        </Col>                        
                    </Row>
                    {/*<Row className="mt-2">
                        <Col md={3}><label>City <span className="text-danger"></span></label></Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="city_present"
                                placeholder="City Name"
                                defaultValue={field('city_present')}
                            />
                        </Col>                        
                    </Row>*/}
                    <Row className="mt-2">
                        <Col md={3}><label>District <span className="text-danger"></span></label></Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="district_present"
                                placeholder="District Name"
                                defaultValue={field('district_present')}
                            />
                        </Col>                        
                    </Row>
                    <Row className="mt-2">
                        <Col md={3}><label>State <span className="text-danger"></span></label></Col>
                        <Col md={9}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="state_present"
                                placeholder="State Name"
                                defaultValue={field('state_present')}
                            />
                        </Col>                        
                    </Row>
                    <Row className="mt-2">
                        <Col md={3}><label>Country & Pincode <span className="text-danger"></span></label></Col>
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="country_present"
                                placeholder="Country Name"
                                defaultValue={field('country_present')}
                            />
                        </Col>                        
                        <Col md={3}>
                            <Form.Control
                                type="number"
                                size="sm"
                                className="fw-bold"
                                name="pincode_present"
                                placeholder="Pincode"
                                defaultValue={field('pincode_present')}
                            />
                        </Col>                        
                    </Row>
                   
                </Card.Body>
            </Card>
        </>
    );
};

export default withRouter(PresentAddress);