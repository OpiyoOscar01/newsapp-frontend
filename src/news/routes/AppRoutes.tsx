// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import LandingPage from '../pages/LandingPage';
import CategoryPage from '../pages/CategoryPage';
import ArticlePage from '../pages/ArticlePage';
import SearchPage from '../pages/SearchPage';
import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';
import TermsOfService from '../components/TermsOfService';
import PrivacyPolicy from '../components/PrivacyPolicy';
import AdvertiseWithUs from '../components/AdvertiseWithUs';
import Newsletter from '../components/NewsLetter';
import ScrollToTop from '../components/ScrollToTop';
import AdminDashboard from '../pages/AdminDashboard';
import UserLogin from '../pages/UserLogin';
import UserRegistration from '../pages/UserRegistration';
import { ROUTES } from './routes';
import NotFoundPage from '../pages/NotFoundPage';
const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with Layout */}
        <Route path={ROUTES.HOME} element={<Layout><LandingPage /></Layout>} />
        <Route path={ROUTES.CATEGORY} element={<Layout><CategoryPage /></Layout>} />
        <Route path={ROUTES.ARTICLE} element={<Layout><ArticlePage /></Layout>} />
        <Route path={ROUTES.SEARCH} element={<Layout><SearchPage /></Layout>} />
        
        {/* Public Pages with Layout */}
        <Route path={ROUTES.ABOUT} element={<Layout><AboutUs /></Layout>} />
        <Route path={ROUTES.CONTACT} element={<Layout><ContactUs /></Layout>} />
        <Route path={ROUTES.PRIVACY} element={<Layout><PrivacyPolicy /></Layout>} />
        <Route path={ROUTES.TERMS} element={<Layout><TermsOfService /></Layout>} />
        <Route path={ROUTES.ADVERTISE} element={<Layout><AdvertiseWithUs /></Layout>} />
        <Route path={ROUTES.NEWSLETTER} element={<Layout><Newsletter /></Layout>} />
        
        {/* Auth Routes */}
        <Route path={ROUTES.REGISTER} element={<Layout><UserRegistration /></Layout>} />
        <Route path={ROUTES.LOGIN} element={<Layout><UserLogin /></Layout>} />
        
        {/* Admin Routes (without main layout) */}
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        
        {/* 404 Page */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </>
  );
};

// 404 Not Found page


export default AppRoutes;