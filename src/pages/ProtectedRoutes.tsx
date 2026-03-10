import { Navigate, Outlet } from "react-router-dom";
import useCookie from "../hooks/useCookie";

const ProtectedRoutes = () => {
  const { getCookie } = useCookie("access_token");

  const isAuthenticated = () => {
    const token = getCookie();
    return !!token; // Return true if token exists, false otherwise
  };
  const isAuth = isAuthenticated();

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
