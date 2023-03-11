import React, { useState, useContext, useEffect } from 'react';
import { withRouter, useHistory, Switch, Route } from 'react-router-dom';


import PsContext from '../../context';
import { Header, Sidebar } from './components';

import routes from './routes';

const AppPage = (props) => {

	const context = useContext(PsContext);
	const history = useHistory();

	const [collapsed, setCollapsed] = useState(true);

	useEffect(() => {
		context.loadSettings();
	}, []);



	if (context.logged == 'no') {
		history.push('/');
		return null;
	}
	else {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		const ROLE = context.user.role;
		return (
			<div id="body-pd" >

				<Header setCollapsed={e => setCollapsed(!collapsed)} {...props} />

				<Sidebar role={ROLE} collapsed={collapsed} />

				<div id="page-content-wrapper" >
					<Switch>
						{routes.map(item => item.allowed.indexOf(ROLE) > -1 ? <Route path={item.path} component={item.component} exact={item.exact} /> : null)}
					</Switch>
				</div>

			</div>
		);
	}
};

export default withRouter(AppPage);