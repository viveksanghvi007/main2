import React from 'react'
import { Toaster } from "react-hot-toast";
import UserProvider from './context/userContext';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <UserProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '10px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          loading: {
            style: {
              background: '#3b82f6',
              color: '#fff',
            },
          },
        }}
      />
        </div>
      </UserProvider>
  )
}

export default App
