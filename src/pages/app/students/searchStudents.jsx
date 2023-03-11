import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { ServiceUrl } from '../../../utils/serviceUrl';
import { Row, Col, Card, Modal, Button, Form, Alert, InputGroup, DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../context';
import { CardFixedTop, formToObject, momentDate, upperCase } from '../../../utils';
import { Spin } from 'antd';
import ViewStudent from './viewStudent';
import SearchStudent from '../feePayment/newFeePayment/searchStudent';


const SearchStudents = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [validated, setValidated] = useState(false);
    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataView, setDataView] = useState([]);

    const [student, setStudent] = useState([]);

    const searchFormSubmit=(e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if(form.checkValidity()===false){
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true);
        const data = formToObject(form);
        const f = new FormData();
        f.append(data.search_by, data.search_value);

        axios.post(ServiceUrl.STUDENTS.SEARCH_BY_REGISTER_NO, f).then(res=>{
            if(res['data'].status=='1'){
                if(res['data'].data.length<2) setStudent(res['data'].data[0]);
                setDataList(res['data'].data);

            }
            else{
                toast.error('There is no matching records..');
            }
            setLoader(false);
        });
    }

    const resetClick=()=>{
        setStudent([]);
        setDataList([]);
        setDataView([]);
    }

    const viewBtnClick=(item)=> {
        setStudent(item);
    }

   return (
        <>

       <CardFixedTop title="Search Student" >
            <ul className="list-inline mb-0">
                <li className='list-inline-item' >
                    <Button variant="white" className='border-start ms-2' onClick={e => resetClick()}>
                        <i className='fa fa-xmark fs-5 px-1'></i> Reset
                    </Button>
                </li>
            </ul>
       </CardFixedTop>

        <div className="container">

             {student && !student.uuid && (<div className="mt-3"><SearchStudent 
                onSuccess={(d) => setStudent(d)}
             /></div>)}

            <Spin spinning={loader} >
                {/*{dataList.length<1 && (<Card className="mt-3">
                    <Card.Header className="fw-bold">Student Search</Card.Header>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={searchFormSubmit} >
                        <Row>
                            <Col md={3}>
                                <Form.Control
                                    as="select"
                                    name="search_by"
                                    required
                                    className="fw-bold form-select"
                                >
                                    <option value="smartid">Smart Id (ID card)</option>
                                    <option value="registerno">Admission Number</option>
                                    <option value="registerno">Register Number</option>
                                    <option value="mobile">Mobile</option>
                                </Form.Control>
                            </Col>
                            <Col md={7}>
                                <Form.Control
                                    type="text"
                                    name="search_value"
                                    className="fw-bold"
                                    placeholder="Search Value ...."
                                    required
                                />
                            </Col>
                            <Col md={2}>
                                <Button type="submit" className="btn btn-block">
                                    Search
                                </Button>
                            </Col>
                        </Row>
                        </Form>
                    </Card.Body>
                </Card>)}

                {dataList.length>1 && !student.uuid && (<>
                    <Card className="mt-3">
                        <Card.Header className="fw-bold">Search Result</Card.Header>
                        <Card.Body>
                            <div className='tableFixHead ps-table'>
                            <table className="">
                                <tbody>
                                    {dataList.map((item,i)=>{
                                        return <tr key={i} >
                                            <td>{item.registerno || item.admissionno}</td>
                                            <td>{upperCase(item.name)}</td>
                                            <td>{item.degree_name} {item.course_name} ({upperCase(item.course_type)=='SELF' ? 'SF' : 'R'})</td>
                                            <td>{momentDate(item.dob,'DD/MM/YYYY')}</td>
                                            <td>{item.mobile}</td>
                                            <td width="100" align="center">
                                                <Button size="xs" onClick={e => viewBtnClick(item)}>
                                                    <i className="fa-solid fa-arrow-up-right-from-square me-2"></i> View
                                                </Button>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                            </div>
                        </Card.Body>
                    </Card>
                </>)}
                */}
                {student && student.uuid && (<ViewStudent uuid={student.uuid} />)}

           </Spin>

        </div>


      
        </>
    );
};

export default withRouter(SearchStudents);