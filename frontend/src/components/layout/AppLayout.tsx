import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Toaster } from 'react-hot-toast';

export const AppLayout: React.FC = () => (
  <div className="min-h-screen bg-surface-DEFAULT text-white">
    <Sidebar />
    <main className="ml-60 min-h-screen">
      <div className="p-8">
        <Outlet />
      </div>
    </main>
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#1a1d27', color: '#fff', border: '1px solid #252836' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
  </div>
);
