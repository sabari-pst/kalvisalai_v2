import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import PsContext from '../../../../context';
import PsModalWindow from '../../../../utils/PsModalWindow';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { formToObject, upperCase } from '../../../../utils';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import LoaderSubmitButton from '../../../../utils/LoaderSubmitButton';
import toast from 'react-hot-toast';
import ModuleAccess from '../../../../context/moduleAccess';

const FeePaymentPartEntry = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(false);
	const [validated, setValidated] = useState(false);
    const [dataList, setDataList] = useState(props.dataSource);
    const [dataView, setDataView] = useState(props.dataSource);

	const handleSubmit=(e)=>{
		e.preventDefault();
		const form = e.currentTarget;
		let v = formToObject(form);

		if(v.part_type=='concession'){
			if(parseFloat(v.part_amount)>parseFloat(dataList.fee_amount)){
				toast.error('Enter Concession less than Fee Amount');
				return;
			}
		}
		if(v.part_type=='part_payment'){
			if(parseFloat(v.part_amount)>parseFloat(dataList.fee_amount)){
				toast.error('Enter Part Amount less than Fee Amount');
				return;
			}
		}

		if(props.onSuccess)
			props.onSuccess(v);
	}


	return(
		<>
			<PsModalWindow {...props} >	
				<Form onSubmit={handleSubmit} >
					<Row>
						<Col md={3}>
							<label>Category</label>
						</Col>
						<Col md={9}>
							<Form.Control
								type="text"
								size="sm"
								className="fw-bold"
								value={dataList.category_name}
							/>
						</Col>
					</Row>
					<Row className='mt-2'>
						<Col md={3}>
							<label>Amount</label>
						</Col>
						<Col md={9}>
							<Form.Control
								type="text"
								size="sm"
								className="fw-bold"
								value={dataList.fee_amount}
							/>
						</Col>
					</Row>
					<Row className='mt-2'>
						<Col md={3}>
							<label>Type</label>
						</Col>
						<Col md={9}>
							<Form.Control
								as="select"
								size="sm"
								className="fw-bold form-select form-select-sm"
								name="part_type"
								required
							>
								<option value=""></option>
								<ModuleAccess module={'fee_part_payment'} action={'action_create'}>
									<option value="part_payment">Part Payment</option> 
								</ModuleAccess>
								<ModuleAccess module={'fee_concession_entry'} action={'action_create'}>
									<option value="concession">Concession</option> 
								</ModuleAccess>
							</Form.Control>
						</Col>
					</Row>
					
					<Row className='mt-2'>
						<Col md={3}>
							<label>Value</label>
						</Col>
						<Col md={9}>
							<Form.Control
								type="number"
								size="sm"
								className="fw-bold"
								name="part_amount"
								required
							/>
						</Col>
					</Row>
					<Row className='mt-3'>
						<Col md={12}>
							<div className='text-end'>
								<a className="border-end pe-2 me-3 fs-10" onClick={e=>props.onCancel()}>
									<u>Cancel</u>
								</a>
								<LoaderSubmitButton
									text="Save Entry"
								/>
							</div>
						</Col>
					</Row>
				</Form>
			</PsModalWindow>		
		</>
	);

};

export default FeePaymentPartEntry;