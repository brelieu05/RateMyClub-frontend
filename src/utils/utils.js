import axios from 'axios';

const Backend = axios.create({
  baseURL: 'https://ratemyclub-backend-production.up.railway.app',
  withCredentials: true,
});

export default Backend;