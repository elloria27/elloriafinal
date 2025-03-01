
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { PagesProvider } from './contexts/PagesContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/toaster';
import { ScrollToTop } from './components/ScrollToTop';
import Install from './pages/Install';
import { Routes as AppRoutes } from './routes';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <AppContent />
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

// Separate component to access location
const AppContent = () => {
  const location = useLocation();
  const isInstallPage = location.pathname === '/install';

  if (isInstallPage) {
    return (
      <>
        <Install />
        <Toaster />
      </>
    );
  }

  return (
    <PagesProvider>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          {/* We need to include the install route here as well to handle direct navigation */}
          <Route path="/install" element={<Install />} />
          {/* Include all other routes */}
          <AppRoutes />
        </Routes>
        <Toaster />
      </CartProvider>
    </PagesProvider>
  );
};

export default App;
