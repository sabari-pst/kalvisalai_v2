import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';


const SearchForm=(props)=>{

	return(
		<React.Fragment>

			<form className="navbar-search" action="javascript:;">
				<div className="rel">
					<span className="search-icon"><i className="ti-search"></i></span>
					<input className="form-control" placeholder="Search here..." />
				</div>
			</form>
			
		</React.Fragment>
	);
};

export default SearchForm