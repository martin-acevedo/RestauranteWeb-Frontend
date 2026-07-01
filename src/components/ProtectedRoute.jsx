import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../store/auth-context";

function ProtectedRoute({ children, allowedRoles }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles) {
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (e) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }
    const rol = decoded?.sub.split("#")[2];

    const validSystemRoles = ["ROLE_ADMIN", "ROLE_USER"];
    if (!validSystemRoles.includes(rol)) {
      localStorage.removeItem("token");
      // Force reload to clean context state
      window.location.href = "/";
      return null;
    }

    if (!allowedRoles.includes(rol)) {
      return <Navigate to="/no-autorizado" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
