import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import PsContext from '../../../../../../context'
import { ServiceUrl } from '../../../../../../utils/serviceUrl';
import { CardFixedTop, upperCase } from '../../../../../../utils';
import axios from 'axios';
import { Spin } from 'antd';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';

const EditPage = (props) => {

    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const [validated, setValidated] = useState(false);

    const [originalText, setOriginalText] = useState('');

    useEffect(() => {

    }, []);


    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true);
        axios.post(ServiceUrl.ADMISSION.ADD_PAGE, $("#frm_AddPage").serialize()).then(res => {
            if (res['data'].status == '1') {
                toast.success(res['data'].message || 'Success');

                if (props.afterFinish)
                    props.afterFinish();
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });
    }

    const handleEditorChange = (e) => {

        setOriginalText(e.target.getContent());

    }
    const controls = [
        'font-size', 'separator',
        'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
        'superscript', 'subscript', 'remove-styles', 'separator', 'text-indent', 'text-align', 'separator',
        'headings', 'list-ul', 'list-ol', 'separator',
        'link', 'hr', 'separator',
        'media', 'separator',
        'clear'
    ]
    return (
        <>
            <CardFixedTop title="Edit Page" >

            </CardFixedTop>
            <Spin spinning={loader}>
                <Form noValidate validated={validated} method="post" id="frm_AddPage" onSubmit={handleFormSubmit}>
                    <Row>
                        <Col md={12} >
                            <input type="hidden" name="content" value={originalText} />


                            <Row >
                                <Col md={6}>
                                    <label className="control-label">slug <span className="text-danger">*</span></label>
                                    <Form.Control
                                        type="text"
                                        name="slug"
                                        size="sm"
                                        defaultValue=""
                                        required
                                    />
                                </Col>
                                <Col md={6}>
                                    <label className="control-label">Name <span className="text-danger">*</span></label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        size="sm"
                                        defaultValue=""
                                        required
                                    />
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col md={12}>
                                    <label className="control-label">Content <span className="text-danger">*</span></label>
                                    <div className="editor-wrapper">
                                        <Editor
                                            init={{ plugins: ['code'], branding: false }}


                                            onChange={handleEditorChange}
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mt-3'>
                                <Col md={12}>
                                    <div className='text-end'>
                                        <Button type="submit" variant="primary">
                                            <i className="fa-solid fa-check me-2"></i> Save
                                        </Button>
                                    </div>
                                </Col>
                            </Row>


                        </Col>


                    </Row>
                </Form>

            </Spin>
        </>
    );
};

export default EditPage;