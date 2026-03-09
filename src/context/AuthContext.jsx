import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, usersApi, getToken, setToken } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      let token;
      try {
        token = getToken();
      } catch {
        setLoading(false);
        return;
      }
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const u = await usersApi.me();
        if (!cancelled) setUser(u);
      } catch {
        setToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user: u } = await authApi.login(email, password);
      setToken(token);
      setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const registerRequestCode = async (data) => {
    try {
      await authApi.registerRequestCode(data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const registerVerifyCode = async (data) => {
    try {
      const { token, user: u } = await authApi.verifyRegisterCode(data);
      setToken(token);
      setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="spinner-border text-primary mb-2" role="status" />
      <p className="text-muted mb-0">Loading...</p>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, registerRequestCode, registerVerifyCode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
