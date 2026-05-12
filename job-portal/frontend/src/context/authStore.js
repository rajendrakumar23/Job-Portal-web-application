import { create } from 'zustand';
import api from '../utils/api.js';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  initialized: false,

  initialize: async () => {
    const token = localStorage.getItem('token');
    if (!token) return set({ initialized: true });
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, token, initialized: true });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, initialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token, loading: false });
    return data;
  },

  register: async (name, email, password) => {
    set({ loading: true });
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token, loading: false });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  updateUser: (user) => set({ user }),
}));

export default useAuthStore;
