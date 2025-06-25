import { useEffect, useState } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';
import { tokenRefresh } from '../services/apiServices';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem(ACCESS_TOKEN);
      const refresh = sessionStorage.getItem(REFRESH_TOKEN);

      if (!token || !refresh) {
        setIsAuthenticated(false);
        setIsAuthReady(true);
        return;
      }

      try {
        const { exp } = jwtDecode(token);
        const now = Date.now() / 1000;

        if (exp < now) {
          const res = await tokenRefresh({ refresh });
          if (res && res.status === 200) {
            sessionStorage.setItem(ACCESS_TOKEN, res.data.access);
            setIsAuthenticated(true);
          } else {
            sessionStorage.clear();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        sessionStorage.clear();
        setIsAuthenticated(false);
      }

      setIsAuthReady(true);
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isAuthReady };
};

export default useAuth;
