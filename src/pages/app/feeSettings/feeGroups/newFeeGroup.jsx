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

const NewFeeGroup = (props) => {

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

	return(
		<>
			<PsModalWindow {...props} >
				<Spin spinning={loader} >
				<Form
					noValidate
					validated={validated}
					action=""
					method="post"
					id="frm_saveFeeGroup"
					onSubmit={handleFormSubmit}
				>
					<Row>
						<Col md={12}>
							<label>Fee Group Name <span className="text-danger">*</span></label>
							<Form.Control
								type="text"
								size="sm"
								className="fw-bold"
								name="fee_group_name"
								required
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
							>
								<option value="1"> Active </option>
								<option value="0"> In-Active </option>
							</Form.Control>
						</Col>
					</Row>

					<Row className="mt-2">
						<Col md={12}>
							<label>Display Order <span className="text-danger"></span></label>
							<Form.Control
								type="number"
								size="sm"
								className="fw-bold"
								name="display_order"
							/>
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
									text="Save Method"
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

export default NewFeeGroup;