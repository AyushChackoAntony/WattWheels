'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadUserSession = () => {
      try {
        const storedUser = localStorage.getItem('wattwheels_user');
        const storedUserType = localStorage.getItem('wattwheels_user_type');
        const storedToken = localStorage.getItem('wattwheels_token');
        
        if (storedUser && storedUserType && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setUserType(storedUserType);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    loadUserSession();
  }, []);

  const login = (userData, type, token) => {
    try {
      setUser(userData);
      setUserType(type);
      setIsAuthenticated(true);
      
      localStorage.setItem('wattwheels_user', JSON.stringify(userData));
      localStorage.setItem('wattwheels_user_type', type);
      localStorage.setItem('wattwheels_token', token);
    } catch (error) {
      console.error('Error storing user session:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('wattwheels_user');
    localStorage.removeItem('wattwheels_user_type');
    localStorage.removeItem('wattwheels_token');
  };

  const updateUser = (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('wattwheels_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating user session:', error);
    }
  };

  const value = {
    user,
    userType,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}