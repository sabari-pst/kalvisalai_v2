import React, {useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';

import PsContext from '../../../../context';
import API from '../../../../utils/api';

const Logout = (props) =>{
	
	const context = useContext(PsContext);

   

    const log_out=()=>{

		toast((t) => (
			<span>
			  Do you want to logout ? 
			  <button onClick={()=>executeLogoutCall(t)} className="border text-success bg-light ms-2 me-2 font-12 font-weight-600" >
				Yes
			  </button>
			  <button onClick={() => toast.dismiss(t.id)} className="border text-danger bg-light ms-2 me-2 font-12 font-weight-600" >
				No
			  </button>
			</span>
		  ));
		  
	};

	const executeLogoutCall=(t)=>{

		API.get('v1/logout?api='+context.api).then(res=>{
			if(res['data'].status=='1'){
				context.logout();	
				toast.dismiss(t.id);	
			}
			else{
				toast.error(res['data'].content || 'Error');
			}
		});
		

	};

		return(		
			<a onClick={e=>log_out()} className={props.header ? 'btn btn-sm' : "nav_link"} > 
				
				{props.header && (<i class='bx bx-log-out ms-2 font-18 font-weight-600'></i>)}

				{!props.header && (<i class='bx bx-log-out nav_icon'></i>)}
				
				{!props.header && (<span className="nav_name">SignOut</span>)}
			</a>
		);
};

export default Logout;