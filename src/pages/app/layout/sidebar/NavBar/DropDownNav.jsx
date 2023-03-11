import React, { useState, useContext } from 'react';
import  { NavLink } from 'react-router-dom';
import ModuleAccess from '../../../../../context/moduleAccess';
import DropDownNavItem from './DropDownNavItem';

const DropDownNav=(props)=>{

    const { name, icon, path, exact } = props.menu;

    const { menuId, setMenuId, childrens, role } = props;

    const renderMenus=()=>{
        
        return childrens.map(item => <ModuleAccess module={item.module} action={item.action}><DropDownNavItem menu={item} /></ModuleAccess>);    
    };

    const handleMenuClick=()=>{
        if(menuId==name){
            setMenuId(null);
        }
        else{
            setMenuId(name);
        }
    };

    return(
        <li className={`${menuId==name ? 'active' : ''}`}>
            <a href="javascript:;"
            onClick={handleMenuClick}
            >
                <i class={`sidebar-item-icon ${icon}`}></i>
                <span class="nav-label">{name}</span>
                <i class="fa fa-angle-left arrow"></i>
            </a>
            <ul className={`nav-2-level collapse ${menuId==name ? 'in' : ''}`}>
                {renderMenus()}
            </ul>
        </li>
    );
};

export default DropDownNav;