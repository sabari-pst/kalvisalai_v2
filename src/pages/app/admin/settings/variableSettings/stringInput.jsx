import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Button, Card, Row, Col, Form, InputGroup, Spinner } from 'react-bootstrap';
import PsContext from '../../../../../context';
import axios from 'axios';
import { ServiceUrl } from '../../../../../utils/serviceUrl';
import toast from 'react-hot-toast';
import ModuleAccess from '../../../../../context/moduleAccess';

const StringInput = (props) => {

    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const [fieldValue, setFieldValue] = useState(props.row.field_value);

    const updateDb = () => {
        if (!window.confirm('Do you want to update?')) return;
        setLoader(true);
        const form = new FormData();
        form.append('id', props.row.id);
        form.append('field_value', fieldValue);

        axios.post(ServiceUrl.ADMISSION.UPDATE_VARIABLE_SETTINGS, form).then(res => {
            if (res['data'].status == '1') {
                toast.success(res['data'].message || 'Success');
                context.loadSettings();
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    };

    return (
        <>
            {props.row.field_type == 'string' && (<><Form.Control
                type="text"
                size="sm"
                className="fw-bold"
                value={fieldValue}
                onChange={e => setFieldValue(e.target.value)}
            />
             <div className='text-end mt-2'>
                <ModuleAccess module={props.module} action={props.action}>
                    <Button
                    type="button"
                    size="xs"
                    variant='secondary'
                    disabled={loader || (props.row.field_value == fieldValue)}
                    onClick={e => updateDb()}
                >
                    {loader ? <><Spinner animation="border" size="sm" /> Updating.. </> : 'Update'}
                </Button>
                </ModuleAccess>
            </div>
            </>)}
           
            {props.row.field_type == 'multistring' && (<><Form.Control
                as="textarea"
                rows={2}
                size="sm"
                className="fw-bold"
                value={fieldValue}
                onChange={e => setFieldValue(e.target.value)}
            />
             <div className='text-end mt-2'>
                <ModuleAccess module={props.module} action={props.action}>
                    <Button
                        type="button"
                        size="xs"
                        variant='secondary'                    
                        disabled={loader || (props.row.field_value == fieldValue)}
                        onClick={e => updateDb()}
                    >
                        {loader ? <><Spinner animation="border" size="sm" /> Updating.. </> : 'Update'}
                    </Button>
                </ModuleAccess>
            </div>
            </>)}

            {props.row.field_type == 'number' && (<InputGroup>
                <Form.Control
                    type="number"
                    size="sm"
                    className="fw-bold"
                    value={fieldValue}
                    onChange={e => setFieldValue(e.target.value)}
                />
                <InputGroup.Text className="px-0 py-0">
                    <ModuleAccess module={props.module} action={props.action}>
                        <Button
                            type="button"
                            size="xs"
                            variant='secondary'
                            disabled={loader || (props.row.field_value == fieldValue)}
                            onClick={e => updateDb()}
                        >
                            {loader ? <><Spinner animation="border" size="sm" /> Updating.. </> : 'Update'}
                        </Button>
                    </ModuleAccess>
                </InputGroup.Text>
            </InputGroup>)}

           
        </>
    );
};

export default StringInput;
