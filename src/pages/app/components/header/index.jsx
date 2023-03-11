import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import { Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import routes from '../../routes';
import { capitalizeFirst } from '../../../../utils';
import { Logout } from '..';

const Header = (props) => {

	const context = useContext(PsContext);
	const history = useHistory();

	const toggleSidebar = () => {
		/*if($("body").hasClass('sb-sidenav-toggled')){
			$("body").removeClass('sb-sidenav-toggled');
		}
		else{
			$("body").addClass('sb-sidenav-toggled');
		}*/
		//		showNavbar('header-toggle','nav-bar','body-pd','header');
	}

	const logout = () => {

		toast((t) => (
			<span>
				Do you want to logout ?
				<button onClick={() => {
					context.logout();
					toast.dismiss(t.id);
				}} className="border text-success bg-dark ms-2 me-2" >
					Yes
				</button>
				<button onClick={() => toast.dismiss(t.id)} className="border text-danger bg-dark ms-2 me-2" >
					No
				</button>
			</span>
		));

	};

	const getTitle = () => {
		var f = routes.filter(item => !item.divider && item.path.indexOf(history.location.pathname) > -1);

		return f && f.length > 0 ? f[0]['title'] : '';
	};

	const deptName = () => {
		//`${context.user.department_name} ${context.user.deptype}`

		return <span className="font-weight-600 font-15">
			{context.user.department_name}
			<span className="font-11 ms-2">({capitalizeFirst(context.user.deptype)})</span>
		</span>;
	};

	const showNavbar = () => {
		//showNavbar('','','','');

		let nav = document.getElementById("nav-bar");
		let bodypd = document.getElementById("body-pd");
		let headerpd = document.getElementById("header");

		// Validate that all variables exist
		if (nav && bodypd && headerpd) {
			// show navbar
			nav.classList.toggle('nav_show');
			// change icon
			//toggle.classList.toggle('bx-x');
			// add padding to body
			bodypd.classList.toggle('body-pd');
			// add padding to header
			headerpd.classList.toggle('body-pd');
		}

		if (props.setCollapsed) props.setCollapsed();
	}


	return (
		<>


			<header className="header" id="header">
				<button className="header_toggle btn" onClick={e => showNavbar()} >
					<i class='bx bx-menu' id="header-toggle"></i>
				</button>
				<a className="ms-2 text-dark cmp_title" >
					{getTitle()}
				</a>
				<div className="ms-auto">
					{context.backgroundProcess && (<a className='pe-2 text-danger'>
						<Spinner animation="border" role="status" size="sm" />
						<span className='ps-2'>Running in background..</span>
					</a>)}
					<a className='font-weight-600'>
						{context.user.employee_name}
						{/*<span className='font-12 ms-2'>({capitalizeFirst(context.user.deptype)})</span>*/}
					</a>


					<Logout header />


					{/*<div className="header_img "> <img src="https://i.imgur.com/hczKIze.jpg" alt="" /> </div>

					<NavDropdown title="Dropdown" id="basic-nav-dropdown">
						<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
					</NavDropdown>
					*/}
				</div>
			</header>

		</>
	);
};

export default Header;