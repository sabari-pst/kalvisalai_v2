import Ract from 'react';
import Axios from 'axios';
import toast from 'react-hot-toast';
import { ServiceUrl } from '../utils/serviceUrl';

export const listAll = async () => {

	return new Promise((resolve, reject) => {
		Axios.get(ServiceUrl.ADMIN_SETTINGS.LIST)
			.then(function ({ data }) {
				if (data.status != '1') {
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


export const listSettingsFields = async () => {

	return new Promise((resolve, reject) => {
		Axios.get(ServiceUrl.ADMISSION.SETTINGS)
			.then(function ({ data }) {
				resolve(data.data);
			})
			.catch(function (error) {
				//resolve([]);
				return [];
			});
	});
}
