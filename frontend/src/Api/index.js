import axios from 'axios';
import config from '../Config';

const http = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await http.get('/api/v1/auth/refresh-token');

        localStorage.setItem('token', data.token);

        http.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

        return http(originalRequest);
      } catch (err) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default http;
