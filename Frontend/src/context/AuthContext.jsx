import { createContext, useContext, useState } from 'react';

// Mock user database
const USERS = [
  { id: '3201', password: '3201@bubt.edu', role: 'staff', name: 'Guard Desk 01', email: '3201@bubt.edu' },
  { id: 'admin', password: 'admin1234', role: 'superadmin', name: 'System Administrator', email: 'admin@unipark.edu' },
];

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (id, password) => {
    const found = USERS.find((u) => u.id === id && u.password === password);
    if (found) {
      setUser(found);
      return { success: true, role: found.role };
    }
    return { success: false };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
