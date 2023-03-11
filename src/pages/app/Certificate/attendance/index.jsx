import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Badge, Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import PsContext from '../../../../context';
import { capitalizeFirst, CardFixedTop, upperCase } from '../../../../utils';
import { listPaymentMethods } from '../../../../models/fees';
import axios from 'axios';
import { formatCountdown } from 'antd/lib/statistic/utils';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import SelectRecords from '../../feeAssigning/classWiseFeeAssigning/selectRecords';
import { Input, Spin } from 'antd';
import Table from 'react-bootstrap/Table';
import LoaderSubmitButton from '../../../../utils/LoaderSubmitButton';
const styles = {
	tableCollapse: {
		borderCollapse: 'collapse',
	},
	borderBottom: {
		borderCollapse: 'collapse',
		borderBottom: '1px solid black',
	},
	borderExceptLeft: {
		borderCollapse: 'collapse',
		borderBottom: '1px solid black',
		borderTop: '1px solid black',
		borderRight: '1px solid black',
		padding: '3px',
	},
	borderExceptRight: {
		borderCollapse: 'collapse',
		borderBottom: '1px solid black',
		borderTop: '1px solid black',
		borderLeft: '1px solid black',
		padding: '3px',
	},
	borderAll: {
		borderCollapse: 'collapse',
		border: '1px solid black',
		padding: '3px',
	},
	borderTopBottom: {
		borderCollapse: 'collapse',
		borderTop: '1px solid black',
		borderBottom: '1px solid black',
		padding: '3px',
	},
}
const Attendance = (props) => {
	const context = useContext(PsContext);
	const [loader, setLoader] = useState(false);
	const [validated, setValidated] = useState(false);
		
	const [dataList, setDataList] = useState([]);
	const [dataView, setDataView] = useState([]);

	const [selectedCourse, setSelectedCourse] = useState([]);
	const [categories, setCategories] = useState([]);
	const [students, setStudents] = useState([]);
	useEffect(()=>{
		if(selectedCourse && selectedCourse.course_id)
			loadCategories();
	},[selectedCourse]);
	const loadCategories=()=>{
		setLoader(true);
		const form = new FormData();
		form.append('type','student');
		for(var key in selectedCourse)
			form.append(key, selectedCourse[key]);
		axios.post(ServiceUrl.FEE_CATEGORY.CATEGORY_LIST_WITH_STUDENT_COUNT, form).then(res=>{
			if(res['data'].status=='1'){
				setCategories(res['data'].data);
				setStudents(res['data'].count);
			}
			else{
				toast.error(res['data'].message || 'Error');
			}
			setLoader(false);
		});
	}
	const handleDelete=(item)=>{
		if(!window.confirm('Do you want to remove category from list?')){
			return;
		}
		let cat = [...dataList];
		let stu = [...students];
		let index = cat.findIndex(obj => obj.student_uuid==item.uuid);
		if(index>-1){
			cat.splice(index, 1);
			setDataList(cat);
		}
		let sindex = students.findIndex(obj => obj.uuid==item.uuid);
		if(sindex>-1){
			stu.splice(sindex, 1);
			setStudents(stu);
		}
	}
	const handleAmountChange=(student, category, e)=>{
		let cat = [...dataList];
		let index = cat.findIndex(obj => obj.category_id==category.id && obj.student_uuid==student.uuid);
		if(index>-1) {
			cat[index]['category_amount'] = e.target.value;
			setDataList(cat);
			return;
		}
		let m = {
			student_uuid: student.uuid,
			category_id: category.id,
			category_amount: e.target.value,
		};
		cat.push(m);
		setDataList(cat);
	}
	const getAmount=(student, category)=>{
		let cat = dataList.find(obj => obj.category_id==category.id && obj.student_uuid==student.uuid);
		return (cat && cat.category_amount) || '';
	}
	const categoryInput=(student, category)=>{
		return <Form.Control
			type="number"
			size="sm"
			className="fw-bold text-end"
			value={getAmount(student, category)}
			onChange={e => handleAmountChange(student, category, e)}
		/>
	}
	const getTotal=(student)=>{
		let total=0;
		let m = dataList.filter(item => item.student_uuid==student.uuid);
		m.map(item => total = parseFloat(total) + parseFloat(item.category_amount));
		return parseFloat(total).toFixed(2);
	}
	const getAssingnedTotal=()=>{
		let total=0;
		dataList.map(item => total = parseFloat(total) + parseFloat(item.category_amount));
		return parseFloat(total).toFixed(2);
	}
	const handleFormSubmit=(e)=>{
		e.preventDefault();
		const form = e.currentTarget;
		if(form.checkValidity() === false){
			e.stopPropagation();
			setValidated(true);
			return;
		}
		if(getAssingnedTotal()<1){
			toast.error('Pleas enter correct amount to save');
			return;
		}
		if(!window.confirm('Do you want to save?')){
			return;
		}
		setLoader(true);
		axios.post(ServiceUrl.FEE_CATEGORY.SAVE_STUDENT_WISE_FEE, $("#frm_SaveStudentWiseFeeAssing").serialize()).then(res=>{
			if(res['data'].status=='1'){
				toast.success(res['data'].message || 'Success');
				setSelectedCourse([]);
				setDataList([]);
				setLoader(false);
			}
			else{
				toast.error(res['data'].message || 'Error');
			}
			setLoader(false);
		});
	}
	const resetAll=()=>{
		setSelectedCourse([]);
		setDataList([]);
		setLoader(false);
	}
	const getTitle=()=>{

		if(selectedCourse){
			return `ATTENDANCE CERTIFICATE for : ${selectedCourse.course_name} - ${selectedCourse.academic_year} - SEM : ${selectedCourse.semester}`;
		}
		return 'ATTENDANCE CERTIFICATE';
	}
	return(
		<>
			<CardFixedTop title={getTitle()} >
				<ul className="list-inline mb-0">
					<li className='list-inline-item' >
						<Button variant="white" className='border-start ms-2' onClick={e => resetAll()} disabled={selectedCourse && selectedCourse.length < 1}>
							<i className='fa-solid fa-xmark fs-5 px-1'></i> Reset
						</Button>
					</li>
				</ul>
			</CardFixedTop>
			<div className="container mt-3">
				<Spin spinning={loader}>
				{selectedCourse && selectedCourse.length<1 && (<Row>
					<Col md={5}>
						<SelectRecords
							onSuccess={(dt, e) => setSelectedCourse(dt)}
						/>
					</Col>
				</Row>)}
				{selectedCourse && selectedCourse.course_id && (<Card>
					<Card.Body>
					<Form
						noValidate
						validated={validated}
						action=""
						method="post"
						id="frm_SaveStudentWiseFeeAssing"
						onSubmit={handleFormSubmit}
					>
						<input type="hidden" name="categories" value={JSON.stringify(dataList)} />
						<input type="hidden" name="course_id" value={selectedCourse.course_id} />
                        <br></br>
						<table width="100%" align="center" style={styles.tableCollapse}>
						<thead>
							<tr  style={styles.borderBottom} >
								<th colSpan={3} className="text-center" height="20"  style={styles.borderBottom} >
										<h4>{context.settingValue('billheader_name')}</h4>
										{context.settingValue('billheader_addresslineone') && <>{context.settingValue('billheader_addresslineone')} <br /></>} 
										{context.settingValue('billheader_addresslinetwo') && <>{context.settingValue('billheader_addresslinetwo')} <br /></>} 
								</th>
							</tr>
						</thead>
                            <br></br>
                            <Row md={30}>
                             <tr className="text-center"><b style={{fontSize:'160%'}}>ATTENDANCE CERTIFICATE</b></tr>
                             <br></br>
                             <tr>
                                <td  width="400" height="40" align="center"> </td> This is to certify that Selvi. ATHI LAKSHMI .V D/O Mr. S. VEERAPUTHIRAN is a student of our college. 
								She is studying<b> {selectedCourse.course_name}</b>degree class during the year <b>{selectedCourse.academic_year}</b>.
									</tr>
                            </Row>
                            <br></br>
                            <Table striped bordered hover size="sm" style={{marginLeft:'40%',width:'200px'}}>
                                   <tr>
                                    <td><b>Semester</b></td>
                                    <td><b>% of Attendance</b></td>
                                   </tr>
                                   <tr>
                                    <td className="text-center">{selectedCourse.semester}</td>
                                    <td  className="text-center">100</td>
                                   </tr>
                                   <tr>
                                    <td  className="text-center">{selectedCourse.semester}</td>
                                    <td  className="text-center">100</td>
                                   </tr>
                              </Table>
                            <br></br>
                                    <Row md={40}>
									<td >Date: </td>
                                    </Row>
                                    <Row md={40} style={{marginLeft:'80%'}}>
									<td >Principal: </td>
								</Row>
                        </table>
					</Form>
					</Card.Body>
				</Card>)}
				</Spin>
			</div>
		</>
	);
};
export default Attendance;