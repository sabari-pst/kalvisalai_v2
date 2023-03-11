import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Badge, Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import PsContext from '../../../../context';
import { CardFixedTop, printDocument } from '../../../../utils';
import { Spin } from 'antd';
import { listCollegeYears } from '../../../../models/academicYears';
import SelectCollegeYear from '../../selectCollegeYear';
import ModuleAccess from '../../../../context/moduleAccess';

const MyTimeTable = (props) => {

	const context = useContext(PsContext);
	const [loader, setLoader] = useState(false);

	const [selectedCollegeYear, setSelectedCollegeYear] = useState([]);
	

	const getTitle=()=>{
		
		return 'My Time Table';
	}

	const dayHourCount = context.settingValue('hour_for_attendance_per_day');

	const tdColSpan = (parseInt(dayHourCount) + 1);

	const printClick=()=>{
		printDocument("print_cls_time_table");
	}

	return (
		<>
			<CardFixedTop title={getTitle()} >
				<ul className="list-inline mb-0">
					<ModuleAccess module="timetable_my_timetable" action="action_print">
						<li className="list-inline-item">
							<Button variant="white" className='border-start ms-2' onClick={e => printClick()} >
								<i className="fa-solid fa-print pe-1" ></i> Print
							</Button>
						</li>
					</ModuleAccess>
					<li className='list-inline-item' >
						<Button variant="white" className='border-start ms-2' onClick={e => setSelectedCollegeYear([])} disabled={!selectedCollegeYear.college_year} >
							<i className='fa-solid fa-xmark fs-5 px-1'></i> Reset
						</Button>

					</li>
				</ul>
			</CardFixedTop>
			<div className="container mt-3" >
				<Spin spinning={loader}>

				<ModuleAccess module="timetable_my_timetable" action="action_list">
					{(!selectedCollegeYear || !selectedCollegeYear.college_year) && (<Row>
						<Col md={5}>
							<SelectCollegeYear
								oddEvenSem={true}
								onSuccess={ (v) => setSelectedCollegeYear(v)}
							/>
						</Col>
					</Row>)}
				</ModuleAccess>
					
				</Spin>
			</div>

		
			
		</>

		
	);
};
export default MyTimeTable;