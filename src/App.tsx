import React, { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { store, persistor } from "./store";
import routes from "./routes";

// Loading fallback for Suspense
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <p className="text-gray-600">Loading...</p>
  </div>
);

// Wrapper component to use routes
const AppRoutes: React.FC = () => {
  const element = useRoutes(routes);
  return <Suspense fallback={<LoadingFallback />}>{element}</Suspense>;
};

// Main App
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <Router>
          <AppRoutes />
          {/* Global Toast */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: "#363636", color: "#fff" },
              success: { duration: 3000, iconTheme: { primary: "#4ade80", secondary: "#fff" } },
              error: { duration: 5000, iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
