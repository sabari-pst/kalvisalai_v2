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
import PsModalWindow from '../../../../utils/PsModalWindow';
import moment from 'moment'
const MenuTableList = (props) => {
    const context = useContext(PsContext);
    const [contentType] = useState(props.match.params.content_type)
    const [refreshTable, setRefreshTable] = useState(0)
    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataView, setDataView] = useState([]);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [visibleAddModal,setVisibleAddModal]=useState(false);
    const [visibleEditModal,setVisibleEditModal]=useState(false)
    const [deleteData, setDeleteData] = useState(null)
    const [selectedLinkType, setSelectedLinkType] = useState(null);
    const [itemsPerPage] = useState(50);
    const currentTotalRecords = useRef(0);
    useEffect(() => {
        resetResult();
        loadData(1, itemsPerPage);
    }, [refreshTable]);
    const resetResult = () => {
        setLoader(true);
        var form = new FormData();
        if (selectedLinkType)
            form.append('linktype', selectedLinkType);
        axios.post('v1/admin/website-cms/menu-total-records', form).then(res => {
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
    const loadData = (page, pageSize) => {
        setLoader(true);
        var form = new FormData();
        if (selectedLinkType)
            form.append('linktype', selectedLinkType);
        form.append('start', ((page - 1) * pageSize))
        form.append('length', pageSize)
        axios.post('v1/admin/website-cms/menu-list', form).then(res => {
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
    const onLinkTypeChange = (e) => {
        if (e.target.value == 'all')
            setSelectedLinkType(null);
        else
            setSelectedLinkType(e.target.value);


        setRefreshTable(prev => prev + 1);

    }

    const onDeleteClick = (e) => {
        var form = new FormData();
        form.append('id', deleteData.id)
        axios.post('v1/admin/website-cms/delete-menu', form).then(res => {
            if (res['data'].status === '1') {
                message.success("Menu Deleted");
                setVisibleDeleteModal(false);
                setRefreshTable(prev => prev + 1)
            }
            else {
                message.error("Error on Delete")
            }

        });
    }
    const handleSearch = (e) => {
        let m = dataList.filter(item => (upperCase(item.title).indexOf(upperCase(e.target.value)) > -1) ||
            (upperCase(item.menulink).indexOf(upperCase(e.target.value)) > -1));

        setDataView(m);
    };
    const onStatusChange = (checked, index, item) => {
        setLoader(true);
        var form = new FormData();
        form.append('id', item.id)
        if (checked)
            form.append('activestatus', 'active')
        else
            form.append('activestatus', 'inactive')

        axios.post('v1/admin/website-cms/update-menu', form).then(res => {
            if (res['data'].status === '1') {
                message.success(res['data'].message || 'Success');
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

            <CardFixedTop title='Menu List'>
                <ul className="list-inline mb-0">
                    <li className='list-inline-item' >
                        <Link className='btn btn-transparent border-start ms-2' to={"/app/cms/menus/add"}>
                            <i className='fa-solid fa-plus fs-5 px-1'></i> Add Menu
                        </Link>
                    </li>
                </ul>
            </CardFixedTop>


            <div className="container mt-3">

                <Spin spinning={loader}>

                    <Row>
                        <Col md={8}>

                            <Radio.Group defaultValue="all" buttonStyle="solid" onChange={onLinkTypeChange}
                            >
                                <Radio.Button value="all">All</Radio.Button>
                                <Radio.Button value="page">Page Links</Radio.Button>
                                <Radio.Button value="custom">Custom Links</Radio.Button>
                                <Radio.Button value="external">External Links</Radio.Button>

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
                                            <th>S.No</th>
                                            <th>Menu Title</th>
                                            <th >Url</th>
                                            <th >Active</th>
                                            <th width="60">#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dataView.map((item, i) => {
                                                return <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{item.title}</td>
                                                    <td>{item.menulink}</td>
                                                   
                                                    <td>
                                                        <Switch checked={item.activestatus === '1'} onChange={(checked) => onStatusChange(checked, i, item)} />
                                                    </td>

                                                    <td>
                                                        <Space>
                                                           <Button size="sm" variant="transparent" title="View">
                                                                <i className='fa-solid fa-eye fs-6'></i>
                                                            </Button>
                                                          

                                                          <Button size="sm" variant="transparent" title="Edit" onClick={e=>setVisibleEditModal(true)}>
                                                                <i className='fa-solid fa-pen fs-6'></i>
                                                            </Button>
                                                           
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
            <PsModalWindow title="Add Menu" onHide={e => {setVisibleAddModal(false)}} show={visibleAddModal} size="md" >
              
            </PsModalWindow>
            <PsModalWindow title="Edit Menu" onHide={e => {setVisibleEditModal(false)}} show={visibleEditModal} size="md" >
              fsdfadsf
            </PsModalWindow>


        </>
    );

};

export default MenuTableList;