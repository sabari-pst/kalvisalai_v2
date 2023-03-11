import React, { useEffect, useState } from 'react';

const PsBredCrumb = (props) =>{
	
	return(
		 <div className="page-headers" >
			<div className="row" >
				<div className="col-md-2" >
					<h5>{props.title}</h5>
				</div>
				<div className="col-md-10 d-flex justify-content-end" >
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default PsBredCrumb;