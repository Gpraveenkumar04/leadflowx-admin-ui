import axios from 'axios';

// Axios instance pointing to same-origin Next.js API by default
const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// In dev, bypass next-auth for local API routes using our auth wrapper
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  api.defaults.headers.common['x-bypass-auth'] = 'true';
}

export default api;
