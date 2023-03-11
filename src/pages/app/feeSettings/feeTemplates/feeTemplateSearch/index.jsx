import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import PsContext from '../../../../../context';
import PsModalWindow from '../../../../../utils/PsModalWindow';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { upperCase } from '../../../../../utils';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import SerachForm from './serachForm';
import { listFeeTemplates } from '../../../../../models/fees';

const FeeTemplateSearch = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [dataView, setDataView] = useState([]);

	useEffect(()=>{
		loadData();
	},[]);

	const loadData=()=>{
		setLoader(true);
		listFeeTemplates().then(res=>{
			if(res){
				setDataList(res);
				setDataView(res);
			}
			setLoader(false);
		})
	}
   

	return(
		<>
			<PsModalWindow {...props} >

				{loader && (<center className="my-4">
					<Spinner animation="border" role="status" >

					</Spinner>
				</center>)}
				{!loader && (<SerachForm dataSource={dataList} {...props} />)}
			</PsModalWindow>		
		</>
	);

};

export default FeeTemplateSearch;