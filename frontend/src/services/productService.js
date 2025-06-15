import axios from 'axios';

const API_URL = 'http://localhost:5000/products';

// Get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllProducts = () => {
  return api.get('/');
};

export const getProductById = (id) => {
  return api.get(`/${id}`);
};

export const addProduct = (productData) => {
  return api.post('/add', productData);
};

export const updateProduct = (id, productData) => {
  return api.put(`/update/${id}`, productData);
};

export const deleteProduct = (id) => {
  return api.delete(`/delete/${id}`);
};
