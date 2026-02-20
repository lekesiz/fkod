import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      set({ token: data.token, user: data.user, isLoading: false });
      localStorage.setItem('token', data.token);
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  register: async (email, name, password, age, archetypeCode) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, age, archetypeCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      set({ token: data.token, user: data.user, isLoading: false });
      localStorage.setItem('token', data.token);
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
  },

  fetchUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    set({ isLoading: true });
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      if (!response.ok) throw new Error(user.error);
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false, token: null });
      localStorage.removeItem('token');
    }
  },
}));
