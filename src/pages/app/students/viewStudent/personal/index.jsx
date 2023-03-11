import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Row, Col, Card, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../../context';
import { Image, Spin, Tabs } from 'antd';
import axios from 'axios';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import { calculateAge, capitalizeFirst, momentDate, semesterValue, upperCase, yearBySem } from '../../../../../utils';
import { SELECT_USER_PHOTO } from '../../../../../utils/data';
import PersonalDetailsCard from './personalDetailsCard';
import FamilyDetailsCard from './familyDetailsCard';
import AddressDetailsCard from './addressDetailsCard';

const Personal = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState(props.dataSource);
    const [dataView, setDataView] = useState(props.dataSource);


   return (
        <>
       
            <PersonalDetailsCard {...props} />

            <FamilyDetailsCard {...props} />

            <AddressDetailsCard {...props} />

        </>
    );
};

export default withRouter(Personal);