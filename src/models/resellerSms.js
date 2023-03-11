import Ract from 'react';
import Axios from 'axios';
import toast from 'react-hot-toast';
import { ServiceUrl } from '../utils/serviceUrl';

export const checkBalance = async() =>{
	const form = new FormData();
	return new Promise((resolve, reject) => {
		let url = `${ServiceUrl.SMS.CHECK_BALANCE}`;
		 Axios.get(url, form)
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
