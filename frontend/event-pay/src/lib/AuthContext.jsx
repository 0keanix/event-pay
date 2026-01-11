import { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Простая заглушка — авторизация не нужна
  return (
      <AuthContext.Provider value={{ user: null }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);