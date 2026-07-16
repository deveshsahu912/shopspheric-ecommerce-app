import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Auth State from LocalStorage
  useEffect(() => {
    const checkLoggedIn = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          // Verify user still valid by hitting backend profile
          const { data } = await api.get('/api/auth/me');
          setUser({ ...parsedUser, ...data });
        } catch (error) {
          console.error('Invalid session or expired token');
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();

    // Initialize Dark Mode Preference
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.',
      };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try a different email.',
      };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout API failure', e);
    }
    setUser(null);
    localStorage.removeItem('userInfo');
    // Clear other data
    localStorage.removeItem('cart');
  };

  // Update Profile handler
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/api/users/profile', profileData);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      // Merge with token stored locally
      const localInfo = JSON.parse(localStorage.getItem('userInfo'));
      localStorage.setItem('userInfo', JSON.stringify({ ...localInfo, ...data }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile.',
      };
    }
  };

  // Change Password handler
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/api/users/password', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password.',
      };
    }
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const targetMode = !darkMode;
    setDarkMode(targetMode);
    localStorage.setItem('darkMode', targetMode.toString());
    if (targetMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        darkMode,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
