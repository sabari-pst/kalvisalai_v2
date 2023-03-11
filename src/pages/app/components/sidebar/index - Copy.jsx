import React, {useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Tooltip } from 'antd';

import PsContext from '../../../../context';
import API from '../../../../utils/api';
import { LOGO } from '../../../../utils/data';
import { Logout } from '..';

import nav from '../../nav';

const Sidebar = (props) =>{
	
	const context = useContext(PsContext);

    const navLink=(item)=>{

		if(item.divider){
			return <a className="nav_link  nav_divider"></a>;
		}

		if(item.allowed.indexOf(props.role)>-1){
			if(item.childrens){
				return  <div className='dropdown_menu' >
					<a className="nav_link has_dropdown" exact={item.exact}  >            
					{item.icon && (<Tooltip title={item.name} placement="right" >
						<i className={`${item.icon} nav_icon`} ></i>
					</Tooltip >)}
						<span className="nav_name">{item.name}</span>
				</a>
				<div className='dropdown_menu_list'>
					{item.childrens.map(item => navLink(item) )}
				</div>
				</div>;
			}
			else{
				return  <NavLink className="nav_link " to={item.path} exact={item.exact}  >            
					{item.icon && (<Tooltip title={item.name} placement="right" >
						<i className={`${item.icon} nav_icon`} ></i>
					</Tooltip >)}
						<span className="nav_name">{item.name}</span>
				</NavLink>;
			}
		}
    };


		return(
			<>
			{/*<div className="border-end bg-light l-navbar" id="nav-bar">
               <div className="sidebar-heading border-bottom ">Kalvisalai <span className='font-12'>1.1</span></div>
                <div className="list-group">
                    
                    {nav.map(item => navLink(item) )}
                    
        </div>
         

        </div>*/}

<div className="l-navbar" id="nav-bar">
        <nav className="nav">
            <div> <a className="nav_logo"> 
				{/*<i class='bx bx-layer nav_logo-icon'></i> */}
				<img src={LOGO} className='nav_logo-icon' style={{width: '23px'}} />
				<span className="nav_logo-name">Kalvisalai</span> </a>
                <div className="nav_list"> 

                {nav.map(item => navLink(item) )}
                
                </div>
            </div> 

			<Logout />
        </nav>
    </div>
				
			</>
		);
};

export default Sidebar;