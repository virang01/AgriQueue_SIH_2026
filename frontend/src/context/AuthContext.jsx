import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import i18n from '../i18n';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agriqueue_token') || null);
  const [loading, setLoading] = useState(true);

  // Set default axios header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/profile');
          const userData = res.data.data?.user || res.data.user;
          setUser(userData);
          if (userData?.preferredLanguage) {
            i18n.changeLanguage(userData.preferredLanguage);
            localStorage.setItem('agriqueue_lang', userData.preferredLanguage);
          }
        } catch (err) {
          console.error('Failed to load user profile:', err.response?.data?.message || err.message);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (phone, password) => {
    localStorage.removeItem('agriqueue_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);

    const res = await axios.post('/api/auth/login', { phone, password });
    const newToken = res.data.data?.token || res.data.token;
    const userData = res.data.data?.user || res.data.user;

    if (!newToken || !userData) {
      throw new Error('Invalid authentication response from server');
    }

    localStorage.setItem('agriqueue_token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    
    if (userData.preferredLanguage) {
      i18n.changeLanguage(userData.preferredLanguage);
      localStorage.setItem('agriqueue_lang', userData.preferredLanguage);
    }
    return userData;
  };

  const register = async (formData) => {
    localStorage.removeItem('agriqueue_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);

    const res = await axios.post('/api/auth/register', formData);
    const newToken = res.data.data?.token || res.data.token;
    const userData = res.data.data?.user || res.data.user;

    if (!newToken || !userData) {
      throw new Error('Invalid registration response from server');
    }

    localStorage.setItem('agriqueue_token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    if (userData.preferredLanguage) {
      i18n.changeLanguage(userData.preferredLanguage);
      localStorage.setItem('agriqueue_lang', userData.preferredLanguage);
    }
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('agriqueue_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('agriqueue_lang', lang);
    if (user) {
      axios.put('/api/auth/profile', { preferredLanguage: lang }).catch(() => {});
      setUser((prev) => ({ ...prev, preferredLanguage: lang }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        changeLanguage,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
