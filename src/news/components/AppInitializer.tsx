// src/components/AppInitializer.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateAuth } from '../../features/authentication/store/slices/authSlice';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Hydrate auth state from localStorage on app initialization
    dispatch(hydrateAuth());
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;