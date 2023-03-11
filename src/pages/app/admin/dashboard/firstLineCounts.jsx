import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';

import { Row, Col, Card, Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { capitalizeFirst, CardFixedTop, upperCase } from '../../../../utils';
import { printHeader } from '../../../../utils/data';
import API from '../../../../utils/api';
import { checkBalance } from '../../../../models/resellerSms';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';

const FirstLineCounts = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [smsBalance, setSmsBalance] = useState(null);

    const [count, setCount] = useState([]);
   
    useEffect(() => {

       loadCount();        

    }, []);


    const loadCount=()=>{
        setLoader(true);
        axios.get(ServiceUrl.DASHBOARD.FIRST_LINE_COUNT).then(res=>{
            if(res['data'].status=='1'){
                setCount(res['data'].data);
            }
            setLoader(false);
        }); 
    }
    
    const getCount=(fieldName)=>{
        if(count && count[fieldName]) return count[fieldName];
        else return '0';
    }

    return (
        <>

    
            <Row className="mt-3">
                
            <div className="col-md-3 ">
                <div className="widget-flat card ">
                    <div className="card-body bg-orange-100">
                        <div className="float-end">
                            <i className="fa-solid fa-wallet fs-3 "></i>
                        </div>
                        <h5 className="fw-normal mt-0 text-muted" title="Students">Today Fee Collection</h5>
                        <h3 className="mt-3 mb-3">
                        {loader && (<Spinner animation="grow" size="sm" variant="light" />)}
                        {!loader && getCount('today_fee_collection')}
                        </h3>
                        {/*
                        <p class="mb-0 text-muted">
                            <span class="text-success me-2">
                                <i class="mdi mdi-arrow-up-bold"></i> 5.27%
                            </span>
                            <span class="text-nowrap">Since last month</span>
                        </p>
                        */}
                    </div>
                </div>
            </div>
            
            <div className="col-md-3 ">
                <div className="widget-flat card bg-teal-50">
                    <div className="card-body">
                        <div className="float-end">
                            <i className="fa-solid fa-wallet fs-3"></i>
                        </div>
                        <h5 className="fw-normal mt-0 text-muted" title="Students">This Month </h5>
                        <h3 className="mt-3 mb-3">
                        {loader && (<Spinner animation="grow" size="sm" variant="light" />)}
                        {!loader && getCount('month_fee_collection')}
                        </h3>
                    </div>
                </div>
            </div>
           
            <div className="col-md-3 ">
                <div className="widget-flat card bg-blue-100">
                    <div className="card-body">
                        <div className="float-end">
                            <i className="fa-solid fa-users fs-3"></i>
                        </div>
                        <h5 className="fw-normal mt-0 text-muted" title="Students">Students</h5>
                        <h3 className="mt-3 mb-3">
                        {loader && (<Spinner animation="grow" size="sm" variant="light" />)}
                        {!loader && getCount('total_students')}
                        </h3>
                    </div>
                </div>
            </div>
            
            <div className="col-md-3 ">
                <div className="widget-flat card bg-green-100">
                    <div className="card-body">
                        <div className="float-end">
                            <i className="fa-solid fa-user-group fs-3"></i>
                        </div>
                        <h5 className="fw-normal mt-0 text-muted" title="Students">Staffs</h5>
                        <h3 className="mt-3 mb-3">
                        {loader && (<Spinner animation="grow" size="sm" variant="light" />)}
                        {!loader && getCount('total_staffs')}
                        </h3>
                    </div>
                </div>
            </div>

            </Row>

       

        </>
    );
};

export default withRouter(FirstLineCounts);
