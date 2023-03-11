import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Button, ButtonGroup, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';

import { capitalizeFirst, CardFixedTop } from '../../../../utils';
import PsModalWindow from '../../../../utils/PsModalWindow';
import { Spin } from 'antd';
import LoaderSubmitButton from '../../../../utils/LoaderSubmitButton';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import { listFeeCategoy } from '../../../../models/fees';

const NewFeeTenmplate = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(false);
	const [validated, setValidated] = useState(false);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState('');


	useEffect(()=>{
		loadData();
	}, []);

	const loadData=()=>{
		setLoader(true);
		listFeeCategoy('1').then(res => {
			if(res){
				setCategories(res);
				setSelectedCategory(res);
			}
			setLoader(false);
		});
	}

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		if(form.checkValidity() === false){
			e.stopPropagation();
			setValidated(true);
			return;
		}
		setLoader(true);
		axios.post(ServiceUrl.FEES.SAVE_TEMPLATE, $("#frm_savePaymentTemplate").serialize()).then(res => {
			if(res['data'].status=='1'){
				toast.success(res['data'].message || 'Success');
				document.getElementById("frm_savePaymentTemplate").reset();
				if(props.onSuccess) props.onSuccess();
			}
			else{
				toast.error(res['data'].message || 'Error');
			}
			setLoader(false);
		});
	}

	const handleDelete=(item, index)=>{
		let c = [...selectedCategory];
		c.splice(index, 1);
		setSelectedCategory(c);
	}

	const handleValuecChange=(item, e)=>{
		let c = [...selectedCategory];
		let index = c.findIndex(obj => obj.id==item.id);
		if(index<0) return;
		c[index]['category_amount'] = e.target.value;
		setSelectedCategory(c);
	}

	const getTotal=()=>{
		let total = 0;
		selectedCategory.map(item => total = parseFloat(total) + parseFloat(item.category_amount));
		return parseFloat(total).toFixed(2);
	}

	const handleAddClick=()=>{
		let e = selectedCategoryId;
		let cat = categories.find(item => item.id==e);
		if(!cat) return;
		let index = selectedCategory.findIndex(item => item.id==e);
		if(index>-1){
			toast.error('Category already exist in template');
			return;
		}
		let sc = [...selectedCategory];
		sc.push(cat);
		setSelectedCategory(sc);
		setSelectedCategoryId('');
	}

	return(
		<>
			<PsModalWindow {...props} >
				<Spin spinning={loader} >
				<Form
					noValidate
					validated={validated}
					action=""
					method="post"
					id="frm_savePaymentTemplate"
					onSubmit={handleFormSubmit}
				>
					<input type="hidden" name="categories" value={JSON.stringify(selectedCategory)} />

					<Row>
						<Col md={3}>
							<label>Template Name <span className="text-danger">*</span></label>
						</Col>
						<Col md={9}>
							<Form.Control
								type="text"
								size="sm"
								className="fw-bold"
								name="template_name"
								required
							/>
						</Col>
					</Row>
					<Row className="mt-2">
						<Col md={3}></Col>
						<Col md={5}>
							<Form.Check
								type="checkbox"
								name="for_new_admission"
								value="1"
								label="Auto assign for new Admission"
							/>
						</Col>
						<Col md={4}>
							<Form.Check
								type="checkbox"
								name="for_new_student_promotion"
								value="1"
								label="Auto assign for new Promotion"
							/>
						</Col>
					</Row>
					<Row className="mt-2">
						<Col md={3}>
							<label>Select a Category to Add</label>	
						</Col>	
						<Col md={9}>
							<InputGroup size="sm">
								<Form.Control
									as="select"
									size="sm"
									className="fw-bold"
									value={selectedCategoryId}
									onChange={e => setSelectedCategoryId(e.target.value)}
								>
									<option value="">-Select-</option>
									{categories.map(item => <option value={item.id}>{item.category_name}</option> )}
								</Form.Control>
								<InputGroup.Text className="py-0 px-0">
									<Button type="button" size="sm" variant="secondary" onClick={handleAddClick}>
										ADD
									</Button>
								</InputGroup.Text>
							</InputGroup>
						</Col>
					</Row>				
					<Row className="mt-3">
						<Col md={12}>
							<div className="tableFixHead bg-white"	style={{maxHeight: 'calc(100vh - 230px)'}} >
								<table>
									<thead>
										<tr>
											<th>S.No</th>
											<th>Category Name</th>
											<th width="150" className="text-end">Amount</th>
											<th width="80" className="text-center">#</th>
										</tr>
									</thead>
									<tbody>
										{selectedCategory.map((item,i)=>{
											return <tr key={i} >
												<td>{i+1}</td>
												<td>{item.category_name}</td>
												<td>
													<Form.Control
														type="number"
														size="sm"
														className="fw-bold text-end"
														value={item.category_amount}
														onChange={e => handleValuecChange(item, e)}
													/>
												</td>
												<td align="center">
													<Button size="sm" type="button" variant="transparent" onClick={e => handleDelete(item,i)}> 
														<i className="fa-solid fa-trash-can"></i>
													</Button>
												</td>
											</tr>
										})}
									</tbody>
								</table>
							</div>
						</Col>	
					</Row>

					<Row className="mt-3">
						<Col md={4}>
							<InputGroup size="sm" >
								<InputGroup.Text>Total Amount</InputGroup.Text>
								<Form.Control
									size="sm"
									className="fw-bold"
									name="fee_template_amount"
									value={getTotal()}
								/>
							</InputGroup>
						</Col>
						<Col md={8}>
							<div className='text-end'>
								<a className="border-end pe-2 me-3 fs-10" onClick={ e => props.onHide && props.onHide()}>
									<u>Cancel</u>
								</a>
								<LoaderSubmitButton
									loading={loader}
									text="Save Template"
								/>
							</div>
						</Col>
					</Row>

				</Form>
				</Spin>
			</PsModalWindow>	
		</>
	);

};

export default NewFeeTenmplate;