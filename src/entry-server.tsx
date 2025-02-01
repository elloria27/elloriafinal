import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

export function render(url: string) {
  const helmetContext = {};
  const queryClient = new QueryClient();
  
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );

  return { html, helmetContext };
}