// src/constants/routes.ts

export const ROUTES = {
  // Public Routes
  HOME: '/',
  CATEGORY: '/category/:categorySlug',
  ARTICLE: '/article/:articleSlug',  // Changed from :articleId to :articleSlug
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
  buildArticleRoute: (articleSlug: string) => `/article/${articleSlug}`,  // Changed parameter
  buildAdminRoute: (path: string) => `/admin/${path}`,
} as const;