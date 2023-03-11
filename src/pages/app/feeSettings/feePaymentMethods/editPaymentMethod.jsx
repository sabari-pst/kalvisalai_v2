import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Button, ButtonGroup, Col, Form, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';

import { capitalizeFirst, CardFixedTop } from '../../../../utils';
import PsModalWindow from '../../../../utils/PsModalWindow';
import { Spin } from 'antd';
import LoaderSubmitButton from '../../../../utils/LoaderSubmitButton';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';

const EditPaymentMethod = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(false);
	const [validated, setValidated] = useState(false);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		if(form.checkValidity() === false){
			e.stopPropagation();
			setValidated(true);
			return;
		}
		setLoader(true);
		axios.post(ServiceUrl.FEE_CATEGORY.UPDATE_PAYMENT_METHOD, $("#frm_UpdatePaymentMethod").serialize()).then(res => {
			if(res['data'].status=='1'){
				toast.success(res['data'].message || 'Success');
				if(props.onSuccess) props.onSuccess();
			}
			else{
				toast.error(res['data'].message || 'Error');
			}
			setLoader(false);
		});
	}

	const field =(fieldName) => {
		if(props.dataSource && props.dataSource[fieldName])
		return props.dataSource[fieldName];
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
					id="frm_UpdatePaymentMethod"
					onSubmit={handleFormSubmit}
				>
					<input type="hidden" name="id" value={field('id')} />

					<Row>
						<Col md={12}>
							<label>Name of the Payment Method <span className="text-danger">*</span></label>
							<Form.Control
								type="text"
								size="sm"
								className="fw-bold"
								name="method_name"
								defaultValue={field('method_name')}
								required
							/>
						</Col>
					</Row>
					
					<Row className="mt-2">
						<Col md={12}>
							<label>Display Order <span className="text-danger"></span></label>
							<Form.Control
								type="number"
								size="sm"
								className="fw-bold"
								defaultValue="0"
								name="display_order"
								defaultValue={field('display_order')}
							/>
						</Col>
					</Row>
					
					<Row className="mt-2">
						<Col md={12}>
							<label>Status <span className="text-danger"></span></label>
							<Form.Control
								as="select"
								size="sm"
								className="fw-bold"
								name="status"
								defaultValue={field('active_status')}
							>
								<option value="1"> Active </option>
								<option value="0"> In-Active </option>
							</Form.Control>
						</Col>
					</Row>
				
					<Row className="mt-3">
						<Col md={12}>
							<div className='text-end'>
								<a className="border-end pe-2 me-3 fs-10" onClick={ e => props.onHide && props.onHide()}>
									<u>Cancel</u>
								</a>
								<LoaderSubmitButton
									loading={loader}
									text="Update Method"
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

export default EditPaymentMethod;