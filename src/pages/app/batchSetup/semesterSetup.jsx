import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';

import PsContext from '../../../context';
import { Spin } from 'antd';
import { semesterValue } from '../../../utils';
import { Col, Form, Row } from 'react-bootstrap';
import LoaderSubmitButton from '../../../utils/LoaderSubmitButton';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ServiceUrl } from '../../../utils/serviceUrl';
import ModuleAccess from '../../../context/moduleAccess';

const SemesterSetup = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);

    const [dataList, setDataList] = useState([]);

    useEffect(()=>{

        loadData();

    },[]);

    const field=(fieldName)=>{
        if(props.dataSource && props.dataSource[fieldName]) return props.dataSource[fieldName];
    }

    const loadData=()=>{
        setLoader(true);        
        let d = [...dataList];
        axios.get(ServiceUrl.SETTINGS.SEMESTER_DATES+'?batch='+field('batch')).then(res=>{
            if(res['data'].status=='1')
            {
                setDataList(res['data'].data);
            }
            else
            {
                if(d.length<1)
                {
                    let semesters = field('no_of_semesters');
                    if(!semesters) semesters=0;
        
                    for(let i=1;i<=parseInt(semesters);i++)
                    {
                        d.push({
                            batch_uid: field('id'),
                            batch: field('batch'),
                            semester: i,
                            start_date: '',
                            end_date: '',
                        }); 
                    }
                    setDataList(d);
                }
            }
            setLoader(false);
        });
    }

    const handleDateChange=(item, e)=>{
        let dl = [...dataList];
        let index = dl.findIndex(obj => obj.semester === item.semester);
        dl[index][e.target.name] = e.target.value;
        setDataList(dl);
    }

    const handleFormSubmit=(e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if(dataList.length<1){
            toast.error('There is no data to update');
            return;
        }
        if(!window.confirm('Do you want to update?')) return;

        setLoader(true);
        axios.post(ServiceUrl.SETTINGS.UPDATE_SEMESTER_DATES, new FormData(form)).then(res=>{
            if(res['data'].status=='1'){
                toast.success(res['data'].message || 'Success');

                if(props.onSuccess) props.onSuccess(res['data'].data);
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
                <table className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th>Semester</th>
                            <th width="200" >Start Date</th>
                            <th width="200" >End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.map((item,i)=>{
                            return <tr key={i} >
                                <td>{semesterValue(item.semester)}</td>
                                <td>
                                    <Form.Control
                                        type="date"
                                        size="sm"
                                        name="start_date"
                                        className="fw-bold"
                                        value={item.start_date}
                                        onChange={e => handleDateChange(item, e)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="date"
                                        size="sm"
                                        name="end_date"
                                        className="fw-bold"
                                        value={item.end_date}
                                        onChange={e => handleDateChange(item, e)}
                                    />
                                </td>
                            </tr>;
                        })}
                    </tbody>
                </table>
                <Form id="frm_updateSemVDates" onSubmit={handleFormSubmit}>
                    
                    <input type="hidden" name="semesters" value={JSON.stringify(dataList)} />
                    <input type="hidden" name="batch_id" value={field('id')} />
                    
                    <ModuleAccess module="settings_batch_semester" action="action_update">
                        <Row className="mb-3">
                            <Col md={12}>
                                <div className='text-end'>
                                    <LoaderSubmitButton
                                        text="Update"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </ModuleAccess>
                </Form>

           </Spin>
        </>
    );
};

export default withRouter(SemesterSetup);