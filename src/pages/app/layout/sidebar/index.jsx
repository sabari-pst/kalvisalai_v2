import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PsContext from '../../../../context';

import NAV from '../../nav';
import NavBar from './NavBar';

const Sidebar=(props)=>{

    const context = useContext(PsContext);
    
	return(
		<React.Fragment>
			
			<nav className="page-sidebar" id="sidebar">
				<div id="sidebar-collapse">
					{/*<div className="admin-block d-flex ">
						<div>
							{/*<img src="https://technext.github.io/admincast/assets/img/admin-avatar.png" width="45px" />*/}
						{/*</div>
						<div className="admin-info">
							<div className="font-strong">{context.user.department_name}</div><small>{context.user.deptype}</small></div>
    </div>*/}
    <hr className='my-1' />
					<ul className="side-menu metismenu">
						{/*<li>
							<a href="index.html"><i className="sidebar-item-icon fa fa-th-large"></i>
								<span className="nav-label">Dashboard</span>
							</a>
						</li>

						<li>
                        <a href="javascript:;"><i className="sidebar-item-icon fa fa-bookmark"></i>
                            <span className="nav-label">Basic UI</span><i className="fa fa-angle-left arrow"></i></a>
                        <ul className="nav-2-level collapse">
                            <li>
                                <a href="colors.html">Colors</a>
                            </li>
                            <li>
                                <a href="typography.html">Typography</a>
                            </li>
                            <li>
                                <a href="panels.html">Panels</a>
                            </li>
                            <li>
                                <a href="buttons.html">Buttons</a>
                            </li>
                            <li>
                                <a href="tabs.html">Tabs</a>
                            </li>
                            <li>
                                <a href="alerts_tooltips.html">Alerts &amp; Tooltips</a>
                            </li>
                            <li>
                                <a href="badges_progress.html">Badges &amp; Progress</a>
                            </li>
                            <li>
                                <a href="lists.html">List</a>
                            </li>
                            <li>
                                <a href="cards.html">Card</a>
                            </li>
                        </ul>
	</li>*/}

					<NavBar menus={NAV} role={props.role} />

					</ul>

				</div>
			</nav>
			
		</React.Fragment>
	);
};

export default withRouter(Sidebar);