import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';

import PsContext from '../../../../context';
import { Badge, ButtonGroup, Card, ToggleButton } from 'react-bootstrap';
import { Spin } from 'antd';
import { NoDataFound } from '../../components';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import { calculateAge, upperCase, yearBySem } from '../../../../utils';

const StaffBirthDayList = (props) => {

    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataView, setDataView] = useState([]);

    const [type, setType] = useState('today');

    useEffect(()=>{
        loadData();
    },[type]);

    const loadData=()=>{
        setLoader(true);
        setDataList([]);
        setDataView([]);

        const form = new FormData();
        form.append('type', type);
        
        axios.post(ServiceUrl.DASHBOARD.STAFFS_BIRTHDAY_LIST, form).then(res=>{
            if(res['data'].status=='1'){
                setDataList(res['data'].data);
                setDataView(res['data'].data);
            }
            setLoader(false);
        });
    }
    

    return (
        <>

            <Card>
                <Card.Header className="fw-bold">Staffs Birthday List  <Badge>{dataList.length}</Badge>
                <div className='float-end'>
                    <ButtonGroup>
                        <ToggleButton
                            size="sm"
                            variant={type=='today' ? "secondary" : "outline-secondary"}
                            onClick={e => setType('today')}
                        >
                            Today
                        </ToggleButton>
                        <ToggleButton
                            size="sm"
                            variant={type=='week' ? "secondary" : "outline-secondary"}
                            onClick={e => setType('week')}
                        >
                            This Week
                        </ToggleButton>
                        <ToggleButton
                            size="sm"
                            variant={type=='month' ? "secondary" : "outline-secondary"}
                            onClick={e => setType('month')}
                        >
                            This Month
                        </ToggleButton>
                    </ButtonGroup>
                </div>
                </Card.Header>
                <Card.Body>

                    <Spin spinning={loader}>

                        <div className="tableFixHead" style={{height: '220px'}}>
                            <table className='table-sm'>
                                <thead>
                                    <tr>
                                        <th width="35">S.No</th>
                                        <th>Student Name</th>
                                        <th width="100">Mobile</th>
                                        <th width="65">Age / Sex</th>
                                        <th>Department</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataView.map((item, i)=>{
                                        return <tr key={i}>
                                            <td>{i+1}</td>
                                            <td>{upperCase(item.emp_name)}</td>
                                            <td>{item.emp_personal_mobile}</td>
                                            <td>{calculateAge(item.emp_dob)} /  {upperCase(item.emp_gender)=='MALE' ? 'M' : 'F'}</td>
                                            <td>{item.academic_department_name}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                            {!loader && dataList.length<1 && (<center>
                                <NoDataFound />
                            </center>)}
                        </div>
                    </Spin> 

                </Card.Body>
            </Card>             

        </>
    );
};

export default withRouter(StaffBirthDayList);
