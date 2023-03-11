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

const EditVehicle = (props) => {

    const context = useContext(PsContext);
  
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    const [routes, setRoutes] = useState([]);

    useEffect(()=>{
        listVehicles().then(res => {
            if(res){
                let m = groupByMultiple(res, function(obj){ return [obj.vehicle_route] });
                setRoutes(m);
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
        axios.post(ServiceUrl.TRANSPORT.UPDATE_VEHICLE, $("#frm_UpdateVehicle").serialize()).then(res=>{
            if(res['data'].status=='1'){    

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

    const field=(fieldName)=>{
        if(props.dataSource && props.dataSource[fieldName])
            return props.dataSource[fieldName];
    }
  
    
    return (
        <>
            <Spin spinning={loader} >

                <Form
                    method="post"
                    noValidate
                    validated={validated}
                    id="frm_UpdateVehicle"
                    onSubmit={handleFormSubmit}
                >

                    <input type="hidden" name="id" value={field('id')} />

                    <Row className="mt-1">
                        <Col md={12}>
                            <label className="fs-sm">Vehicle Number <span className="text-danger">*</span></label>
                            <Form.Control
                                type="text"
                                name="vehicle_no"
                                defaultValue={field("vehicle_no")}
                                size="sm"
                                className="fw-bold text-uppercase"
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col md={12}>
                            <label className="fs-sm">Vehicle Route <span className="text-danger">*</span></label>
                            <Form.Control
                                type="text"
                                name="route"
                                defaultValue={field("vehicle_route")}
                                className="fw-bold"
                                size="sm"
                                list="route_list"
                                required
                            />
                        </Col>
                        <datalist id="route_list">
                            {routes.map(item => <option value={item[0].vehicle_route} />)}
                        </datalist>
                    </Row>

                    <Row className="mt-3">
                        <Col md={12}>
                            <label className="fs-sm">Status <span className="text-danger">*</span></label>
                            <Form.Control
                                as="select"
                                name="status"
                                className="fw-bold"
                                size="sm"
                                required
                            >
                                <option value="1" selected={field('active_status')=='1' ? 'selected' : ''} > Active </option>
                                <option value="0" selected={field('active_status')=='0' ? 'selected' : ''}  > In-Active </option>
                            </Form.Control>
                        </Col>
                    </Row>

                    <Row className="mt-3">                    
                        <Col md={12}>
                            <div className="text-end">
                                <Button type="submit" size="sm" >
                                    <i className="fa-solid fa-check me-2"></i> Update
                                </Button>
                            </div>
                        </Col>
                    </Row>

                </Form>

            </Spin>
        </>
    );
};

export default withRouter(EditVehicle);
