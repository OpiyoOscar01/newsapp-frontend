import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './news/routes/AppRoutes';
import './App.css';

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
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* <AppInitializer>   */}
        <div className="App">
          <AppRoutes />
        </div>
        {/* </AppInitializer> */}
      </Router>
    </QueryClientProvider>
  );
}

export default App;