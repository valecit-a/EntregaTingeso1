import { Navigate } from "react-router-dom";
import authService from "../services/auth.service";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = authService.isLoggedIn();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;