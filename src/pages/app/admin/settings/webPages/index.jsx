import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Button, Card, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Spin, Radio, Space, Tabs } from 'antd';

import PsContext from '../../../../../context'
import { CardFixedTop, upperCase } from '../../../../../utils';
import PsModalWindow from '../../../../../utils/PsModalWindow';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import toast from 'react-hot-toast';
import axios from 'axios';
import EditWebPage from './editWebPage';
import ViewWebPage from './viewWebPage';
import AddWebPage from './addWebPage';


const WebPages = (props) => {

    const context = useContext(PsContext);

    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [editData, setEditData] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [addModal, setAddModal] = useState(false);


    useEffect(() => {

        loadData();
    }, []);
    
    const loadData = () => {

        setDataList([]);
        setLoader(true);

        axios.post(ServiceUrl.ADMISSION.LIST_PAGES).then(res => {
            if (res['data'].status == '1') {
                setDataList(res['data'].data);
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });

    };
    const handleDelete = (item) => {
        if (!window.confirm('Do you want to delete "' + item.name + '"?')) {
            return;
        }
        setLoader(true);
        const form = new FormData();
        form.append('id', item.id);
        axios.post(ServiceUrl.ADMISSION.DELETE_PAGE, form).then(res => {
            if (res['data'].status == '1') {
                toast.success(res['data'].message || 'Deleted');
                loadData();

            }
            else {
                toast.error(res['data'].message || 'Errora');
            }
            setLoader(false);
        });
    };
    return (
        <>
            <CardFixedTop title="Pages" >
                <ul className="list-inline mb-0">
                    <li className="list-inline-item">
                        <Button type="button" variant="white" className='border-start ms-2' onClick={() => setAddModal(true)} >
                            <i className="fa-solid fa-plus pe-1" ></i> New
                        </Button>
                    </li>
                    <li className='list-inline-item' >
                        <Button variant="white" className='border-start ms-2' onClick={loadData}>
                            <i className='fa fa-rotate fs-5 px-1'></i>
                        </Button>
                    </li>
                </ul>
            </CardFixedTop>

            <div className="container">

                <Row>
                    <Spin spinning={loader} >
                        <table className="table table-sm table-hover mt-3">
                            <thead>
                                <tr>
                                    <th>S.No</th>

                                    <th>Slug</th>
                                    <th>Name</th>
                                    <th>Content</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataList.map((item, i) => {
                                    return <tr key={i} >
                                        <td>{i + 1}</td>

                                        <td className='text-primarys'>{item.slug}</td>

                                        <td>{item.name}</td>
                                        <td>{item.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}</td>
                                        <td align="" >
                                            <div class="btn-group">
                                                <Button type="button" size="sm" variant="light" onClick={() => {
                                                    setEditData(item);
                                                    setViewModal(true);
                                                }}>
                                                    <i className="fa-solid fa-eye" ></i>
                                                </Button>
                                                <Button type="button" size="sm" variant="light" onClick={() => {
                                                    setEditData(item);
                                                    setEditModal(true);
                                                }}>
                                                    <i className="fa-solid fa-pencil" ></i>
                                                </Button>


                                                <Button type="button" size="sm" variant="light" onClick={() => handleDelete(item)}>
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>


                    </Spin>
                </Row>
            </div>

            <PsModalWindow title="Add Page" show={addModal} onHide={() => setAddModal(false)} size="xl"  >
                <AddWebPage afterFinish={() => { loadData(); setAddModal(false); }} />
            </PsModalWindow>
            <PsModalWindow title={editData.name} show={viewModal} onHide={() => setViewModal(false)} size="lg" >
                <ViewWebPage dataSource={editData} afterFinish={loadData} />
            </PsModalWindow>
            <PsModalWindow title="Edit Page" show={editModal} onHide={() => setEditModal(false)} size="xl" >
                <EditWebPage dataSource={editData} afterFinish={() => { loadData(); setEditModal(false); }} />
            </PsModalWindow>




        </>
    );
};

export default WebPages;
