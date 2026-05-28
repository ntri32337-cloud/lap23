  // src/components/Auth/AuthProvider.jsx
  import { createContext, useContext, useState } from "react";

  const AuthContext = createContext(null);

  export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("currentUser"));
      } catch {
        return null;
      }
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
      return !!localStorage.getItem("currentUser");
    });

    const hasPermission = (permission) => {
      return currentUser?.permissions?.includes(permission);
    };

    // ✅ login(user, token)
  const login = (user, token) => {

  localStorage.setItem("currentUser", JSON.stringify(user));

  // 🔥 THÊM DÒNG NÀY
  localStorage.setItem("userId", user._id);

  if (token) localStorage.setItem("token", token);

  setCurrentUser(user);
  setIsAuthenticated(true);
};
    const logout = () => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      setCurrentUser(null);
      setIsAuthenticated(false);
    };

    return (
      <AuthContext.Provider value={{ currentUser, isAuthenticated, hasPermission, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export const useAuth = () => useContext(AuthContext);