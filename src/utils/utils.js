import axios from 'axios';

// const Backend = axios.create({
//   baseURL: 'https://ratemyclub-backend-production.up.railway.app',
//   withCredentials: true,
// });

const Backend = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});


export default Backend;