import type { RouteObject } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const authRoutes: RouteObject = {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
  ],
};

