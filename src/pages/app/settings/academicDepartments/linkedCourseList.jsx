import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';

import { Row, Col, Card, Modal, Button, Form, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { capitalizeFirst, CardFixedTop, upperCase } from '../../../../utils';
import { Spin } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import { liststDepartments } from '../../../../models/hr';
import ModuleAccess from '../../../../context/moduleAccess';

const LinkedCourseList = (props) => {

    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    const [courseList, setCourseList] = useState([]);

    useEffect(()=>{
        setLoader(true);
        const form = new FormData();
        form.append('academic_department', props.dataSource.id);

        axios.post(ServiceUrl.ACADEMIC.LIST_COURSES_V2, form).then(res=>{
            if(res['data'].status=='1'){
                setCourseList(res['data'].data);
            }   
            setLoader(false);
        });
        
    },[]);
  

    const field = (fieldName) => {
        if (props.dataSource && props.dataSource[fieldName])
            return props.dataSource[fieldName];
    }

    const handleDeleteClick = (item) => {
        if (!window.confirm('Do you want to delete?')) {
            return;
        }
        setLoader(true);
        const form = new FormData();
        form.append('id', item.id);
        axios.post(ServiceUrl.ACADEMIC.REMOVE_COURSE_FROM_DEPT, form).then(res => {
            if (res['data'].status == '1') {
                let m = courseList.filter(obj => obj.id != item.id);
                setCourseList(m);
            
                toast.success(res['data'].message || 'Success');
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }

    return (
        <>
            <Spin spinning={loader} >

               <table className="table table-sm">                   
                    <tbody>
                         <tr className="bg-blue-100">
                            <td width="80">id</td>
                            <td width="80">#</td>
                            <td>Course Name</td>
                            <td width="95">Type</td>
                            <td width="60" align="center">#</td>
                        </tr>
                        {courseList.map((item, i) => {
                            return <tr key={i}>
                                <td>{item.id}</td>
                                <td>{upperCase(item.academic_dept_type)}</td>
                                <td>{item.degreename}-{item.name} </td>
                                <td>{upperCase(item.coursetype)}</td>
                                <td align="center">
                                    <ModuleAccess module="academics_course_management" action="action_delete">
                                        <Button size="sm" variant="transparent" title="Remove Group" onClick={e => handleDeleteClick(item)}>
                                            <i className='fa-solid fa-xmark '></i>
                                    </Button>
                                    </ModuleAccess>
                                </td>
                            </tr>
                        })}
                    </tbody>
               </table>

            </Spin>
        </>
    );
};

export default withRouter(LinkedCourseList);
