// src/constants/routes.ts

export const ROUTES = {
  // Public Routes
  HOME: '/',
  CATEGORY: '/category/:categorySlug',
  ARTICLE: '/article/:articleId',
  SEARCH: '/search',
  
  // Public Pages
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  ADVERTISE: '/advertise',
  NEWSLETTER: '/newsletter',
  
  // Auth Routes
  REGISTER: '/register',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ARTICLES: '/admin/articles',
  ADMIN_USERS: '/admin/users',
  
  // Dynamic Route Builders
  buildCategoryRoute: (categorySlug: string) => `/category/${categorySlug}`,
  buildArticleRoute: (articleId: string) => `/article/${articleId}`,
  buildAdminRoute: (path: string) => `/admin/${path}`,
} as const;

// Type for route values
export type RouteValue = typeof ROUTES[keyof typeof ROUTES];