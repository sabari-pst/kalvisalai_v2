import Ract from 'react';
import Axios from 'axios';

import { ServiceUrl } from '../utils/serviceUrl';

export const listVehicles = async (status = false) => {

	return new Promise((resolve, reject) => {
		let url = `${ServiceUrl.TRANSPORT.LIST_VEHICLES}`;
		if (status) url = url + '?status=' + status;
		Axios.get(url)
			.then(function ({ data }) {
				if (data.status != '1') {
					//toast.error(data.message || 'Error');
				}
				resolve(data.data);
			})
			.catch(function (error) {
				//resolve([]);
				return [];
			});
	});
}

export const listDestinations = async (status = false) => {

	return new Promise((resolve, reject) => {
		let url = `${ServiceUrl.TRANSPORT.LIST_DESTINATION}`;
		if (status) url = url + '?status=' + status;
		Axios.get(url)
			.then(function ({ data }) {
				if (data.status != '1') {
					//toast.error(data.message || 'Error');
				}
				resolve(data.data);
			})
			.catch(function (error) {
				//resolve([]);
				return [];
			});
	});
}
