import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import PsContext from '../../../../../context';
import PsModalWindow from '../../../../../utils/PsModalWindow';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { groupByMultiple, upperCase } from '../../../../../utils';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { listFeeTemplates } from '../../../../../models/fees';

const SerachForm = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataView, setDataView] = useState([]);

    const [currentRow, setCurrentRow] = useState(0);

	useEffect(()=>{
		let m = groupByMultiple(props.dataSource, function(obj){
			return [obj.template_uuid];
		});
		setDataList(props.dataSource);
		setDataView(m);
	},[]);

    const handleKeyDownPress=()=>{		
		
		if(currentRow < dataView.length-1){	
			setCurrentRow((currentRow) => currentRow + 1);		
			if(currentRow>7)
			{
				var row = (currentRow - 8);
				$("tr.row-"+row).hide();				
			}
		}
	};
	
	const handleKeyUpPress=()=>{
		
		if(parseFloat(currentRow) > 0){	
			setCurrentRow((currentRow) => currentRow - 1);	
			if(currentRow>6)
			{
				var row = (currentRow - 7);
				$("tr.row-"+row).show();
			}
		}
	};


    const handleEnterButtonPress=()=>{
		try{

			var d = dataView;
			var selectedItem = d[currentRow];			
			successCall(selectedItem);
		}
		catch(er){ }
	};
  
    const keyPressHandler = (e) => {
		 
        if(e.keyCode==40){ // Handle down arrow press
           handleKeyDownPress();
       }
       else if(e.keyCode==38){ // Handle up arrow press
           handleKeyUpPress();
       }
       else if(e.keyCode==13){ // Handle Enter button press
           document.removeEventListener('keydown', keyPressHandler);
           handleEnterButtonPress();
       }
       else if(e.keyCode == 113 && !props.sales){
           document.removeEventListener('keydown', keyPressHandler);
       }
   };


    useEffect(()=>{
        $("#frm_Item_Search").focus();
    },[]);

    const selectedItem=(fieldName)=>{
        if(dataView && dataView.length>0)
        {
            let m = dataView[currentRow];
            return ( m && m[fieldName] || '');
        }
    }

    const handleSearchChange=(e)=>{
        setCurrentRow((currentRow) => 0);
        //const newTodos = [...dataView];
        let m = dataList.filter(item => upperCase(item.template_name).indexOf(upperCase(e.target.value))>-1);
        //setDataView((dataView) => m);
		let d = groupByMultiple(m, function(obj){
			return [obj.template_uuid];
		});
        setDataView(d);
    }

    const onSelect=(selectedItems)=>{
		successCall(selectedItems);
    }

    const handleKeyDownEvent_New=(key, e)=>{
        
        if(e.keyCode==40){ // Handle down arrow press
            handleKeyDownPress();
        }
        else if(e.keyCode==38){ // Handle up arrow press
            handleKeyUpPress();
        }
        else if(e.keyCode==13){ // Handle Enter button press
            document.removeEventListener('keydown', keyPressHandler);
            handleEnterButtonPress();
        }
        else if(e.keyCode == 113 && !props.sales){
            document.removeEventListener('keydown', keyPressHandler);
        }
    }

	const getAmount=(items)=>{
		let total = 0;
		items.map(item => item.fee_category_amount && (total = parseFloat(total) + parseFloat(item.fee_category_amount)));
		return parseFloat(total).toFixed(2);
	}

	const successCall=(items)=>{
		setLoader(true);
		let q = '1&template_uuid='+items[0].template_uuid;
		listFeeTemplates(q).then(res => {
			if(res){
				if(props.onSuccess)
					props.onSuccess(res);
			}
			setLoader(false);
		});		
	}

	return(
		<>
			
				<KeyboardEventHandler 
					handleKeys={['all']}
					onKeyEvent={handleKeyDownEvent_New}
					handleFocusableElements={true}
				>

					<Row className="mb-2">
						<Col md={4}>
							<InputGroup size="sm">
								<Form.Control
									type="text"
									size="sm"
									placeholder="Search..."
									id="frm_Item_Search"
									onChange={e => handleSearchChange(e)}
									autoFocus
								/>
								<InputGroup.Text>
									<i className="fa-solid fa-magnifying-glass"></i>
								</InputGroup.Text>
							</InputGroup>
						</Col>
						<Col md={8}>
							<div className="text-end fs-sm fw-bold">
								Total no fo Templates : {dataView && dataView.length}
							</div>
						</Col>
					</Row>

					<div className="tableFixHead bg-white" style={{height: '400px' }} >
							<table className="">
								<thead> 
									<tr>
										<th>Template Name</th>
										<th width="120">Amount</th>
										<th width="80">#</th>
									</tr>
								</thead>
								<tbody>
									{dataView.map((items,i)=>{
										let item = items[0];
										return <tr key={i} className={currentRow==(i) ? `row-${i} tr-selected` : `row-${i}`}  >
											<td>{item.template_name}</td>
											<td align="right">{item.fee_template_amount}</td>
											<td align="center">
												<Button size="sm" variant="transparent" className="px-0 py-0" onClick={e => onSelect(items)}>
													<i className="fa-solid fa-check fs-7"></i>
												</Button>
											</td>
										</tr>
									})}
								</tbody>
							</table>
						</div>
						
				</KeyboardEventHandler>
			
		</>
	);

};

export default SerachForm;