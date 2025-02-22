
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from '@/pages/NotFound'
import Setup from '@/pages/Setup'

// Create a client
const queryClient = new QueryClient()
const helmetContext = {}

const router = createBrowserRouter([
  {
    path: "*",
    element: <App location={window.location} />,
    children: [
      {
        path: "/",
        element: <div className="p-8">Welcome to the app!</div>,
        errorElement: <NotFound />,
      },
      {
        path: "/setup",
        element: <Setup />,
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
)
