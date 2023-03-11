import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';

import { Row, Col, Card, Modal, Button, Form, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../context';
import { capitalizeFirst, CardFixedTop, groupByMultiple, upperCase } from '../../../utils';
import { Spin } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../utils/serviceUrl';
import { listVehicles } from '../../../models/transport';

const AddDestinations = (props) => {

    const context = useContext(PsContext);
  
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);    

    const [routes, setRoutes] = useState([]);
    const [vehicles, setVeicles] = useState([]);

    useEffect(()=>{
        listVehicles().then(res => {
            if(res){
                let m = groupByMultiple(res, function(obj){ return [obj.vehicle_route] });
                setRoutes(m);
                setVeicles(res);
            }
        });
    },[]);

    const handleFormSubmit=(e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if(form.checkValidity() === false){
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true);
        axios.post(ServiceUrl.TRANSPORT.SAVE_DESTINATION, $("#frm_SaveDestination").serialize()).then(res=>{
            if(res['data'].status=='1'){    
                document.getElementById("frm_SaveDestination").reset();
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
                    id="frm_SaveDestination"
                    onSubmit={handleFormSubmit}
                >

                    <Row className="mt-1">
                        <Col md={12}>
                            <label className="fs-sm">Destination Name  <span className="text-danger">*</span></label>
                            <Form.Control
                                type="text"
                                name="destination"
                                className="fw-bold text-uppercase"
                                size="sm"
                                required
                            />
                        </Col>
                    </Row>
                   
                    <Row className="mt-2">
                        <Col md={12}>
                            <label className="fs-sm">Vehicle <span className="text-danger">*</span></label>
                            <Form.Control
                                as="select"
                                name="vehicle"
                                className="fw-bold form-select form-select-sm"
                                size="sm"
                                required
                            >
                                <option value="">-Select-</option>
                                {vehicles.map(item => <option value={item.id}>{item.vehicle_no} - {item.vehicle_route}</option>)}
                            </Form.Control>
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={12}>
                            <label className="fs-sm">Rate (per month) <span className="text-danger">*</span></label>
                            <Form.Control
                                type="number"
                                name="rate"
                                className="fw-bold"
                                size="sm"
                                required
                            />
                        </Col>
                    </Row>
                    
                    <Row className="mt-2">
                        <Col md={12}>
                            <label className="fs-sm">Status <span className="text-danger">*</span></label>
                            <Form.Control
                                as="select"
                                name="status"
                                className="fw-bold"
                                size="sm"
                                required
                            >
                                <option value="1" > Active </option>
                                <option value="0" > In-Active </option>
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

export default withRouter(AddDestinations);
