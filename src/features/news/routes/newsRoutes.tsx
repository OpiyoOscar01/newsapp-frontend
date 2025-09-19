import type { RouteObject } from "react-router-dom";
import HomeLayout from "../../public/components/layouts/HomeLayout";
import NewsCardDemo from "../pages/NewsCardDemo";

/**
 * News routes configuration for public access
 * Defines the routing structure for non-authenticated users
 */
export const newsRoutes: RouteObject = {
  path: "/",
  element: <HomeLayout />,
  children: [
    { 
      path: "news", 
      element: <NewsCardDemo />,
      handle: {
        crumb: () => "News"
      }
    },
  ],
};

/**
 * Type definition for route paths
 */
export type RoutePath = "/" | "/news";
