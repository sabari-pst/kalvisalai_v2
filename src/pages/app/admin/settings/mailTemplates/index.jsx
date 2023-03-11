import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Button, Card, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Spin, Radio, Space, Tabs } from 'antd';

import PsContext from '../../../../../context'
import { CardFixedTop, upperCase } from '../../../../../utils';
import PsModalWindow from '../../../../../utils/PsModalWindow';
import EditTemplate from './editTemplate';
import AddTemplate from './addTemplate';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import toast from 'react-hot-toast';
import axios from 'axios';
import ViewWebPage from '../webPages/viewWebPage';



const MailTemplates = (props) => {

    const context = useContext(PsContext);

    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [editData, setEditData] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);

    const loadData = () => {

        setDataList([]);
        setLoader(true);

        axios.post(ServiceUrl.ADMISSION.LIST_MAIL_TEMPLATES).then(res => {
            if (res['data'].status == '1') {
                setDataList(res['data'].data);
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });

    };

    useEffect(() => {

        loadData();
    }, []);

    const handleDelete = (item) => {
        if (!window.confirm('Do you want to delete "' + item.name + '"?')) {
            return;
        }
        setLoader(true);
        const form = new FormData();
        form.append('id', item.id);
        axios.post(ServiceUrl.ADMISSION.DELETE_MAIL_TEMPLATES, form).then(res => {
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
            <CardFixedTop title="Mail Templates" >
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
                                    <th width="60">S.No</th>
                                    <th>Template for</th>
                                    <th>Subject</th>
                                    <th width="100">Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataList.map((item, i) => {
                                    return <tr key={i} >
                                        <td>{i + 1}</td>
                                        <td>{item.template_for}</td>
                                        <td>{item.subject}</td>
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
            <PsModalWindow title="Edit Template" show={editModal} onHide={() => setEditModal(false)} size="lg">
                <EditTemplate dataSource={editData} afterFinish={() => { loadData(); setEditModal(false); }} />
            </PsModalWindow>
            <PsModalWindow title="Add Template" show={addModal} onHide={() => setAddModal(false)} size="lg"  >
                <AddTemplate afterFinish={() => { loadData(); setAddModal(false); }} />
            </PsModalWindow>

            <PsModalWindow title={editData.template_for} show={viewModal} onHide={() => setViewModal(false)} size="lg" >
                <ViewWebPage dataSource={editData} page="mail" />
            </PsModalWindow>


        </>
    );
};

export default MailTemplates;
