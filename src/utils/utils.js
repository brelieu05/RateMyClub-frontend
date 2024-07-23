import axios from 'axios';

const Backend = axios.create({
  baseURL: 'https://rate-my-club-backend.vercel.app/',
  withCredentials: true,
});

export default Backend;