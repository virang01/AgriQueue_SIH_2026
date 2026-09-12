import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, User, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const DashboardLayout = ({ children, title, subtitle }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
      case 'govt_admin':
        return t('roles.admin');
      case 'manager':
        return t('roles.manager');
      case 'staff':
        return t('roles.staff');
      default:
        return t('roles.farmer');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50 font-body">
      {/* Role Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Bar */}
        <div className="bg-white border-b border-gov-border px-4 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-gov-text hover:bg-gov-gray rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-1.5 text-xs text-gov-muted font-heading">
                <span>AgriQueue Portal</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gov-red font-semibold">{getRoleLabel(user?.role)}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold font-heading text-gov-text mt-0.5 leading-tight">
                {title}
              </h1>
              {subtitle && <p className="text-xs text-gov-muted">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-gov-gray px-3 py-1.5 rounded-xl border border-gov-border text-xs">
              <User className="w-3.5 h-3.5 text-gov-red" />
              <span className="font-semibold text-gov-text">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Dynamic View Children */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
