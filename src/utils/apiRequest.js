import axios from 'axios';
import { getLs, baseUrl } from '.';

axios.defaults.baseURL = `${baseUrl}`;
axios.defaults.headers.common['Api-Token'] = getLs('coa_api') || '';
axios.defaults.headers.common['X-Requested-With'] = `XMLHttpRequest`;


const Api = axios.create();

export default Api;