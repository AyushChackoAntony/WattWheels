// src/context/AuthContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'customer' or 'owner'
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from localStorage on app start
  useEffect(() => {
    const loadUserSession = () => {
      try {
        const storedUser = localStorage.getItem('wattwheels_user');
        const storedUserType = localStorage.getItem('wattwheels_user_type');
        
        if (storedUser && storedUserType) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setUserType(storedUserType);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        // Clear corrupted data
        localStorage.removeItem('wattwheels_user');
        localStorage.removeItem('wattwheels_user_type');
      } finally {
        setLoading(false);
      }
    };

    loadUserSession();
  }, []);

  // Login function
  const login = (userData, type) => {
    try {
      setUser(userData);
      setUserType(type);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('wattwheels_user', JSON.stringify(userData));
      localStorage.setItem('wattwheels_user_type', type);
    } catch (error) {
      console.error('Error storing user session:', error);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('wattwheels_user');
    localStorage.removeItem('wattwheels_user_type');
  };

  // Update user data
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

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook for protected routes
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  return { isAuthenticated, loading };
}