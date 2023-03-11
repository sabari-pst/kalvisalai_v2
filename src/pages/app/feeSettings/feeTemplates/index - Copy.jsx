import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Badge, Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import ModuleAccess from '../../../../context/moduleAccess';

import { capitalizeFirst, CardFixedTop, groupByMultiple, upperCase } from '../../../../utils';

import { listFeeTemplates, listPaymentMethods } from '../../../../models/fees';
import axios from 'axios';
import { formatCountdown } from 'antd/lib/statistic/utils';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import { Spin } from 'antd';

import NewFeeTenmplate from './newFeeTenmplate';
import EditFeeTemplate from './editFeeTemplate';

const FeeTemplates = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(false);
	const [addModal, setAddModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	
	const [dataList, setDataList] = useState([]);
	const [dataView, setDataView] = useState([]);
	const [viewData, setViewData] = useState([]);

	useEffect(()=>{
		loadData();
	},[]);

	const loadData = () => {
		setLoader(true);
		setDataList([]);
		setDataView([]);
		listFeeTemplates().then(res => {
			if(res){
				setDataList(res);
				let m = groupByMultiple(res, function(obj){
					return [obj.template_uuid];
				});
				setDataView(m);
			}
			setLoader(false);
		})
	}

	const handleSearch = (e) => {
		let v = upperCase(e.target.value);
		let d = dataList.filter(item => upperCase(item.template_name).indexOf(v)>-1);
		let m = groupByMultiple(d, function(obj){
			return [obj.template_uuid];
		});
		setDataView(m);
	}

	const handleDelete = (item) => {
		
		if(!window.confirm('Do you want to delete?')){
			return false;
		}

		setLoader(true);
		const form = new FormData();
		form.append('template_id', item.template_uuid);
		axios.post(ServiceUrl.FEES.REMOVE_TEMPLATE, form).then(res=>{
			if(res['data'].status=='1'){
				toast.success(res['data'].message || 'Success');
				let d = dataList.filter(obj => obj.template_uuid !== item.template_uuid);
				let m = groupByMultiple(d, function(obj){
					return [obj.template_uuid];
				});
				setDataList(d);
				setDataView(m);
			}
			else
				toast.error(res['data'].message || 'Error');
			
			setLoader(false);
		});
	}

	const handleEdit = (item) => {
		setViewData(item);
		setEditModal(true);
	}


	const getAmount=(items)=>{
		let total = 0;
		items.map(item => item.fee_category_amount && (total = parseFloat(total) + parseFloat(item.fee_category_amount)));
		return parseFloat(total).toFixed(2);
	}

	
	return(
		<>
			<CardFixedTop title="Fee Templates">
				<ul className="list-inline mb-0">
					<ModuleAccess module={'fee_settings_feetemplate'} action={'action_create'}>
						<li className="list-inline-item">
							<Button type="button" variant="white" className='border-start ms-2' onClick={() => setAddModal(true)} >
								<i className="fa-solid fa-plus pe-1" ></i> New
							</Button>
						</li>
					</ModuleAccess>
					<li className='list-inline-item' >
						<Button variant="white" className='border-start ms-2' onClick={ e => loadData()}>
							<i className='fa fa-rotate fs-5 px-1'></i>
						</Button>
					</li>
				</ul>
			</CardFixedTop>

			<div className="container mt-2">
				<Row className=''>
					<Col md={4}>
						<InputGroup size="sm">
							<InputGroup.Text>
								<i className="fa-solid fa-magnifying-glass"></i>
							</InputGroup.Text>
							<Form.Control
								type="text"
								placeholder="Search..."
								onChange={e => handleSearch(e)}
							/>
						</InputGroup>
					</Col>
				</Row>

				<Row className='mt-2' >
					<Col md={12}>
						<Spin spinning={loader} >
						<div className="tableFixHead bg-white ps-table" style={{height:'calc(100vh - 160px)'}}>
							<table>
								<thead>
									<tr>
										<th width="60">S.No</th>
										<th>Template Name</th>
										<th width="120" className="text-center" >Amount</th>
										<th width="120" className="text-center" >For New.Adm</th>
										<th width="120" className="text-center" >For Promotion</th>
										<th width="100" className="text-center" >#</th>
									</tr>
								</thead>
								<tbody>
									{dataView.map((items, i)=>{
										let item = items[0];
										return <tr key={i} >
											<td>{i+1}</td>
											<td>{item.template_name}</td>
											{/*<td align="right">{getAmount(items)}</td>*/}
											<td align="right">{item.fee_template_amount}</td>
											<td align="center">
												{item.for_new_admission=='1' ? 
												<span className="badge badge-success badge-sm">Yes</span> : 
												<span className="badge badge-danger badge-sm">No</span>}
											</td>
											<td align="center">
												{item.for_new_student_promotion=='1' ? 
												<span className="badge badge-success badge-sm">Yes</span> : 
												<span className="badge badge-danger badge-sm">No</span>}
											</td>
											<td align="center">
												<ModuleAccess module={'fee_settings_feetemplate'} action={'action_update'}>
													<Button size="sm" variant="transparent" title="Edit" onClick={e => handleEdit(items,e)} >
														<i className="fa-solid fa-pen-to-square"></i>
													</Button>
												</ModuleAccess>
												<ModuleAccess module={'fee_settings_feetemplate'} action={'action_delete'}>
													<Button size="sm" variant="transparent" title="Delete" onClick={e => handleDelete(item)}>
														<i className="fa-regular fa-trash-can"></i>
													</Button>
												</ModuleAccess>
											</td>
										</tr>
									})}
								</tbody>
							</table>
						</div>
						</Spin>
					</Col>
				</Row>
			</div>

			{addModal && <NewFeeTenmplate 
				title="New Fee Template"
				size="lg"
				show={addModal}
				onSuccess={ e => {
					setAddModal(false);
					loadData();
				}}
				onHide={e => setAddModal(false)}
			/>}
			
			{editModal && <EditFeeTemplate 
				title="Edit Fee Template"
				size="lg"
				show={editModal}
				onSuccess={ e => {setEditModal(false); loadData()}}
				onHide={e => setEditModal(false)}
				dataSource={viewData}
			/>}
		</>
	);

};

export default FeeTemplates;