import React, { useState, useEffect, useContext } from 'react';
import $ from 'jquery';

import PsContext from '../../../context';
import { listCollegeYears } from '../../../models/academicYears';
import { Spin } from 'antd';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { formToObject } from '../../../utils';


const SelectCollegeYear = (props) => {

    const context = useContext(PsContext);

    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    const [collegeYears, setCollegeYears] = useState([]);

	useEffect(()=>{
		setLoader(true);
		listCollegeYears().then(res =>{
			if(res) setCollegeYears(res);
			setLoader(false);
		});
	},[]);

    const handleFormSubmit=(e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if(form.checkValidity() === false){
            e.stopPropagation();
            setValidated(true);
            return;
        }
        let v = formToObject(form);
        if(props.onSuccess) props.onSuccess(v);

    }

   return (
        <>

            <Card>
                <Card.Header className="fw-bold">Select College Year</Card.Header>
                <Card.Body>
                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleFormSubmit}
                    >

                    
                        <Spin spinning={loader}>
                            <Row>
                                <Col md={4}>
                                    <label>Year <span className="text-danger">*</span></label>
                                </Col>
                                <Col md={8}>
                                   <Form.Control
                                        as="select"
                                        name="college_year"
                                        size="sm"
                                        className="fw-bold"
                                        required
                                   >
                                        <option value="">-Select-</option>
                                        {collegeYears.map(item => <option value={item.college_year}>{item.college_year}</option>)}
                                   </Form.Control>
                                </Col>
                            </Row>
                            
                            {props.oddEvenSem && (<Row className="mt-3">
                                <Col md={4}>
                                    <label>Semester <span className="text-danger">*</span></label>
                                </Col>
                                <Col md={8}>
                                   <Form.Control
                                        as="select"
                                        name="semester_type"
                                        size="sm"
                                        className="fw-bold"
                                        required
                                   >
                                        <option value="">-Select-</option>
                                        <option value="odd">Odd Sem</option>
                                        <option value="even">Even Sem</option>
                                   </Form.Control>
                                </Col>
                            </Row>)}

                            <Row className="mt-3">
                                <Col md={12}>
                                    <div className="text-end">
                                        <Button type="submit" size="sm">
                                            Go Next
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                        </Spin>       

                    </Form>                 
                </Card.Body>
            </Card>
                    
        </>
    );
};

export default SelectCollegeYear;