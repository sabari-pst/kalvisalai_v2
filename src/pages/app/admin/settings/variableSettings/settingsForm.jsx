import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Button, Card, Row, Col, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Spin, Radio, Space, Tabs } from 'antd';

import PsContext from '../../../../../context'
import { CardFixedTop, upperCase } from '../../../../../utils';
import PsModalWindow from '../../../../../utils/PsModalWindow';
import { listSettings } from '../../../../../models/settings';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import toast from 'react-hot-toast';
import axios from 'axios';
import StringInput from './stringInput';
import YesOrNo from './yesOrNo';

const SettingsForm = (props) => {

    const context = useContext(PsContext);

    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);

    const loadSettings = () => {
        if (!props.menu || !props.menu.field_for) return;

        setDataList([]);
        setLoader(true);
        const form = new FormData();
        form.append('field_for', props.menu.field_for);
        form.append('ug_pg', props.menu.ug_pg);
        form.append('course_type', props.menu.course_type);
        axios.post(ServiceUrl.ADMISSION.LIST_VARIABLE_SETTINGS, form).then(res => {
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

        loadSettings();

    }, [props.menu]);

    const getInput = (item) => {

        return (item.field_type == 'string' || item.field_type == 'number')
            ? <StringInput row={item} module={props.menu.module} action={props.menu.action} />
            : item.field_type == 'yesno' ?
                <YesOrNo row={item} module={props.menu.module} action={props.menu.action}  />
                : '';
    }

    return (
        <>
            <Card>
                <Card.Header><b>{props.menu.name}</b></Card.Header>
                <Card.Body>
                    {loader && <Spinner animation='border' />}

                    {dataList && dataList.length > 0 && (<>
                        {dataList.map((item, i) => {
                            return <Row className='border-bottom pb-1 mb-1'>
                                <Col md={6}>
                                    <label>{item.description}</label>
                                </Col>
                                <Col md={6}>
                                    {getInput(item)}
                                </Col>
                            </Row>
                        })}
                    </>)}

                </Card.Body>
            </Card>
        </>
    );
};

export default SettingsForm;
