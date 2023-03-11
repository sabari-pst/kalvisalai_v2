import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Button, Card, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Spin, Radio, Space, Tabs } from 'antd';

import PsContext from '../../../../../context'
import { CardFixedTop, upperCase } from '../../../../../utils';
import PsModalWindow from '../../../../../utils/PsModalWindow';
import { listSettings } from '../../../../../models/settings';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import toast from 'react-hot-toast';
import axios from 'axios';
import SettingsForm from './settingsForm';
import AddVariable from './addVariable';
import ModuleAccess from '../../../../../context/moduleAccess';

const { TabPane } = Tabs;

const VariableSettings = (props) => {

    const context = useContext(PsContext);

    const [loader, setLoader] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(0);
    const [addModal, setAddModal] = useState(false);

    const [menuInfo, setMenuInfo] = useState([]);

    const settingsMenu = [
        { name: 'General Settings', key: '0', path: 'general-settings', field_for: 'college', ug_pg: '', course_type: '', module: 'master_settings_general_tab', action:'action_list' },
        { name: 'Social Media Settings', key: '1', path: 'social-settings', field_for: 'college', ug_pg: '', course_type: 'socialmedia' , module: 'master_settings_socialmedia', action:'action_list'},
        { name: 'Academic Settings', key: '2', path: 'academic-settings', field_for: 'college', ug_pg: '', course_type: 'academic' , module: 'master_settings_academic_settings', action:'action_list'},
        { name: 'Bill Header Settings', key: '3', path: 'billheader-settings', field_for: 'college', ug_pg: '', course_type: 'billheader' , module: 'master_settings_bill_header', action:'action_list'},
        { name: 'SMS Settings', key: '4', path: 'sms-settings', field_for: 'college', ug_pg: '', course_type: 'sms' , module: 'master_settings_sms_settings', action:'action_list'},
        { name: 'Email Settings', key: '5', path: 'mail-settings', field_for: 'college', ug_pg: '', course_type: 'mail' , module: 'master_settings_email_settings', action:'action_list'},
    ];

    const getTabMenu = (item) => {
        
        return <TabPane tab={item.name} key={item.key} />;
    }

    const getMenuInfo = () => {
        let m = settingsMenu.find(item => item.key == currentMenu);
        setMenuInfo(m);
    }

    useEffect(() => {
        getMenuInfo();
    }, [currentMenu]);

    return (
        <>
            <CardFixedTop title="Master Settings" >
                <ul className="list-inline mb-0">
                    <ModuleAccess module="settings_menu" action="action_create">
                        <li className="list-inline-item">
                            <Button type="button" variant="white" className='border-start ms-2' onClick={() => setAddModal(true)} >
                                <i className="fa-solid fa-plus pe-1" ></i> New
                            </Button>
                        </li>
                    </ModuleAccess>
                    <li className='list-inline-item' >
                        <Button variant="white" className='border-start ms-2' onClick={getMenuInfo}>
                            <i className='fa fa-rotate fs-5 px-1'></i>
                        </Button>
                    </li>
                </ul>
            </CardFixedTop>

            <div className="container">

                <Row>
                    <Col md={3} className='me-0 mt-3'>
                        <Tabs tabPosition={"left"} onChange={e => setCurrentMenu(e)}>
                            {settingsMenu.map(item => getTabMenu(item))}
                        </Tabs>
                    </Col>
                    <Col md={9} className='ms-0 mt-3' >
                        <SettingsForm menu={menuInfo} />
                    </Col>
                </Row>



            </div>

            <PsModalWindow title="Add Variable" show={addModal} onHide={() => setAddModal(false)} size="md"  >
                <AddVariable afterFinish={() => { getMenuInfo(); setAddModal(false); }} />
            </PsModalWindow>


        </>
    );
};

export default VariableSettings;
