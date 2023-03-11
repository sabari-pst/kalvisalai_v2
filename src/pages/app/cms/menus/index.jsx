import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Badge, ButtonGroup, InputGroup, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';

import { capitalizeFirst, CardFixedTop, upperCase } from '../../../../utils';
import axios from 'axios';
import { ServiceUrl } from '../../../../utils/serviceUrl';
import { Spin, Pagination, Space, Modal, message, Radio, Switch, Button, Form, Card } from 'antd';
import PsModalWindow from '../../../../utils/PsModalWindow';
import moment from 'moment'
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import AddMenu from './addMenu';
import EditMenu from './editMenu';
import ModuleAccess from '../../../../context/moduleAccess';
const MenuList = (props) => {
    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [treeData, setTreeData] = useState(null);
    const [viewOrEditData, setViewOrEditData] = useState({})
    const [visibleAddModal, setVisibleAddModal] = useState(false);
    const [visibleEditModal, setVisibleEditModal] = useState(false);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);

    useEffect(() => {
        loadData()
    }, []);

    const loadData = () => {
        setLoader(true);
        var form = new FormData();
        axios.post('v1/admin/website-cms/menu-list', form).then(res => {
            if (res['data'].status === '1') {

                var allMenuData = res['data'].data;
                var tData = [];
                allMenuData.filter(item => parseInt(item.parentid) === 0).forEach(menu => {
                    tData.push(
                        {
                            title: <Space>
                                <span style={{ color: parseInt(menu.activestatus) === 1 ? 'green' : 'red' }}>{menu.title} </span> <span>({menu.linktype})</span>
                                <ModuleAccess module="cms_web_menus" action="action_update">
                                    <Button type="ghost" shape="circle" style={{ float: 'right' }} onClick={e => onMenuEditClick(menu)}><i className='fa-solid fa-edit fs-5 px-1'></i>
                                    </Button>
                                </ModuleAccess>
                                <ModuleAccess module="cms_web_menus" action="action_create">
                                    <Button type="ghost" shape="circle" onClick={e => onMenuAddClick(menu)}><i className='fa-solid fa-plus fs-5 px-1'></i>
                                    </Button>
                                </ModuleAccess>
                                {
                                    loadChildrens(allMenuData, menu).length === 0 && (<ModuleAccess module="cms_web_menus" action="action_delete"><Button type="ghost" shape="circle" style={{ color: 'red' }} onClick={e => onMenuDeleteClick(menu)}><i className='fa-solid fa-trash fs-5 px-1'></i>
                                    </Button></ModuleAccess>)
                                }
                            </Space>,
                            key: menu.id,
                            children: loadChildrens(allMenuData, menu)
                        }
                    )
                });
                setTreeData(tData)
                setLoader(false);

            }
            else {
                setDataList([])
                setLoader(false);
            }

        });

    };
    const loadChildrens = (allMenuData, curMenu) => {
        var tData = [];
        allMenuData.filter(item => parseInt(item.parentid) === parseInt(curMenu.id)).forEach(menu => {
            tData.push(
                {
                    title: <Space>
                        <span style={{ color: parseInt(menu.activestatus) === 1 ? 'green' : 'red' }}>{menu.title} </span> <span>({menu.linktype})</span>
                        <ModuleAccess module="cms_web_menus" action="action_update">
                        <Button type="ghost" shape="circle" style={{ float: 'right' }} onClick={e => onMenuEditClick(menu)}><i className='fa-solid fa-edit fs-5 px-1'></i>
                        </Button>
                        </ModuleAccess>
                        <ModuleAccess module="cms_web_menus" action="action_create">
                        <Button type="ghost" shape="circle" onClick={e => onMenuAddClick(menu)}><i className='fa-solid fa-plus fs-5 px-1'></i>
                        </Button>
                        </ModuleAccess>
                        {
                            loadChildrens(allMenuData, menu).length === 0 && (<ModuleAccess module="cms_web_menus" action="action_delete"><Button type="ghost" shape="circle" style={{ color: 'red' }} onClick={e => onMenuDeleteClick(menu)}><i className='fa-solid fa-trash fs-5 px-1'></i>
                            </Button></ModuleAccess>)
                        }
                    </Space>,
                    key: menu.id,
                    children: loadChildrens(allMenuData, menu)
                }
            )
        });
        return tData;
    }
    const onMenuAddClick = (item) => {
        setViewOrEditData(item)
        setVisibleAddModal(true)
    }
    const onMenuEditClick = (item) => {

        setViewOrEditData(item)
        setVisibleEditModal(true)
    }
    const onMenuDeleteClick = (item) => {
        setViewOrEditData(item)
        setVisibleDeleteModal(true)
    }
    const onDeleteConfirm = () => {
        var form = new FormData();
        form.append('id', viewOrEditData.id)

        axios.post('v1/admin/website-cms/delete-menu', form).then(res => {
            if (res['data'].status === '1') {
                message.success('Menu Deleted');
                setLoader(false);
                setVisibleDeleteModal(false);
                loadData()
            }
            else {
                message.error(res['data'].message || 'Error');

            }

        });
    }
    const onSaveMenuOrder=()=>{
        setLoader(true);
        var form = new FormData();
        form.append('menutree', JSON.stringify(treeData))

        axios.post('v1/admin/website-cms/update-menu-order', form).then(res => {
            if (res['data'].status === '1') {
                message.success('Menu Orders Updated');
                setLoader(false);
                loadData()
            }
            else {
                message.error(res['data'].message || 'Error');

            }

        });
    }
    return (
        <>

            <CardFixedTop title='Menu List'>
                <ul className="list-inline mb-0">
                    <li className='list-inline-item' >
                        <Button style={{ background: '#031b4d', color: '#fff' }} onClick={onSaveMenuOrder}>
                            <i className='fa-solid fa-save fs-5 px-1'></i> Save Menu Order
                        </Button>
                    </li>
                </ul>
            </CardFixedTop>

            <div className="container mt-3">

                <Spin spinning={loader}>
                    <Card >

                        <div style={{ height: '1000' }}>
                            {treeData && (<SortableTree
                                treeData={treeData}
                                isVirtualized={false}
                                onChange={tData => setTreeData(tData)}
                            />)}
                        </div>

                    </Card>



                </Spin>
            </div>
            <PsModalWindow title={"Add Menu (after " + viewOrEditData.title + ")"}
                onHide={e => { setVisibleAddModal(false) }} show={visibleAddModal} size="md" >
                <AddMenu dataItem={viewOrEditData} onFinish={() => { setVisibleAddModal(false); loadData() }} onCancel={() => setVisibleAddModal(false)} />
            </PsModalWindow>

            <PsModalWindow title="Edit Menu" onHide={e => { setVisibleEditModal(false) }} show={visibleEditModal} size="md" >
                <EditMenu dataItem={viewOrEditData} onFinish={() => { setVisibleEditModal(false); loadData() }} onCancel={() => setVisibleEditModal(false)} />
            </PsModalWindow>
            <PsModalWindow title="Delete Menu"  onHide={e => { setVisibleDeleteModal(false) }} show={visibleDeleteModal} size="md" >
                <Card>


                    <Form
                        name="basic"
                        //layout = 'vertical'
                        colon={false}

                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={onDeleteConfirm}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Title"
                        >
                            :{viewOrEditData.title}

                        </Form.Item>
                        <Form.Item
                            label="Link Type"
                        >
                            :{viewOrEditData.linktype}

                        </Form.Item>
                        <Form.Item
                            label="Page Link"
                        >
                            :{viewOrEditData.menulink}


                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                            <Space>
                                <Button type="primary" style={{ background: 'grey' }} onClick={() => setVisibleDeleteModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Delete
                                </Button>
                            </Space>
                        </Form.Item>

                    </Form>
                </Card>
            </PsModalWindow>
        </>
    );

};

export default MenuList;