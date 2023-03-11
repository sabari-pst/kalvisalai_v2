import React, { useState, useContext } from 'react';
import  { NavLink } from 'react-router-dom';

const DropDownNavItem=(props)=>{

    const { name, icon, path, exact } = props.menu;

    return(
        <li>
            <NavLink 
                activeClassName='active'
                to={path}
                exact={exact}
            >
                {name}
            </NavLink>
        </li>
    );
   
};

export default DropDownNavItem;