import React, {useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Tooltip } from 'antd';

import { Layout, Menu, Divider } from 'antd';

import PsContext from '../../../../context';
import API from '../../../../utils/api';
import { LOGO } from '../../../../utils/data';
import { Logout } from '..';

import nav from '../../nav';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = (props) =>{
	
	const context = useContext(PsContext);

	const subMenu=(item, i)=>{
		return item.divider ?
		<a className="nav_link  nav_divider"></a>
		: item.allowed.indexOf(props.role)>-1 ? <Menu.Item key={i} icon={<i className={item.icon}></i>} title={item.name}>
			<NavLink to={item.path} >{item.name}</NavLink>
		</Menu.Item> : null;
	};

	const getNav=(item, i)=>{
		return item.divider ?
		<a className="nav_link  nav_divider"></a>
		: item.childrens && item.childrens.length>0 && item.allowed.indexOf(props.role)>-1 ? <SubMenu key={i} icon={<i className={item.icon}></i>} title={item.name}>
			{item.childrens.map((sm, j) => subMenu(sm, i+'_'+j))}
		</SubMenu>		
		: item.allowed.indexOf(props.role)>-1 ? <Menu.Item key={i} icon={<i className={item.icon}></i>} title={item.name}>
			<NavLink to={item.path} >{item.name}</NavLink>
		</Menu.Item> : null;
	}
  
		return(
			<>
	

			<div className="l-navbar" id="nav-bar">
				<a className="nav_logo"> 
					{/*<i class='bx bx-layer nav_logo-icon'></i> */}
					<img src={LOGO} className='nav_logo-icon' style={{width: '23px'}} />
					<span className="nav_logo-name">Kalvisalai</span> </a>

					<div className='side_nav'>

						<Sider trigger={null} collapsible collapsed={props.collapsed} >
							<div className="logo" />
							<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
								
								{nav.map((item, i) => getNav(item, i))}
							</Menu>
						</Sider>

					</div>
					
    			</div>
				
			</>
		);
};

export default Sidebar;