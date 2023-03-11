import React, { useState, useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import PsContext from '../../../../context';
import toast from 'react-hot-toast';

const Logout=(props)=>{

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
		context.logout();	
		toast.dismiss(t.id);	
	};

	return(
		<button type='button' className='btn me-2 btn-light' onClick={()=>log_out()}>
			Logout <i className="fa-solid fa-arrow-right-from-bracket ms-2"></i>
		</button>
	);
};

export default Logout;