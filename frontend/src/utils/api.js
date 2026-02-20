const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

export const getUsers = (limit = 10, offset = 0) =>
  apiCall(`/users?limit=${limit}&offset=${offset}`);

export const searchUsers = (query) =>
  apiCall(`/users/search?q=${query}`);

export const getUser = (id) =>
  apiCall(`/users/${id}`);

export const updateUser = (id, data) =>
  apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteUser = (id) =>
  apiCall(`/users/${id}`, { method: 'DELETE' });
