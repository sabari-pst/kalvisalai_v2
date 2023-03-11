import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Badge, Button, ButtonGroup, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';

import { capitalizeFirst, CardFixedTop, upperCase } from '../../../../utils';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import { Spin, Pagination, Space, Modal, message, Radio, Switch } from 'antd';

import moment from 'moment'
const Pages = (props) => {

	const context = useContext(PsContext);
	const [contentType] = useState(props.match.params.content_type)
	const currentTotalRecords = useRef(0);
	const [refreshTable, setRefreshTable] = useState(0)
	const [itemsPerPage] = useState(20)
	const [loader, setLoader] = useState(false);
	const [validated, setValidated] = useState(false);
	const [dataList, setDataList] = useState([]);
	const [dataView, setDataView] = useState([]);
	const [categoryData, setCategoryData] = useState([])
	const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
	const [deleteData, setDeleteData] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState(null);
	useEffect(() => {
		resetResult();
		loadData(1, itemsPerPage);
		loadCategories(props.match.params.content_type)
	}, [refreshTable, props.match.params.content_type, props.location.pathname]);

	const loadData = (page, pageSize) => {
		setLoader(true);
		var form = new FormData();
		form.append('type', props.match.params.content_type)
		if (selectedCategory)
			form.append('category', selectedCategory);

		form.append('start', ((page - 1) * pageSize))
		form.append('length', pageSize)
		axios.post('v1/admin/website-cms/list', form).then(res => {
			if (res['data'].status === '1') {
				setDataList(res['data'].data)
				setDataView(res['data'].data)
				setLoader(false);

			}
			else {
				setDataList([])
				setDataView([])
				setLoader(false);
			}

		});

	};

	const resetResult = () => {
		setLoader(true);
		var form = new FormData();
		form.append('type', props.match.params.content_type);
		if (selectedCategory)
			form.append('category', selectedCategory);
		axios.post('v1/admin/website-cms/total-records', form).then(res => {
			if (res['data'].status === '1') {
				currentTotalRecords.current = parseInt(res['data'].data);
				setLoader(false);

			}
			else {
				currentTotalRecords.current = 0;
				setLoader(false);
			}

		});

	}
	const loadCategories = (cType) => {

		var form = new FormData();
		form.append('content_type', cType)
		axios.post('v1/admin/website-cms/categories-list', form).then(res => {
			if (res['data'].status === '1') {

				setCategoryData(res['data'].data)
			}
			else {
				setLoader(false);
			}

		});

	}
	const onDeleteClick = (e) => {
		var form = new FormData();
		form.append('id', deleteData.id)
		axios.post('v1/admin/website-cms/delete', form).then(res => {
			if (res['data'].status === '1') {
				message.success(capitalizeFirst(props.match.params.content_type.replace("-", " ")) + " Deleted");
				setVisibleDeleteModal(false);
				setRefreshTable(prev => prev + 1)
			}
			else {
				message.error("Error on Delete")
			}

		});
	}
	const onCategoryChange = (e) => {
		if (e.target.value == 'all')
			setSelectedCategory(null);
		else
			setSelectedCategory(e.target.value);


		setRefreshTable(prev => prev + 1);

	}

	const handleSearch = (e) => {
		let m = dataList.filter(item => (upperCase(item.title).indexOf(upperCase(e.target.value)) > -1) || 
        (upperCase(item.seo_slug).indexOf(upperCase(e.target.value)) > -1));

		setDataView(m);
	};
	const onStatusChange = (checked, index, item) => {
		setLoader(true);
		/* var myDataview = dataView;
		if (checked)
			myDataview[index].content_status = 'published';
		else
			myDataview[index].content_status = 'draft';

			setDataView(myDataview); */

		var form = new FormData();
		form.append('id', item.id)
		form.append('title', item.title)
		if (checked)
			form.append('content_status', 'published')
		else
			form.append('content_status', 'draft')
		axios.post('v1/admin/website-cms/update', form).then(res => {
			if (res['data'].status === '1') {
				message.success(res['data'].message || 'Success');
				//console.log(res['data'].data);
				setLoader(false);
				setRefreshTable(prev => prev + 1)

			}
			else {
				message.error(res['data'].message || 'Error');
				setLoader(false);
			}

		});
	}
	return (
		<>

			<CardFixedTop title={capitalizeFirst(props.match.params.content_type.replace("-", " "))}>
				<ul className="list-inline mb-0">
					<li className='list-inline-item' >
						<Link className='btn btn-transparent border-start ms-2' to={"/app/cms/contents/" + contentType + "/add"}>
							<i className='fa-solid fa-plus fs-5 px-1'></i> Add {capitalizeFirst(props.match.params.content_type.replace("-", " "))}
						</Link>
					</li>
				</ul>
			</CardFixedTop>


			<div className="container mt-3">

				<Spin spinning={loader}>

					<Row>
						<Col md={8}>

							<Radio.Group defaultValue="all" buttonStyle="solid" onChange={onCategoryChange}
							>
								<Radio.Button value="all">All</Radio.Button>
								{categoryData.map(item => {
									return (<Radio.Button value={item.id}>{item.category_name}</Radio.Button>)
								})}

							</Radio.Group>

						</Col>
						<Col md={4}>
							<InputGroup>
								<InputGroup.Text><i className='fa-solid fa-magnifying-glass'></i></InputGroup.Text>
								<Form.Control
									type="text"
									size="sm"
									placeholder="Search.."

									onChange={handleSearch}
								/>
							</InputGroup>
						</Col>
					</Row>

					<Card className="mt-2">
						<Card.Body className="px-0 py-0">
							<div className="tableFixHead">
								<table>
									<thead>
										<tr>
											<th>Title</th>
											<th >Category</th>
											<th>Slug</th>
											<th width="60">Publish</th>
											<th >Active Date</th>
											<th width="60">#</th>
										</tr>
									</thead>
									<tbody>
										{
											dataView.map((item, i) => {
												return <tr key={i}>
													<td>{item.title}</td>
													<td>{item.category_name}</td>
													<td>{item.seo_slug}</td>
													<td>
														<Switch checked={item.content_status === 'published'} onChange={(checked) => onStatusChange(checked, i, item)} />
													</td>
													<td>
														<span style={{color:moment(item.active_from_date)>=moment()?'green':'red'}}>
														{moment(item.active_from_date).format("DD/MM/YYYY")} 
														</span>
														&nbsp; - &nbsp;
														<span style={{color:moment(item.active_to_date)>=moment()?'green':'red'}}>
														{moment(item.active_to_date).format("DD/MM/YYYY")}
														</span>
														</td>
													<td>
														<Space>
															<Link to={'/app/cms/contents/' + props.match.params.content_type + '/view/' + item.id}><Button size="sm" variant="transparent" title="Edit">
																<i className='fa-solid fa-eye fs-6'></i>
															</Button>
															</Link>

															<Link to={'/app/cms/contents/' + props.match.params.content_type + '/edit/' + item.id}><Button size="sm" variant="transparent" title="Edit">
																<i className='fa-solid fa-pen fs-6'></i>
															</Button>
															</Link>
															<Button size="sm" variant="transparent" title="Remove" onClick={e => { setDeleteData(item); setVisibleDeleteModal(true) }}>
																<i className='fa-solid fa-trash-can fs-6'></i>
															</Button>
														</Space>
													</td>

												</tr>
											})
										}
									</tbody>
								</table>
							</div>
							<Row style={{ padding: '15px 10px 10px 15px' }}>
								<Pagination
									//hideOnSinglePage={true}
									total={currentTotalRecords.current}
									showSizeChanger
									showQuickJumper
									//showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
									showTotal={(total, range) => ` ${total} items`}
									defaultPageSize={itemsPerPage}
									defaultCurrent={1}
									onChange={(page, pageSize) => { loadData(page, pageSize) }}
								/>
							</Row>
						</Card.Body>
					</Card>



				</Spin>
			</div>
			<Modal
				visible={visibleDeleteModal}
				zIndex={10000}
				footer={null}
				closeIcon={<Button><i className='fa-solid fa-close fs-6'></i></Button>}
				centered={false}
				closable={true}
				style={{ marginTop: '20px' }}
				width={600}
				// footer={null}
				onCancel={() => { setVisibleDeleteModal(false) }}
				title={<span style={{ color: 'red' }} >Delete {capitalizeFirst(contentType)}?</span>}
			>
				<h5>Are you Sure to Delete below {capitalizeFirst(contentType)}?</h5>
				<Row style={{ padding: '15px 10px 10px 15px' }}>
					<Col md={4}>Title</Col>
					<Col style={{ color: 'blue' }}>{deleteData && deleteData.title}</Col>
				</Row>
				<Row style={{ padding: '15px 10px 10px 15px' }}>
					<Col md={6}></Col>
					<Col md={6}><Space><Button style={{ background: 'grey' }}>Cancel</Button> <Button onClick={onDeleteClick}>Delete Now</Button></Space></Col>

				</Row>
			</Modal>


		</>
	);

};

export default Pages;