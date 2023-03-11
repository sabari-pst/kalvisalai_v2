import React from 'react';
import { NavDropdown } from 'react-bootstrap';

const PSListItem = (props) =>{
	
	const {title, subTitle=false, actions=false} = props;
	
	return(
		<div className="list-group-item d-flex align-items-center">
			<div className="flex-fill">
				<div>{title}</div>
				<div className="text-gray-700">{props.boldSubTitle ? <b>{subTitle}</b> : subTitle}</div>
			</div>
			<div className="width-100">
				{actions}
			</div>
		</div>
	);
};

export default PSListItem;