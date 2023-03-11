import React, { useState, useEffect, useContext, useCallback } from 'react';
import $, { map } from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../../context';
import { Image, Spin, Tabs } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import { momentDate, upperCase } from '../../../../../utils';
import PaidListCard from './paidListCard';
import PendingListCard from './pendingListCard';
import CancelListCard from './cancelListCard';

const FeeDetails = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataView, setDataView] = useState([]);

    useEffect(()=>{
        loadData();
    },[]);

    const loadData=()=>{
        setLoader(true);
        setDataList([]);
        setDataView([]);

        const form = new FormData();
        form.append('student_uuid', props.dataSource.uuid);
        form.append('type','all');

        axios.post(ServiceUrl.FEES.CUSTOM_FEE_REPORT, form).then(res=>{
            if(res['data'].status=='1'){
                let d = res['data'].data;
                setDataList(d);
                setDataView(d);
            }
            else{
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }

    const studentField=(fieldName)=> ((props.dataSource && props.dataSource[fieldName]) && props.dataSource[fieldName]);

    const getList=(type)=>{
        let d = [];

        if(type=='paid') d = dataList.filter(item => item.bill_id && item.is_cancelled==0);
        if(type=='unpaid') d = dataList.filter(item => (!item.bill_id) && item.is_cancelled==0);
        if(type=='cancelled') d = dataList.filter(item => item.is_cancelled==1);

        return d;
    };

    const getTotal=(data)=>{
        let total = 0;
        data.map(item => (item.fee_amount && (total = parseFloat(total) + parseFloat(item.fee_amount))));
        return parseFloat(total).toFixed(2);
    }

    const getTotalByType=(type)=>{
        let d = getList(type);
        let total = 0;

        d.map(item => total = parseFloat(total) + parseFloat(item.fee_amount));
        return parseFloat(total).toFixed(2);
    }

   return (
        <>
        <Spin spinning={loader}>
            <Row className="mb-4" >
                <Col md={3}>
                    <InputGroup>
                        <InputGroup.Text>Paid : Rs.</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={getTotalByType('paid')}
                            className="text-end fw-bold"
                        />
                    </InputGroup>
                </Col>
                <Col md={3}>
                    <InputGroup>
                        <InputGroup.Text>Pending : Rs.</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={getTotalByType('unpaid')}
                            className="text-end fw-bold"
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Tabs type="card">

                <Tabs.TabPane tab="Paid List" key="paid" >
                    <PaidListCard
                        dataSource={props.dataSource}
                        feeDatas={getList('paid')}
                    />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Pending List" key="unpaid">
                    <PendingListCard
                        dataSource={props.dataSource}
                        feeDatas={getList('unpaid')}
                    />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Cancelled List" key="cancelled">
                    <CancelListCard
                        dataSource={props.dataSource}
                        feeDatas={getList('cancelled')}
                    />
                </Tabs.TabPane>

            </Tabs>

           
        </Spin>
        </>
    );
};

export default withRouter(FeeDetails);