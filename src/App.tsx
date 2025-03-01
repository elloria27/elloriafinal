
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { PagesProvider } from './contexts/PagesContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/toaster';
import { ScrollToTop } from './components/ScrollToTop'; // Fixed: Use named import
import { Routes as AppRoutes } from './routes'; // Fixed: Import Routes as AppRoutes
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <CartProvider>
          <PagesProvider>
            <Router>
              <ScrollToTop />
              <AppRoutes /> {/* Use the imported AppRoutes component */}
              <Toaster />
            </Router>
          </PagesProvider>
        </CartProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
