import React, { useState, useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { Nav, NavDropdown } from 'react-bootstrap';
import PsContext from '../../../../context';
import { capitalizeFirst } from '../../../../utils';

const UserProfile = (props) => {

	const context = useContext(PsContext);

	const getTitle = () => {
		return <div style={{
			fontSize: '12px',
			fontWeight: '600'
		}}>
			{context.user.employee_name || 'My Profile'}
			{/*<span className='font-12 ms-2'>({capitalizeFirst(context.user.deptype)})</span>*/}
		</div>;
	}

	return (
		<React.Fragment>

			<Nav>
				<NavDropdown
					id="nav-dropdown"
					title={getTitle()}
				>
					<Link to="/app/user" className='dropdown-item'>Profie</Link>
					<Link to="/app" className='dropdown-item'>Support</Link>
					<hr className='dropdown-divider' />
					<a className='dropdown-item'>Logout</a>
				</NavDropdown>
			</Nav>


		</React.Fragment>
	);
};

export default withRouter(UserProfile);