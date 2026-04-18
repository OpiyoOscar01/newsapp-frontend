// src/App.tsx
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import AppRoutes from './news/routes/AppRoutes';
import './App.css';
import AppInitializer from './news/components/AppInitializer';
import { setAxiosStore } from './news/api/axiosConfig';

// Set the store reference for axios BEFORE any API calls
setAxiosStore(store);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={<div>Loading...</div>} 
        persistor={persistor}
        onBeforeLift={() => {
          // After rehydration, ensure axios has the latest token
          const state = store.getState();
          const token = state.auth?.accessToken;
          if (token) {
            import('./news/api/axiosConfig').then(({ default: axiosInstance }) => {
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            });
          }
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Router>
            <AppInitializer>
              <div className="App">
                <AppRoutes />
              </div>
            </AppInitializer>
          </Router>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;