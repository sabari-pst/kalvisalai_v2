import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Badge, Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import { momentDate, printDocument, upperCase } from '../../../../utils';


const styles = {
	tableCollapse: {
		borderCollapse: 'collapse',
	},
	borderBottom: {
		borderCollapse: 'collapse',
		borderBottom: '1px solid black',
	},
	borderExceptLeft: {
		borderCollapse: 'collapse',
		borderBottom: '1px solid black',
		borderTop: '1px solid black',
		borderRight: '1px solid black',
		padding: '3px',
	},
	borderExceptRight: {
		borderCollapse: 'collapse',
		borderBottom: '1px solid black',
		borderTop: '1px solid black',
		borderLeft: '1px solid black',
		padding: '3px',
	},
	borderAll: {
		borderCollapse: 'collapse',
		border: '1px solid black',
		padding: '3px',
	},
	borderTopBottom: {
		borderCollapse: 'collapse',
		borderTop: '1px solid black',
		borderBottom: '1px solid black',
		padding: '3px',
	},
}


const PrintPaymentReport = (props) => {

	const context = useContext(PsContext);

	const [loader, setLoader] = useState(false);
	
	const [dataList, setDataList] = useState(props.dataSource);
	const [dataView, setDataView] = useState(props.dataSource);

	useEffect(()=>{
		printDocument("fee_payment_list_print");

		if(props.onSuccess)
			props.onSuccess();
	},[]);

	const getTotalByField=(fieldName)=>{
		let total = 0;
		dataView.map(item => item[fieldName] && (total = parseFloat(total) + parseFloat(item[fieldName])));
		return parseFloat(total).toFixed(2);
	}
	
	const cancellBillNos=()=>{

		let rv = [];
		props.cancelledSource.map(item => rv.push(item.bill_no));
		return rv;
	}
	
	return(
		<>
			<div style={{display: 'none'}} >

				<div id="fee_payment_list_print" >

					<table width="100%" align="center" style={styles.tableCollapse}>
						<thead>
							<tr  style={styles.borderBottom} >
								<th colSpan={10} align="center" height="30"  style={styles.borderBottom} >
									<h4>{context.settingValue('billheader_name')}</h4>
									{context.settingValue('billheader_addresslineone') && <>{context.settingValue('billheader_addresslineone')} <br /></>} 
									{context.settingValue('billheader_addresslinetwo') && <>{context.settingValue('billheader_addresslinetwo')} <br /></>} 
								</th>
							</tr>
							<tr  style={styles.borderBottom} >
								<th colSpan={5} align="left" height="30"  style={styles.borderBottom} >
									Cancel Bills
								</th>
								<th colSpan={5} align="right" height="30"  style={styles.borderBottom} >
									From : {momentDate(props.fromDate,'DD/MM/YYYY')} &emsp; To : {momentDate(props.toDate,'DD/MM/YYYY')}
								</th>
							</tr>
							<tr>
								<th width="80" align="center" style={styles.borderBottom} >S.No</th>
								<th width="100" align="left" style={styles.borderBottom} >Date</th>
								<th width="90" align="left" style={styles.borderBottom} >Bill No</th>
								<th width="90" align="left" style={styles.borderBottom} >Cancel Date</th>
								<th align="left" style={styles.borderBottom} >Reg.No</th>
								<th align="left" style={styles.borderBottom} >Student Name</th>
								<th align="left" style={styles.borderBottom} >Course</th>
								<th width="80" align="center" style={styles.borderBottom} >Sem</th>
								<th width="100" align="right" style={styles.borderBottom} >Total</th>
							</tr>
						</thead>
						<tbody>
							{dataView.map((item, i) => {
								return <tr key={i} style={styles.borderBottom} >
									<td align="center" style={styles.borderBottom} height="30">{i+1}</td>
									<td style={styles.borderBottom} >{momentDate(item.bill_date,'DD/MM/YYYY')}</td>
									<td style={styles.borderBottom} >{item.bill_no}</td>
									<td style={styles.borderBottom} >{momentDate(item.bill_cancel_date,'DD/MM/YYYY')}</td>
									<td style={styles.borderBottom} >{item.registerno || item.admissionno}</td>
									<td style={styles.borderBottom} >{item.student_name}</td>
									<td style={styles.borderBottom} >{item.degree_name} - {item.course_name} {upperCase(item.course_type)=='SELF' ? '(SF)' : '(R)'}</td>
									<td align="center" style={styles.borderBottom} >{item.semester}</td>
									<td align="right" style={styles.borderBottom} >{item.bill_amount}</td>
								</tr>
							})}
							<tr style={styles.borderBottom} >
								<td colSpan={8} style={styles.borderBottom} align="right">Total : </td>
								<td align="right" style={styles.borderBottom}><b>{getTotalByField('bill_amount')}</b></td>
							</tr>
							{props.cancelledSource && props.cancelledSource.length>0 && (<tr style={styles.borderBottom}>
								<td style={styles.borderBottom} colSpan={9} >
									Cancelled Bills : {getTotalByField().join(',')}
								</td>
							</tr>)}
						</tbody>
					</table>

				</div>

			</div>
			
		</>
	);

};

export default PrintPaymentReport;