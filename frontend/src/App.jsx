import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationBanner from './components/NotificationBanner';
import HomePage from './pages/HomePage';
import LiveQueuePage from './pages/LiveQueuePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookSlot from './pages/BookSlot';
import ProcurementHistory from './pages/ProcurementHistory';
import GovtAdminDashboard from './pages/dashboards/GovtAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <NotificationBanner />
      <main className="flex-grow">
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/live-queue" element={<LiveQueuePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-slot"
            element={
              <ProtectedRoute>
                <BookSlot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/procurement-history"
            element={
              <ProtectedRoute>
                <ProcurementHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/govt-admin"
            element={
              <ProtectedRoute>
                <GovtAdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;
