import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';

import { Row, Col, Card, Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { capitalizeFirst, CardFixedTop, getAscSortOrder, groupByMultiple, momentDate, upperCase } from '../../../../utils';
import { Spin } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';

import { listEmployees, listHolidays } from '../../../../models/hr';
import ImportAttFromMachine from './importAttFromMachine';

const styles = {
    table:{
        borderCollapse: 'collapse',
        border: '1px solid #000',
        padding: '0px 5px',
    },
    holiday: {
        backgroundColor: '#ffe980',
        borderCollapse: 'collapse',
        border: '1px solid #000',
        padding: '0px 5px',
    },
    weekOff: {
        backgroundColor: '#ffcca3',
        borderCollapse: 'collapse',
        border: '1px solid #000',
        padding: '0px 5px',
    },
    absent: {
        backgroundColor: '#ff8d8d',
        borderCollapse: 'collapse',
        border: '1px solid #000',
        padding: '0px 5px',
    },
}


const AttendanceSheet = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [attData, setAttData] = useState([]);
    const [holidays, setHolidays] = useState([]);
        

    const [fromDate, setFromDate] = useState(momentDate(new Date(), 'YYYY-MM-DD'));
    const [toDate, setToDate] = useState(momentDate(new Date(), 'YYYY-MM-DD'));

    useEffect(()=>{
        loadHolidays();
    },[])

    const attDataSuccess=(d, attDt)=>{
        setLoader(true);
        let fd = momentDate(`${attDt}-01`, 'YYYY-MM-DD');
        setFromDate(fd);
                
        listEmployees().then(res => {
            if(res){
                let x = res;//.sort(getAscSortOrder('id'));
                setEmployees(x);
                setAttData(d);
            }
            setLoader(false);
        });
    }


    const loadHolidays=()=>{
        setLoader(true);
        listHolidays().then(res => {
            if(res){               
                setHolidays(res);
            }
            setLoader(false);
        });
        
    }

    const loadData=()=>{
        let dt = [];
        employees.map((item,i)=>{
            let timings = getAttTiming();
            timings.map((time, j)=>{
                let x = {
                    employee_code: item.emp_code,
                    employee_name: item.emp_name,
                    att_date: time.att_date,
                    in_time: time.in_time,
                    out_time: time.out_time,
                    holiday: time.holiday,
                };
                dt.push(x);
            });    
        });
        
    }

    const getAttTiming=(emp)=>{
        let totalDays = moment(fromDate,'YYYY-MM-DD').daysInMonth();
        let tr = [];
        for(let i=1;i<=totalDays;i++){
            let ym = momentDate(fromDate,'YYYY-MM');
            let dt = `${ym}-${i}`;
            let inTime = getAttTime('in', dt);
            let outTime = getAttTime('out', dt);
            let holiday = isHoliday(dt);
           tr.push({
                att_date: dt,
                in_time: inTime,
                out_time: outTime,
                holiday: holiday ? '1' : '0',
           });
        }
        return tr;
    }

    const trMonthDays=()=>{
        let totalDays = moment(fromDate,'YYYY-MM-DD').daysInMonth();
        let tr = [];
        for(let i=1;i<=totalDays;i++){
            let ym = momentDate(fromDate,'YYYY-MM');
            let dt = `${ym}-${i}`;
            tr.push(<th style={{minWidth: '90px'}} className='text-center'>
                {i} <br />
                {getDayName(dt)}
            </th>);
        }
        return tr;
    }
    
    const getDayName=(date)=> momentDate(date,'dddd');

    const resetAll=()=>{
        setEmployees([]);
        setAttData([]);
        setHolidays([]);
        setFromDate(null);
    }

    const getAttTime=(type, dt, emp)=>{
        
        //let x = attData.filter(item => item.UserId==2 && moment(momentDate('2022-09-02 02:02:58', 'YYYY-MM-DD')).isSame(dt,'day'));
        let x = attData.filter(item => item.UserId==emp.emp_device_tbl_id && moment(item.LogDate).isSame(dt,'day'));
        
        if(!x) return false;
        let t = x.filter(item => item.Direction==type);
        if(!t) t = x;
        if(t.length<1) return false;
        if(type=='in') return t[0];
        else return t[t.length-1];
    }


    const isHoliday=(dt)=>{
        let x = holidays.find(item => item.holiday_date==momentDate(dt,'YYYY-MM-DD'));
        return (x) ? true : false;
    }

    const isWeekOff=(dt, emp)=>{
        let m = getDayName(dt);
        return (upperCase(emp.emp_weekoff_day)==upperCase(m)) ? true : false;
    }

    const getEmpAttCol=(emp)=>{
        let totalDays = moment(fromDate,'YYYY-MM-DD').daysInMonth();
        let tr = [];
        let totalWorkingDays=0;
        let totalWeekOffDays=0;
        let totalLeaveDays=0;
        let totalPresentDays=0;
        let totalHoliyDays=0;

        for(let i=1;i<=totalDays;i++){
            let ym = momentDate(fromDate,'YYYY-MM');
            let i_i = ('0'+ i).slice(-2);
            let dt = `${ym}-${i_i}`;
            let isBefore =  moment(dt).isBefore(new Date());
            if(isHoliday(dt))
            {
                tr.push(<td align="center" style={styles.holiday}>H</td>)
                totalHoliyDays = parseInt(totalHoliyDays) + 1;
            }
            else if(!isBefore)
            {
                tr.push(<td align="center" ></td>)
            }
            else if(isWeekOff(dt, emp))
            {
                tr.push(<td align="center" style={styles.weekOff}>W.O</td>)
                totalWeekOffDays = parseInt(totalWeekOffDays) + 1;
            }
            else
            {
                let inTime = getAttTime('in',dt, emp);
                let outTime = getAttTime('out',dt, emp);
                let inTiming =false;
                let outTiming= false;

                if(inTime) inTiming = moment(inTime['LogDate']).format('hh:mm A');
                if(outTime) outTiming = moment(outTime['LogDate']).format('hh:mm A');

                if(!inTiming && !outTiming)// absent
                {
                    tr.push(<td align="center" style={styles.absent}>A</td>)
                    totalLeaveDays = parseInt(totalLeaveDays) + 1;
                }
                else
                {
                    tr.push(<td style={styles.table} >
                        In: {inTiming} <br />
                        Out: {outTiming} 
                    </td>)
                    totalPresentDays = parseInt(totalPresentDays) + 1;
                }
            }
        }
        tr.push(<td style={styles.table} >{parseInt(totalDays) - parseInt(totalHoliyDays)}</td>);
        tr.push(<td style={styles.table} >{totalWeekOffDays}</td>);
        tr.push(<td style={styles.table} >{totalLeaveDays}</td>);
        tr.push(<td style={styles.table} >{totalPresentDays}</td>);

        return tr;
    }

   return (
        <>

       <CardFixedTop title="Attendance Sheet" >
            <ul className="list-inline mb-0">
                <li className='list-inline-item' >
                    <Button variant="white" className='border-start ms-2' onClick={resetAll}>
                        <i className='fa fa-xmark fs-8 px-1'></i> Reset
                    </Button>
                </li>
            </ul>
       </CardFixedTop>

        <div className="container">


            <Spin spinning={loader} >
                
                {!employees || employees.length<1 && (<Row className="mt-2">
                    <Col md={4}>
                        <Card>
                            <Card.Header className='fw-bold fs-8'>Import from Machine</Card.Header>
                            <Card.Body>
                                <ImportAttFromMachine 
                                    onSuccess={attDataSuccess}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>)}

                {employees && employees.length>0 && (<Card className='mt-2'>
                    <Card.Body style={{overflowX: 'scroll'}} className='px-0 py-0'>
                        <div className=" table-sm table-responsive" style={{overflowX: 'scroll'}}>
                           
                            <table width="100%" align="center" style={styles.table} > 
                                <thead style={styles.table}>
                                    <tr style={styles.table} >  
                                        <th width="100" style={styles.table} >Emp.Code</th>
                                        <th style={{minWidth: '250px'}} >Emp.Name</th>
                                        {trMonthDays()}
                                        <th width="100" style={styles.table} >T.W.D</th>
                                        <th width="100" style={styles.table} >W.O</th>
                                        <th width="100" style={styles.table} >L/A</th>
                                        <th width="100" style={styles.table} >P.D</th>
                                    </tr>
                                </thead>
                                <tbody style={styles.table} >
                                    {employees.map((item,i)=>{
                                        return <tr key={i} style={styles.table} >
                                            <td style={styles.table} >{item.emp_code}</td>
                                            <td style={styles.table} >{item.emp_name}</td>
                                            {getEmpAttCol(item)}
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>                
                    </Card.Body>
                </Card>)}
            
            </Spin>
        </div>

      

        </>
    );
};

export default withRouter(AttendanceSheet);