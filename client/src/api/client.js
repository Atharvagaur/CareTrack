import axios from 'axios';

/** Shared Axios instance for every API request made by the client. */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
