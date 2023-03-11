import { useContext }  from 'react';
import axios from 'axios';
import { baseUrl } from './index';

const Api = axios.create({
  baseURL: `${baseUrl}`,
  headers: {
	"X-Requested-With": "XMLHttpRequest",
  }
});


export default Api;

/*
// Axios Instance
axios.defaults.baseURL = `${baseUrl}`;
axios.defaults.headers.common['X-Requested-With'] = `XMLHttpRequest`;
const Api = axios.create();

Api.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || 'Something went wrong!'
        )
)

export default Api;*/