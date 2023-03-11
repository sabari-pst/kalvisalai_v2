import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import PsContext from '../../../../context';
import PsModalWindow from '../../../../utils/PsModalWindow';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { upperCase } from '../../../../utils';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';

const SerachForm = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(false);
    const [dataList, setDataList] = useState(props.dataSource);
    const [dataView, setDataView] = useState(props.dataSource);

    const [currentRow, setCurrentRow] = useState(0);

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
			
			if(props.onSuccess)
				props.onSuccess(selectedItem);
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
        let m = dataList.filter(item => upperCase(item.category_name).indexOf(upperCase(e.target.value))>-1);
        //setDataView((dataView) => m);
        setDataView(m);
    }

    const onSelect=(selectedItem)=>{
        if(props.onSuccess)
            props.onSuccess(selectedItem);
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
								Total no fo Categories : {dataView.length}
							</div>
						</Col>
					</Row>

					<div className="tableFixHead bg-white" style={{height: '400px' }} >
							<table className="">
								<thead> 
									<tr>
										<th>Category Name</th>
										<th>Account No</th>
										<th width="120">Amount</th>
										<th width="80">#</th>
									</tr>
								</thead>
								<tbody>
									{dataView.map((item,i)=>{
										return <tr key={i} className={currentRow==(i) ? `row-${i} tr-selected` : `row-${i}`}  >
											<td>{item.category_name}</td>
											<td>{item.category_account_no}</td>
											<td align="right">{item.category_amount || item.fee_category_amount}</td>
											<td align="center" onClick={e => onSelect(item)}>
												<Button size="sm" variant="transparent" className="px-0 py-0" onClick={e => onSelect(item)}>
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