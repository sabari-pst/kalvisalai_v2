import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import PsContext from '../../../../context';
import PsModalWindow from '../../../../utils/PsModalWindow';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { upperCase } from '../../../../utils';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import SerachForm from './serachForm';

const FeeCategorySearch = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState(props.dataSource);
    const [dataView, setDataView] = useState(props.dataSource);

   

	return(
		<>
			<PsModalWindow {...props} >
				<SerachForm {...props} />
			</PsModalWindow>		
		</>
	);

};

export default FeeCategorySearch;