import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Button, Card, Row, Col, Form, InputGroup, Spinner, SplitButton } from 'react-bootstrap';
import PsContext from '../../../../../context';
import axios from 'axios';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import toast from 'react-hot-toast';
import ModuleAccess from '../../../../../context/moduleAccess';

const styles = {
    loaderSpan: {
        position: 'absolute',
        right: '14px',
        marginTop: '-4px',
    }
}

const YesOrNo = (props) => {

    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const [fieldValue, setFieldValue] = useState(props.row.field_value);

    const handleOnChange = (e) => {

        let msg = fieldValue == '1' ? 'Disable' : 'Enable';
        if (!window.confirm('Do you want to ' + msg)) {
            return;
        }
        updateDb();
    };

    const updateDb = () => {
        setLoader(true);
        const form = new FormData();
        form.append('id', props.row.id);
        form.append('field_value', (fieldValue == '1' ? '0' : '1'));

        axios.post(ServiceUrl.ADMISSION.UPDATE_VARIABLE_SETTINGS, form).then(res => {
            if (res['data'].status == '1') {
                toast.success(res['data'].message || 'Success');
                setFieldValue(fieldValue == '1' ? '0' : '1');
                context.loadSettings();
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    };

    return (
        <div className='text-end'>
            {loader && (<span style={styles.loaderSpan}>
                <Spinner animation='border' size='md' />
            </span>)}
            <ModuleAccess module={props.module} action={props.action}>
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    className='check-input-lg'
                    checked={fieldValue == '1'}
                    onChange={handleOnChange}
                />
            </ModuleAccess>
        </div>
    );
};

export default YesOrNo;
