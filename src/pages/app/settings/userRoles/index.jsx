import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Badge, Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';

import { capitalizeFirst, CardFixedTop, upperCase } from '../../../../utils';

import axios from 'axios';
import { formatCountdown } from 'antd/lib/statistic/utils';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import { listUserRoles } from '../../../../models/users';
import { Spin } from 'antd';
import NewUserRole from './newUserRole';
import EditUserRole from './editUserRole';
import UserRoleAccess from './userRoleAccess';
import ModuleAccess from '../../../../context/moduleAccess';

const UserRoles = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(false);
	const [addModal, setAddModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [accessModal, setAccessModal] = useState(false);
	const [addModule, setAddModule] = useState(false);
	
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
		listUserRoles().then(res => {
			if(res){
				setDataList(res);
				setDataView(res);
			}
			setLoader(false);
		})
	}

	const handleSearch = (e) => {
		let v = upperCase(e.target.value);
		let d = dataList.filter(item => upperCase(item.role_name).indexOf(v)>-1);
		setDataView(d);
	}

	const handleDelete = (item) => {
		
		if(!window.confirm('Do you want to delete?')){
			return false;
		}

		setLoader(true);
		const form = new FormData();
		form.append('id', item.id);
		axios.post(ServiceUrl.SETTINGS.DELETE_USERROLE, form).then(res=>{
			if(res['data'].status=='1'){
				toast.success(res['data'].message || 'Success');
				setDataView(dataList.filter( obj => obj.id !== item.id));	
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
	
	const handleAccessUpdate = (item) => {
		setViewData(item);
		setAccessModal(true);
	}
	
	return(
		<>
			<CardFixedTop title="User Roles">
				<ul className="list-inline mb-0">
					<ModuleAccess module="settings_user_roles" action="action_create">
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
						<div className="tableFixHead bg-white">
							<table>
								<thead>
									<tr>
										<th width="60">S.No</th>
										<th>Name of the Role</th>
										<th width="90" className="text-center" >Order</th>
										<th width="120" className="text-center" >Status</th>
										<th width="120" className="text-center" >#</th>
									</tr>
								</thead>
								<tbody>
									{dataView.map((item, i)=>{
										return <tr key={i} className={item.active_status=='0' ? 'text-danger' : ''} >
											<td>{i+1}</td>
											<td>{item.role_name}</td>
											<td align="center">{item.display_order}</td>
											<td align="center">{item.active_status=='1' ? <Badge size="sm" bg="success">Active</Badge> :  <Badge size="sm" bg="danger">In-Active</Badge>}</td>
											<td align="center">
												<ModuleAccess module="settings_user_roles" action="action_update">
													<Button size="sm" variant="transparent" title="Edit Access" onClick={e => handleAccessUpdate(item,e)} >
														<i className="fa-regular fa-rectangle-list"></i>
													</Button>
												
													<Button size="sm" variant="transparent" title="Edit" onClick={e => handleEdit(item,e)} >
														<i className="fa-solid fa-pen-to-square"></i>
													</Button>
												</ModuleAccess>
												<ModuleAccess module="settings_user_roles" action="action_delete">
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

			{addModal && <NewUserRole 
				title="New User Role"
				size="sm"
				show={addModal}
				onSuccess={ e => loadData()}
				onHide={e => setAddModal(false)}
			/>}
			
			{editModal && <EditUserRole 
				title="Edit User Role"
				size="sm"
				show={editModal}
				onSuccess={ e => {setEditModal(false); loadData()}}
				onHide={e => setEditModal(false)}
				dataSource={viewData}
			/>}
			
			{accessModal && <UserRoleAccess 
				title="Edit User Role & Access"
				size="lg"
				show={accessModal}
				onSuccess={ e => {setAccessModal(false)}}
				onHide={e => setAccessModal(false)}
				dataSource={viewData}
			/>}
			
		
		</>
	);

};

export default UserRoles;