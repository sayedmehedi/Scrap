import React from 'react';

export const AuthContext = React.createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export default function AuthProvider({children}) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
