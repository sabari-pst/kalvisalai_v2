import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { Spin, Tabs } from 'antd';
import axios from 'axios';

const TransportAllocation = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    const [currentTab, setCurrentTab] = useState('transportlog');

    const handleTabChange=(key)=>{
        setCurrentTab(key);
    };

   return (
        <>
        <Spin spinning={loader} >
            <Card>
                <Card.Body className="pt-0">
                    
           

                </Card.Body>
            </Card>
        </Spin>

        </>
    );
};

export default withRouter(TransportAllocation);