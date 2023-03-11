import React, { useState, useEffect, useContext, useCallback } from 'react';
import $, { map } from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card, Form, ButtonGroup, ToggleButton } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../../context';
import { Image, Spin, Tabs } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import { momentDate, semesterValue, upperCase } from '../../../../../utils';

const PaidListCard = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataView, setDataView] = useState([]);
    const [dataSource, setDataSource] = useState(props.dataSource);

    const [activeTab, setActiveTab] = useState('all');

    useEffect(()=>{
        setDataList(props.feeDatas);
        setDataView(props.feeDatas);
    },[props.feeDatas]);
   
    const studentField=(fieldName)=> ((dataSource && dataSource[fieldName]) && dataSource[fieldName]);

    const getList=(type)=>{
        let d = [];

            d = dataList.filter(item => item.bill_id && item.is_cancelled==0);
            if(activeTab!='all') d = d.filter(item => item.semester==activeTab);

        return d;
    };

    const getTotal=(data)=>{
        let total = 0;
        data.map(item => (item.fee_amount && (total = parseFloat(total) + parseFloat(item.fee_amount))));
        return parseFloat(total).toFixed(2);
    }

    const getSemsters=()=> {
        if(dataSource && dataSource.coursetype){
            if(upperCase(dataSource.coursetype)=='UG') return '6';
            else if(upperCase(dataSource.coursetype)=='PG') return '4';
            else if(upperCase(dataSource.coursetype)=='DIPLOMA') return '2';
        }
        return 0;
    }

    const getButtonTab=()=>{
        let rv = [];
        for(let i=1;i<=getSemsters();i++)
        {
            rv.push( <ToggleButton
                size="sm"
                variant={activeTab==i ? "secondary" : "outline-secondary"}
                onClick={e => setActiveTab(i)}
            >
                {semesterValue(i)}
            </ToggleButton>)
        }
        return rv;
    }

   return (
        <>
            <Card>
                <Card.Header className="fw-bold">Paid List
                    <div className="float-end">
                        <ButtonGroup>
                            <ToggleButton
                                size="sm"
                                variant={activeTab=='all' ? "secondary" : "outline-secondary"}
                                onClick={e => setActiveTab('all')}
                            >
                                All
                            </ToggleButton>
                            {getButtonTab()}
                        </ButtonGroup>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="tableFixHead" style={{minHeight: '300px'}}>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th width="120">Bill Date</th>
                                    <th width="100">Bill No</th>
                                    <th width="120">Account No</th>
                                    <th>Category</th>
                                    <th width="80">Semester</th>
                                    <th width="100" className='text-end'>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getList('paid').map((item, i)=>{
                                    return <tr key={i} >
                                        <td>{momentDate(item.bill_date,'DD/MM/YYYY')}</td>
                                        <td>{item.bill_no}</td>
                                        <td>{item.category_account_no}</td>
                                        <td>{item.category_name}</td>
                                        <td align="center">{item.semester}</td>
                                        <td align="right">{item.fee_amount}</td>
                                    </tr>
                                })}
                            </tbody>
                            <tfoot className="fw-bold">
                                <tr>
                                    <td colSpan={5} align="right">Total : </td>
                                    <td align="right">{getTotal(getList('paid'))}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Card.Body>
            </Card>
               
        </>
    );
};

export default withRouter(PaidListCard);