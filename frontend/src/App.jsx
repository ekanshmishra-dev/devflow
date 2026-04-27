import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthView from './views/AuthView';
import DashboardLayout from './views/DashboardLayout';
import ApiDocsView from './views/ApiDocsView';
import { FileText } from 'lucide-react';
import './index.css';

function MainApp() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <>
      <DashboardLayout />
      {/* Floating button to access docs from Dashboard */}
      <Link 
        to="/docs" 
        className="fixed bottom-6 right-6 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 pr-4 z-50"
      >
        <FileText className="w-5 h-5" />
        <span className="font-medium text-sm">API Docs</span>
      </Link>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/docs" element={<ApiDocsView />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
