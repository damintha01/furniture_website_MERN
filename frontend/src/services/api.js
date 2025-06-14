import axios from 'axios';

// Function to check server availability and get the correct port
const findServerPort = async () => {
    const BASE_PORT = 5050;
    const MAX_PORT_ATTEMPTS = 10;

    for (let port = BASE_PORT; port < BASE_PORT + MAX_PORT_ATTEMPTS; port++) {
        try {
            const response = await fetch(`http://localhost:${port}/api/users`);
            if (response.ok || response.status === 401) { // 401 means server is running but requires auth
                return port;
            }
        } catch (error) {
            continue;
        }
    }
    throw new Error('Server not found on any port');
};

let API_URL = 'http://localhost:5050/api';

const api = axios.create({
    baseURL: API_URL,
});

// Update baseURL if server is running on a different port
findServerPort().then(port => {
    API_URL = `http://localhost:${port}/api`;
    api.defaults.baseURL = API_URL;
}).catch(error => {
    console.error('Server connection error:', error);
});

// Add request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject('Failed to connect to the server');
});

// Add response interceptor
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.code === 'ECONNABORTED') {
        return Promise.reject('Request timed out. Please check your connection.');
    }
    if (!error.response) {
        return Promise.reject('Network error. Please check your internet connection.');
    }
    if (error.response.status === 404) {
        return Promise.reject('The requested resource was not found.');
    }
    if (error.response.status === 500) {
        return Promise.reject('Internal server error. Please try again later.');
    }
    return Promise.reject(error.response.data || 'An error occurred');
});

const handleError = (error) => {
    if (error.response && error.response.data) {
        throw typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message || 'An error occurred';
    }
    throw error.message || 'Network error occurred';
};

export const login = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const getAllProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const addProduct = async (productData) => {
    try {
        const response = await api.post('/products/add', productData);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`/products/update/${id}`, productData);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/products/delete/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
