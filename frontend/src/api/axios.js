import axios from 'axios';

const API = axios.create({
  baseURL: 'https://taskplanet-social-app-j520.onrender.com/api'
});

// Attach token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});

export default API;