import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // prevents flash of login on refresh

  // Rehydrate from localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem('parkingUser');
    const storedToken = localStorage.getItem('parkingToken');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const result = await loginUser(username, password);
      const userData = {
        id: result.user.id,
        username: result.user.username,
        name: result.user.full_name || result.user.username,
        role: result.user.role,
      };
      localStorage.setItem('parkingToken', result.token);
      localStorage.setItem('parkingUser', JSON.stringify(userData));
      setUser(userData);
      return { success: true, role: result.user.role };
    } catch (err) {
      return { success: false, error: err?.data?.error || 'Invalid credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('parkingToken');
    localStorage.removeItem('parkingUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
