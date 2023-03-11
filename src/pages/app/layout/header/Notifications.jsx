import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { Nav, NavDropdown } from 'react-bootstrap';

const Notifications=(props)=>{

	
	return(
		<React.Fragment>
			
			<Nav>
			<NavDropdown
			id="nav-dropdown-dark-example"
			title="Dropdown"
			menuVariant="dark"
			>
			<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
			<NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
			<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
			<NavDropdown.Divider />
			<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
			</NavDropdown>
		</Nav>
						
			
		</React.Fragment>
	);
};

export default withRouter(Notifications);