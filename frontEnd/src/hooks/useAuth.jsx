import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on initial load
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      checkAuth();
    } else {
      setLoading(false); // No token means not authenticated
    }
  }, []);

  const register = useCallback(async (email, name, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        { email, name, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Save the token in cookies for persistence
        Cookies.set("token", response.data.accessToken, { expires: 7 }); // Token valid for 7 days

        setIsAuthenticated(true);
        setUser(response.data.user); // Assuming user data is returned
        return { success: true };
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        // Save the token in cookies for persistence
        Cookies.set("token", response.data.accessToken, { expires: 7 });

        setIsAuthenticated(true);
        setUser(response.data.user); // Assuming user data is returned
        checkAuth();
        return { success: true };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    Cookies.remove("token");

    // Update authentication state
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");
      if (token) {
        const response = await axios.get("http://localhost:3000/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setIsAuthenticated(response.data.authenticated);
        setUser(response.data.user || null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth,
    register,
  };
};

export default useAuth;
