import { Navigate, Outlet } from "react-router-dom";
const PrivateGuard = () => {
  const isAuthenticated = true; // Replace with your real logic
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default PrivateGuard;

/**
 * 
 * Demo usage:
 * {
  path: "/dashboard",
  element: <PrivateRoute />,
  children: [
    { path: "", element: <DashboardHome /> }
  ]
}

 */
