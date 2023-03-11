import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Button, ButtonGroup, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';

import { Spin } from 'antd';
import LoaderSubmitButton from '../../../../utils/LoaderSubmitButton';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import { listFeeCategoy } from '../../../../models/fees';

const FeeCategoryInGroup = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(false);
	const [validated, setValidated] = useState(false);
	const [categories, setCategories] = useState([]);

	const [selectedCategoryId, setSelectedCategoryId] = useState([]);

	useEffect(()=>{
		setLoader(true);
		listFeeCategoy('1').then(res=>{
			if(res) setCategories(res);
			setLoader(false);
		});
	},[]);

	useEffect(()=>{
		let c = props.dataSource.fee_category_id_list;
		if(c && c.length>0) setSelectedCategoryId(c.split(','));
	},[]);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		if(form.checkValidity() === false){
			e.stopPropagation();
			setValidated(true);
			return;
		}
		setLoader(true);
		axios.post(ServiceUrl.FEE_CATEGORY.SAVE_FEE_GROUP, $("#frm_saveFeeGroup").serialize()).then(res => {
			if(res['data'].status=='1'){
				toast.success(res['data'].message || 'Success');
				document.getElementById("frm_saveFeeGroup").reset();
				if(props.onSuccess) props.onSuccess();
			}
			else{
				toast.error(res['data'].message || 'Error');
			}
			setLoader(false);
		});
	}

	const handleRadioCheck=(id)=>{
		let c = [...selectedCategoryId];
		let index = c.find(item => item==id);
		if(index>-1){
			c = c.filter(item => item!==id);
		}
		else{
			c.push(id);
		}
		setSelectedCategoryId(c);
	}

	const idExist=(id)=>{
		let index = selectedCategoryId.find(item => item==id);
		return (index>-1) ? true : false;
	};

	const handleUpdateClick=(e)=>{
		if(!window.confirm('Do you want to update?')) return;
		setLoader(true);
		const form = new FormData();
		form.append('fee_category_id_list', JSON.stringify(selectedCategoryId));
		form.append('id',  props.dataSource.id);
		axios.post(ServiceUrl.FEE_CATEGORY.UPDATE_FEE_GROUP_CATEGORY_LIST, form).then(res=>{
			if(res['data'].status=='1'){
				toast.success(res['data'].message || 'Success');
				if(props.onSuccess) props.onSuccess();
			}
			else{
				toast.error(res['data'].message || 'Error');
			}
			setLoader(false);
		});
	};

	return(
		<>
			<Spin spinning={loader}>
				<Row>
					{categories.map((item,i)=>{
						return <Col md={4}>
							<Card className="mb-1">
								<Card.Body className={`py-2 ${idExist(item.id) ? 'bg-grey-50' : ''}`} onClick={e => handleRadioCheck(item.id)}>
									<span className="float-start">
										<Form.Check
											type="radio"
											className="me-2"
											checked={idExist(item.id)}
										/>
									</span>
									{item.category_name}
								</Card.Body>
							</Card>
						</Col>
					})}
				</Row>
				<Row>
					<Col md={12}>
						<div className="text-center border-top mt-3 py-3" > 
							<Button size="sm" onClick={handleUpdateClick} >
								Update
							</Button>
						</div>
					</Col>
				</Row>
			</Spin>
		</>
	);

};

export default FeeCategoryInGroup;