import axios from 'axios';

const Backend = axios.create({
  baseURL: 'http://18.144.10.209:5000/',
  withCredentials: true,
});

export default Backend;