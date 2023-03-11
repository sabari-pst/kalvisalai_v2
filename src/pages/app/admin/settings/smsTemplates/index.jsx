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



const SmsTemplates = (props) => {

    const context = useContext(PsContext);

    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [editData, setEditData] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);

    const loadData = () => {

        setDataList([]);
        setLoader(true);

        axios.post(ServiceUrl.ADMISSION.LIST_SMS_TEMPLATES).then(res => {
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
        axios.post(ServiceUrl.ADMISSION.DELETE_SMS_TEMPLATES, form).then(res => {
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
            <CardFixedTop title="SMS Templates" >
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
            <div className="container mt-2">

                <Row>
                    <Spin spinning={loader} >
                        <div className="tableFixHead ps-table">
                        <table className="table-hover">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Template for</th>
                                    <th>Template Id</th>
                                    <th>Template</th>
                                    <th>Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataList.map((item, i) => {
                                    return <tr key={i} >
                                        <td>{i + 1}</td>
                                        <td>{item.template_for}</td>
                                        <td className='text-primarys'>{item.template_id}</td>

                                        <td>{item.template}</td>
                                        <td align="" >
                                            <div class="btn-group">

                                                <Button type="button" size="sm" variant="transparent" onClick={() => {
                                                    setEditData(item);
                                                    setEditModal(true);
                                                }}>
                                                    <i className="fa-solid fa-pencil" ></i>
                                                </Button>


                                                <Button type="button" size="sm" variant="transparent" onClick={() => handleDelete(item)}>
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </Button>
                                            </div>

                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        </div>

                    </Spin>
                </Row>
            </div>
            <PsModalWindow title="Edit Template" show={editModal} onHide={() => setEditModal(false)} size="md">
                <EditTemplate dataSource={editData} afterFinish={() => { loadData(); setEditModal(false); }} />
            </PsModalWindow>
            <PsModalWindow title="Add Template" show={addModal} onHide={() => setAddModal(false)} size="md"  >
                <AddTemplate afterFinish={() => { loadData(); setAddModal(false); }} />
            </PsModalWindow>


        </>
    );
};

export default SmsTemplates;
