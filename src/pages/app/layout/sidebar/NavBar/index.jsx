import Item from 'antd/lib/list/Item';
import React, { useState, useContext } from 'react';
import ModuleAccess from '../../../../../context/moduleAccess';
import { lowerCase, upperCase } from '../../../../../utils';
import DropDownNav from './DropDownNav';
import SingleNav from './SingleNav';

const NavBar=(props)=>{

    const { menus } = props;

    const [menuId, steActiveMenuId] = useState(null);

    const ROLE = lowerCase(props.role);

    const renderMenus=()=>{

        /*return menus.map(item => item.allowed.indexOf(ROLE)>-1 ? item.type=='title' 
            ? <li className="title">{item.name}</li> 
            : item.childrens 
            ? <DropDownNav menu={item} childrens={item.childrens} menuId={menuId} setMenuId={(id)=>steActiveMenuId(id)} role={ROLE} /> 
            : <SingleNav menu={item} /> : null);*/

            return menus.map(item => <ModuleAccess roleGroup={item.roleGroup} module={item.module || ''} action={item.action || ''} >
                {item.type=='title' && (<li className="title">{item.name}</li>)}
                {item.childrens ? 
                <DropDownNav menu={item} childrens={item.childrens} menuId={menuId} setMenuId={(id)=>steActiveMenuId(id)} role={ROLE} /> 
                : item.type=='title' ? null : <SingleNav menu={item} />}
            </ModuleAccess>);
    };

	return renderMenus();
};

export default NavBar;