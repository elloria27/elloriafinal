
import axios from 'axios';

const API_URL = '/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  register: async (data: { email: string; password: string; full_name: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  resetPassword: async (email: string) => {
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
};

// Products endpoints
export const products = {
  list: async () => {
    const response = await api.get('/products');
    return response.data.products;
  },

  get: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  },

  create: async (data: any) => {
    const response = await api.post('/products', data);
    return response.data.product;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data.product;
  }
};

// Orders endpoints
export const orders = {
  list: async () => {
    const response = await api.get('/orders');
    return response.data.orders;
  },

  get: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.order;
  },

  create: async (data: any) => {
    const response = await api.post('/orders', data);
    return response.data.order;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data.order;
  }
};

// File upload endpoints
export const uploads = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.file;
  },

  get: async (id: string) => {
    const response = await api.get(`/uploads/${id}`);
    return response.data.file;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/uploads/${id}`);
    return response.data;
  }
};

// Admin endpoints
export const admin = {
  users: {
    list: async () => {
      const response = await api.get('/admin/users');
      return response.data.users;
    },

    create: async (data: any) => {
      const response = await api.post('/admin/users', data);
      return response.data.user;
    },

    update: async (id: string, data: any) => {
      const response = await api.put(`/admin/users/${id}`, data);
      return response.data.user;
    },

    delete: async (id: string) => {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    }
  }
};

export default {
  auth,
  products,
  orders,
  uploads,
  admin
};
