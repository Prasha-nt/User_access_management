// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;

// services/api.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
// });

// // Attach token automatically to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;



import axios from 'axios';

const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

console.log("🌐 Using backend:", backendBaseUrl);

const api = axios.create({
  baseURL: backendBaseUrl + '/api',
});

// Automatically attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

