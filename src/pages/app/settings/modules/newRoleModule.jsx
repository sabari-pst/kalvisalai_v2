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

const NewRoleModule = (props) => {

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
		
		axios.post(ServiceUrl.SETTINGS.SAVE_ROLE_MODULE, $("#frm_SaveRoleModule").serialize()).then(res => {
			if(res['data'].status=='1'){
				toast.success(res['data'].message || 'Success');
				document.getElementById("frm_SaveRoleModule").reset();
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
					id="frm_SaveRoleModule"
					onSubmit={handleFormSubmit}
				>
					<Row>
						<Col md={12}>
							<label>Name of the Module Group <span className="text-danger">*</span></label>
							<Form.Control
								type="text"
								size="sm"
								className="fw-bold"
								name="role_group"
								required
							/>
						</Col>
					</Row>
					
					<Row className="mt-2">
						<Col md={9}>
							<label>Name of the Module <span className="text-danger">*</span></label>
							<Form.Control
								type="text"
								size="sm"
								className="fw-bold"
								name="role_id"
								placeholder="(_) only allowed no special characters and space"
								required
							/>
						</Col>
						<Col md={3}>
							<label> Order<span className="text-danger">*</span></label>
							<Form.Control
								type="number"
								size="sm"
								className="fw-bold"
								name="display_order"
								required
							/>
						</Col>
					</Row>
					
					<Row className="mt-2">
						<Col md={12}>
							<label>Description of the Module <span className="text-danger">*</span></label>
							<Form.Control
								as="textarea"
								rows="4"
								size="sm"
								className="fw-bold"
								name="role_description"
								required
							/>
						</Col>
					</Row>
					
					<Row className="mt-3 border-bottom">
						<Col md={10}>
							<label>Allow to check Create Option <span className="text-danger">*</span></label>
						</Col>
						<Col md={2} >
							<Form.Check
								type="checkbox"
								size="sm"
								className="fw-bold"
								name="action_create"
								value="1"
							/>
						</Col>
					</Row>

					<Row className="mt-3 border-bottom">
						<Col md={10}>
							<label>Allow to check List Option <span className="text-danger">*</span></label>
						</Col>
						<Col md={2} >
							<Form.Check
								type="checkbox"
								size="sm"
								className="fw-bold"
								name="action_list"
								value="1"
							/>
						</Col>
					</Row>
					
					<Row className="mt-3 border-bottom">
						<Col md={10}>
							<label>Allow to check Read Option <span className="text-danger">*</span></label>
						</Col>
						<Col md={2} >
							<Form.Check
								type="checkbox"
								size="sm"
								className="fw-bold"
								name="action_read"
								value="1"
							/>
						</Col>
					</Row>
					<Row className="mt-3 border-bottom">
						<Col md={10}>
							<label>Allow to check Update Option <span className="text-danger">*</span></label>
						</Col>
						<Col md={2} >
							<Form.Check
								type="checkbox"
								size="sm"
								className="fw-bold"
								name="action_update"
								value="1"
							/>
						</Col>
					</Row>
					<Row className="mt-3 border-bottom">
						<Col md={10}>
							<label>Allow to check Delete Option <span className="text-danger">*</span></label>
						</Col>
						<Col md={2} >
							<Form.Check
								type="checkbox"
								size="sm"
								className="fw-bold"
								name="action_delete"
								value="1"
							/>
						</Col>
					</Row>
					<Row className="mt-3 border-bottom">
						<Col md={10}>
							<label>Allow to check Print Option <span className="text-danger">*</span></label>
						</Col>
						<Col md={2} >
							<Form.Check
								type="checkbox"
								size="sm"
								className="fw-bold"
								name="action_print"
								value="1"
							/>
						</Col>
					</Row>
					<Row className="mt-3 border-bottom">
						<Col md={10}>
							<label>Allow to check Export Option <span className="text-danger">*</span></label>
						</Col>
						<Col md={2} >
							<Form.Check
								type="checkbox"
								size="sm"
								className="fw-bold"
								name="action_export"
								value="1"
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
									text="Save module"
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

export default NewRoleModule;