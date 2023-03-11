import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';

import { Row, Col, Card, Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../context';
import { capitalizeFirst, CardFixedTop, groupByMultiple, momentDate, upperCase } from '../../../utils';
import { Spin } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../utils/serviceUrl';
import PsModalWindow from '../../../utils/PsModalWindow';
import { NoDataFound } from '../components';
import { DegreeType } from '../../../utils/data';
import LoaderSubmitButton from '../../../utils/LoaderSubmitButton';
import SelectRecords from '../feeAssigning/classWiseFeeAssigning/selectRecords';



const StudentBulkEdit = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataView, setDataView] = useState([]);
    const [degreeType, setDegreeType] = useState('');
    const [promotedStudents, setPromotedStudents] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState([]);

    const editFields = [
        {field_name: 'admissionno', text: 'Admission Number'},
        {field_name: 'registerno', text: 'Register Number'},
        {field_name: 'rollno', text: 'Roll Number', type: 'number'},
        {field_name: 'admissiondate', text: 'Admission Date', type: 'date'},
        {field_name: 'smartid', text: 'Id Card Number'},
        {field_name: 'aadharno', text: 'Aadhar Number'},
        {field_name: 'voteridno', text: 'Voter Id Number'},
        {field_name: 'plus2registerno', text: 'HSC Register Number'},
        {field_name: 'name', text: 'Student Name'},
        {field_name: 'initial', text: 'Student Initial'},
        {field_name: 'mobile', text: 'Student Phone No',  type: 'number'},
        {field_name: 'email', text: 'Email Id', type: 'email'},
        {field_name: 'gender', text: 'Gender'},
        {field_name: 'dob', text: 'DOB', type: 'date'},
        {field_name: 'fathername', text: 'Father Name'},
        {field_name: 'fatherphone', text: 'Father Phone Number', type: 'number'},
        {field_name: 'fatheroccupation', text: 'Father Occupation'},
        {field_name: 'mothername', text: 'Mother Name'},
        {field_name: 'motherphone', text: 'Mother Phone Number', type: 'number'},
        {field_name: 'motheroccupation', text: 'Mother Occupation'},
        {field_name: 'annualincome', text: 'Annual Income'},
        {field_name: 'hsc_ug_scored', text: 'HSC / UG Scored Mark'},
    ];

    const [selectedField, setSelectedField] = useState([]);
   
    const resetClick=()=>{

        if(promotedStudents.length>0)
            if(!window.confirm('Do you want to discard changes?')) return;

        setDataList([]);
        setDataView([]);
        setSelectedCourse([]);
        setDegreeType('');
        setPromotedStudents([]);
        setSelectedField([]);
    }

    
    const saveButotnClick=()=>{

        if(promotedStudents.length<1)
        {
            toast.error('There is no data for update');
            return;
        }
        if(!window.confirm('Do you want to save?')) return;
        setLoader(true);

        const form = new FormData();
        form.append('students', JSON.stringify(promotedStudents));
        axios.post(ServiceUrl.STUDENTS.UPDATE_BULK_FIELD, form).then(res=>{
            if(res['data'].status=='1'){
                toast.success(res['data'].message || 'Success');
                setPromotedStudents([]);
            }
            else{
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }

    const selectCourseSuccess=(co)=>{

        setSelectedCourse(co);
    }

    useEffect(()=>{

        if(selectedCourse && selectedCourse.course_id)
            getReport();

    },[selectedCourse]);

    const getReport=()=>{
        setLoader(true);
        setDataList([]);
        setDataView([]);
        
        const form = new FormData();
        form.append('batch', selectedCourse.academic_year);
        form.append('course', selectedCourse.course_id);
        
        axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, form).then(res=>{
            if(res['data'].status=='1'){
                setDataList(res['data'].data);
                setDataView(res['data'].data);
            }
            setLoader(false);
        });
    }

    const getTitle=()=>{
        if(selectedCourse && selectedCourse.course_id)
            return `Students Bulk Edit > ${selectedCourse.course_name} > ${selectedCourse.academic_year} > ${upperCase(selectedCourse.section)}`;
        return 'Students Bulk Edit';
    }

    const dropdownFieldChange=(e)=>{
        if(promotedStudents.length>0)
            if(!window.confirm('Do you want to discard changes?')) return;

        setPromotedStudents([]);
        setSelectedField([]);

        let f = editFields.find(item => item.field_name==e.target.value);
        if(f) setSelectedField(f);
        
    };

    const getEditedFieldValue=(fieldName, student)=>{
        let s = promotedStudents.find(item => item.uuid==student.uuid);
        if(!s) s = dataList.find(item => item.uuid==student.uuid);
        return s[fieldName] || '';
    }

    const editFieldChange=(student, e)=>{
        let ps = [...promotedStudents];
        let ds = [...dataList];
        let index = ps.findIndex(item => item.uuid==student.uuid);
        if(index>-1)
        {   
            ps[index][selectedField.field_name] = e.target.value;
        }
        else
        {
            let s = ds.find(item => item.uuid==student.uuid);
            let m = {
                uuid: student.uuid,
                field_name: selectedField.field_name,
            }
            m[selectedField.field_name] = e.target.value;
            ps.push(m);
        }
        setPromotedStudents(ps);
    }


   return (
        <>

       <CardFixedTop title={getTitle()} >
            <ul className="list-inline mb-0">
                <li className='list-inline-item' >
                    <Button variant="white" className='border-start ms-2' disabled={dataList.length<1} onClick={e => resetClick()} >
                        <i className='fa fa-xmark fs-5 px-1'></i> Reset
                    </Button>
                </li>
            </ul>
       </CardFixedTop>

        <div className="container">


            <Spin spinning={loader} >
                
                {dataList.length<1 && (<Row className="mt-2"><Col md={5}>
                    <SelectRecords
                        withSemester={false}
                        withSection={true}
                        onSuccess={selectCourseSuccess}
                    />
                </Col></Row>)}
           
                {dataList.length>0 && (<>
                <Row className="mt-2">
                    <Col md={6}>
                        <InputGroup size="sm">
                            <InputGroup.Text>Select a field to edit</InputGroup.Text>
                            <Form.Control
                                as="select"
                                className="fw-bold form-select"
                                onChange={e => dropdownFieldChange(e)}
                            >
                                <option value="">-Select-</option>
                                {editFields.map(item => <option value={item.field_name}>{item.text}</option>)}
                            </Form.Control>                                
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <div className="text-end">
                                <a href="javascript:;" className="pe-3 me-3 border-end" onClick={resetClick}>Cancel</a>
                               <LoaderSubmitButton 
                                    loading={loader}
                                    type="button"
                                    text="Update Changes"
                                    onClick={e => saveButotnClick()}
                               />   
                        </div>
                    </Col>
                </Row>
                <div className="tableFixHead ps-table mt-2" style={{maxHeight: 'calc(100vh - 180px)'}}>
                    <table>
                        <thead>
                            <tr>
                                <th width="60">S.No</th>
                                <th width="150">Reg.No</th>
                                <th>Student Name</th>
                                <th>Edit {selectedField.text}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataView.map((item ,i)=>{
                                return <tr key={i} >
                                    <td>{i+1}</td>
                                    <td>{item.registerno || item.admissionno}</td>
                                    <td>{upperCase(item.name)}</td>
                                    <td>
                                        {selectedField && selectedField.field_name && (<Form.Control
                                            type={selectedField.type || 'string'}
                                            size="sm"
                                            className="fw-bold"
                                            value={getEditedFieldValue(selectedField.field_name, item)}
                                            onChange={e => editFieldChange(item, e)}
                                        />)}
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                <Row className="mt-3">
                    <Col md={3} >
                        <InputGroup size="sm">
                            <InputGroup.Text>Total Students</InputGroup.Text>
                            <Form.Control
                                text="text"
                                className="fw-bold"
                                value={dataList.length}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={3} >
                        <InputGroup size="sm">
                            <InputGroup.Text>Edited Records</InputGroup.Text>
                            <Form.Control
                                text="text"
                                className="fw-bold"
                                value={promotedStudents.length}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <div className="text-end">
                                <a href="javascript:;" className="pe-3 me-3 border-end" onClick={resetClick}>Cancel</a>
                               <LoaderSubmitButton 
                                    loading={loader}
                                    type="button"
                                    text="Update Changes"
                                    onClick={e => saveButotnClick()}
                               />   
                        </div>
                    </Col>
                </Row>
                </>)}
           </Spin>

        </div>


        </>
    );
};

export default withRouter(StudentBulkEdit);