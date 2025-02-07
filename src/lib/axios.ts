// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',  // Update this with your Laravel API URL
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     }
// });

// // Add request interceptor to include token if it exists
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;