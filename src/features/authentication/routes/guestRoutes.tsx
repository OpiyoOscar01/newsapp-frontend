import type { RouteObject } from "react-router-dom";
import HomeLayout from "../../public/components/layouts/HomeLayout";
import Home from "../../public/pages/Home";
import Technology from "../../public/pages/Technology";
import Sports from "../../public/pages/Sports";
import Politics from "../../public/pages/Politics";
import Business from "../../public/pages/Business"; // Added missing import

/**
 * Guest routes configuration for public access
 * Defines the routing structure for non-authenticated users
 */
export const guestRoutes: RouteObject = {
  path: "/",
  element: <HomeLayout />,
  children: [
    { 
      index: true, 
      element: <Home />,
      handle: {
        crumb: () => "Home"
      }
    },
    { 
      path: "technology", 
      element: <Technology />,
      handle: {
        crumb: () => "Technology"
      }
    },
    { 
      path: "sports", 
      element: <Sports />,
      handle: {
        crumb: () => "Sports"
      }
    },
    { 
      path: "politics", 
      element: <Politics />,
      handle: {
        crumb: () => "Politics"
      }
    },
    { 
      path: "business", 
      element: <Business />,
      handle: {
        crumb: () => "Business"
      }
    },
  ],
};

/**
 * Type definition for route paths
 */
export type RoutePath = "/" | "/technology" | "/sports" | "/politics" | "/business";
