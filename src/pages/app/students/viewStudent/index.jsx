import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { Image, Spin, Tabs } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import { calculateAge, capitalizeFirst, momentDate, semesterValue, upperCase, yearBySem } from '../../../../utils';
import { SELECT_USER_PHOTO } from '../../../../utils/data';
import Personal from './personal';
import TransportDetails from './transportDetails';
import FeeDetails from './feeDetails';
import PromotionDetails from './promotionDetails';

const ViewStudent = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataView, setDataView] = useState([]);

    const [activeTab, setActiveTab] = useState('personal');

    useEffect(()=>{
        loadData();
    },[]);

    const loadData=()=>{
        setLoader(true);
        setDataList([]);
        setDataView([]);
        const form = new FormData();
        form.append('uuid', props.uuid);

        axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then(res=>{
            if(res['data'].status=='1'){
                let d = res['data'].data;
                setDataList(d[0]);
                setDataView(d[0]);
            }
            else{
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }

    const handleTabChange=(key)=>{
        setActiveTab(key);
    }

    const field=(fieldName)=>{
        if(dataList && dataList[fieldName]) return dataList[fieldName];
    }
   return (
        <>
        <Spin spinning={loader} >
            <div style={{minHeight: '400px'}}>

                <Tabs onChange={handleTabChange} >
                    <Tabs.TabPane tab="Personal & Family Details" key="personal" />
                   {field('transport_destination_id') && (<Tabs.TabPane tab="Transport Details" key="transport" />)}
                    <Tabs.TabPane tab="Fee & Accounts" key="fees" />
                    <Tabs.TabPane tab="Promotion Details" key="promotion" />
                </Tabs>

                {!loader && (<>

                    {activeTab=='personal' && <Personal dataSource={dataList} />}
                    {activeTab=='transport' && <TransportDetails dataSource={dataList} />}
                    {activeTab=='fees' && <FeeDetails dataSource={dataList} />}
                    {activeTab=='promotion' && <PromotionDetails dataSource={dataList} />}

                </>)}

            </div>
        </Spin>

        </>
    );
};

export default withRouter(ViewStudent);