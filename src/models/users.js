import Ract from 'react';
import Axios from 'axios';
import toast from 'react-hot-toast';
import { ServiceUrl } from '../utils/serviceUrl';

export const listUserLogins = async (status=false) => {
    
    return new Promise((resolve, reject) => {
		let url = `${ServiceUrl.ADMISSION.LIST_USERS_LOGIN}`;
		if(status) url = `${url}?status=${status}`;
		
		 Axios.get(url)
			.then(function ({data}) {
				if(data.status!='1'){
					toast.error(data.message || 'Error');
				}
				resolve(data.data);
			})
			.catch(function (error) {
				//resolve([]);
				return [];
			});	
	});
}

export const listUserRoles = async (status=false) => {
    
    return new Promise((resolve, reject) => {
		let url = `${ServiceUrl.SETTINGS.LIST_USERROLE}`;
		if(status) url = `${url}?status=${status}`;
		
		 Axios.get(url)
			.then(function ({data}) {
				if(data.status!='1'){
					toast.error(data.message || 'Error');
				}
				resolve(data.data);
			})
			.catch(function (error) {
				//resolve([]);
				return [];
			});	
	});
}
