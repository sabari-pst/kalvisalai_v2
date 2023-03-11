import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { momentDate } from '../../../../utils';
import { listCommunity, listReligions } from '../../../../models/settings';


const PermanentAddress = (props) => {

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
                <Card.Header className="fw-bold">Permanent Address
                <span className='float-end'>
                    <Form.Check
                        type="checkbox"
                        label="Same as Present Address"
                        style={{fontWeight:'100'}}
                        onChange={onCheckClick}
                    />
                </span>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3}><label>Door No / Street <span className="text-danger"></span></label></Col>
                        <Col md={2}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="doorno_permanent"
                                placeholder="Door No"
                                defaultValue={field('doorno_permanent')}
                            />
                        </Col>                        
                        <Col md={7}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                name="street_permanent"
                                placeholder="Street Name"
                                defaultValue={field('street_permanent')}
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
                                name="place_permanent"
                                placeholder="Place Name"
                                defaultValue={field('place_permanent')}
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
                                name="village_permanent"
                                placeholder="Village Name"
                                defaultValue={field('village_permanent')}
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
                                name="taluk_permanent"
                                placeholder="Taluk Name"
                                defaultValue={field('taluk_permanent')}
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
                                name="city_permanent"
                                placeholder="City Name"
                                defaultValue={field('city_permanent')}
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
                                name="district_permanent"
                                placeholder="District Name"
                                defaultValue={field('district_permanent')}
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
                                name="state_permanent"
                                placeholder="State Name"
                                defaultValue={field('state_permanent')}
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
                                name="country_permanent"
                                placeholder="Country Name"
                                defaultValue={field('country_permanent')}
                            />
                        </Col>                        
                        <Col md={3}>
                            <Form.Control
                                type="number"
                                size="sm"
                                className="fw-bold"
                                name="pincode_permanent"
                                placeholder="Pincode"
                                defaultValue={field('pincode_permanent')}
                            />
                        </Col>                        
                    </Row>
                   
                </Card.Body>
            </Card>
        </>
    );
};

export default withRouter(PermanentAddress);