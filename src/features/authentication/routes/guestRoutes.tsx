import type { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
export const guestRoutes: RouteObject = {
  path: "/",
  element: <Home />,
};