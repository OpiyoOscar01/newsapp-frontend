import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateAuth } from '../../features/authentication/store/slices/authSlice';
import VisitorAnalyticsTracker from './Admin/VisitorAnalyticsTracker';
// import VisitorAnalyticsDebugPanel from './Admin/VisitorAnalyticsDebugPanel';


interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return (
    <>
      <VisitorAnalyticsTracker />
      {children}
      {/* <VisitorAnalyticsDebugPanel /> */}
    </>
  );
};

export default AppInitializer;
