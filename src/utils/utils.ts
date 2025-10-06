import axios from 'axios';
// import { getIdTokenFromUser } from './firebaseAuthUtils'; // Adjust the import based on your file structure
// import { auth } from './firebaseAuthUtils';
const Backend = axios.create({
  baseURL: 'https://ratemyclub-backend-production.up.railway.app/',
  withCredentials: true,

});

// const Backend = axios.create({
//   baseURL: 'http://localhost:5000',
//   withCredentials: true,
// });

// Backend.interceptors.request.use(async (config) => {
//   const user = auth.currentUser; // Get the current user
//   if (user) {
//     const token = await getIdTokenFromUser(user); // Get the ID token

//     config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });


export default Backend;