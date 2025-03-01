
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { PagesProvider } from './contexts/PagesContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/toaster';
import { ScrollToTop } from './components/ScrollToTop';
import { Routes as AppRoutes } from './routes';
import Install from './pages/Install';
import './App.css';

// Create a client
const queryClient = new QueryClient();

// Custom router component that conditionally renders Install or Main App
const AppRouter = () => {
  const location = useLocation();
  const isInstallPage = location.pathname === '/install';

  if (isInstallPage) {
    return (
      <>
        <Routes>
          <Route path="/install" element={<Install />} />
        </Routes>
        <Toaster />
      </>
    );
  }

  return (
    <PagesProvider>
      <CartProvider>
        <ScrollToTop />
        <AppRoutes />
        <Toaster />
      </CartProvider>
    </PagesProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <AppRouter />
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
