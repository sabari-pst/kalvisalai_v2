import React, { useState, useEffect, useContext, useCallback } from 'react';
import $, { map } from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../../context';
import { Image, Spin, Tabs } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import { momentDate, upperCase } from '../../../../../utils';

const TransportDetails = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    const [transportLog, setTransportLog] = useState([]);
    const [transport, setTransport] = useState([]);

    useEffect(()=>{
        loadData();
    },[]);

    const loadData=()=>{
        setLoader(true);
        setTransportLog([]);
        setTransport([]);

        const form = new FormData();
        form.append('uuid', props.dataSource.uuid);

        axios.get(ServiceUrl.STUDENTS.TRANSPORT_DETAILS+'?uuid='+props.dataSource.uuid, form).then(res=>{
            if(res['data'].status=='1'){
                let d = res['data'].data;
                setTransportLog(d.transport_log);
                setTransport(d.current_transport);
            }
            else{
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }

    const studentField=(fieldName)=> ((props.dataSource && props.dataSource[fieldName]) && props.dataSource[fieldName]);

    const transportField=(fieldName)=> ((transport && transport[fieldName]) && transport[fieldName]);

   return (
        <>
        <Spin spinning={loader}>

            <Card>
                <Card.Header className="fw-bold">Last Destination</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={2}>
                            <label>Vehicle No</label>
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                value={transportField('vehicle_no')}
                            />
                        </Col>
                        <Col md={2}>
                            <label>Vehicle Route</label>
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                value={upperCase(transportField('vehicle_route'))}
                            />
                        </Col>
                    </Row>
                   
                    <Row className="mt-2">
                        <Col md={2}>
                            <label>Destination</label>
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                size="sm"
                                className="fw-bold"
                                value={upperCase(transportField('destination_name'))}
                            />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="mt-2">
                <Card.Header className="fw-bold">Transport Logs</Card.Header>
                <Card.Body>
                    <div className="tableFixHead">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th width="60">S.No</th>
                                    <th>Date From</th>
                                    <th>Vehicle No</th>
                                    <th>Route</th>
                                    <th>Destination</th>
                                    <th width="120" className="text-end">Rate (Per month)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transportLog.map((item,i)=>{
                                    return <tr key={i} >
                                        <td>{i+1}</td>
                                        <td>{momentDate(item.date_from, 'DD/MM//YYYY')}</td>
                                        <td>{upperCase(item.vehicle_no)}</td>
                                        <td>{upperCase(item.vehicle_route)}</td>
                                        <td>{upperCase(item.destination_name)}</td>
                                        <td align="right">{item.rate}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>

        </Spin>
        </>
    );
};

export default withRouter(TransportDetails);