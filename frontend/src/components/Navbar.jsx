import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Globe, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout, changeLanguage } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageToggle = (lang) => {
    changeLanguage(lang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge-red-light border border-red-200 text-xs px-2 py-0.5 rounded font-bold font-heading">{t('roles.admin')}</span>;
      case 'manager':
        return <span className="badge-red-light border border-red-200 text-xs px-2 py-0.5 rounded font-bold font-heading">{t('roles.manager')}</span>;
      case 'staff':
        return <span className="badge-red-light border border-red-200 text-xs px-2 py-0.5 rounded font-bold font-heading">{t('roles.staff')}</span>;
      default:
        return <span className="badge-red-light border border-red-200 text-xs px-2 py-0.5 rounded font-bold font-heading">{t('roles.farmer')}</span>;
    }
  };

  return (
    <header className="bg-white border-b border-gov-border sticky top-0 z-50 nav-shadow-divider font-body">
      {/* Top Official Government Banner */}
      <div className="bg-gov-gray border-b border-gov-border text-gov-muted px-4 py-1.5 text-xs flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gov-red">🇮🇳 {t('ministry_title')}</span>
          <span className="hidden sm:inline text-gov-border">|</span>
          <span className="hidden sm:inline">{t('department_title')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-gov-border text-xs shadow-2xs relative">
            <Globe className="w-3.5 h-3.5 text-gov-red ml-1" />
            <button
              onClick={() => handleLanguageToggle('hi')}
              className={`px-3 py-1 rounded-lg font-heading transition-all duration-200 ${
                i18n.language?.startsWith('hi')
                  ? 'bg-red-100 border border-red-300 text-[#c62828] font-black shadow-2xs'
                  : 'text-slate-900 font-bold hover:text-[#c62828] hover:bg-slate-100'
              }`}
            >
              हिन्दी
            </button>
            <span className="text-slate-400 font-bold">/</span>
            <button
              onClick={() => handleLanguageToggle('en')}
              className={`px-3 py-1 rounded-lg font-heading transition-all duration-200 ${
                !i18n.language?.startsWith('hi')
                  ? 'bg-red-100 border border-red-300 text-[#c62828] font-black shadow-2xs'
                  : 'text-slate-900 font-bold hover:text-[#c62828] hover:bg-slate-100'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gov-red rounded-xl flex items-center justify-center font-bold text-white shadow-xs group-hover:bg-gov-red-hover group-hover:scale-105 transition-all">
              🌾
            </div>
            <div>
              <span className="text-xl font-bold font-heading tracking-tight text-gov-text block leading-tight">
                {t('app_name')}
              </span>
              <span className="text-xs text-gov-muted block font-medium">
                National Procurement & Live Queue Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 font-heading">
            <Link
              to="/"
              className={`text-sm font-semibold transition-all relative py-1.5 ${location.pathname === '/' ? 'text-gov-red font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-gov-red after:rounded-full' : 'text-gov-text hover:text-gov-red'}`}
            >
              {t('nav.home')}
            </Link>


            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-semibold transition-all relative py-1.5 ${location.pathname.startsWith('/dashboard') ? 'text-gov-red font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-gov-red after:rounded-full' : 'text-gov-text hover:text-gov-red'}`}
                >
                  {t('nav.dashboard')}
                </Link>
                <div className="flex items-center space-x-3 bg-gov-gray px-3.5 py-1.5 rounded-xl border border-gov-border shadow-xs">
                  <User className="w-4 h-4 text-gov-red" />
                  <div className="text-left font-body">
                    <div className="text-xs font-bold text-gov-text leading-none">{user.name}</div>
                    <div className="mt-0.5">{getRoleBadge(user.role)}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title={t('nav.logout')}
                    className="p-1 text-gov-muted hover:text-gov-red transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 font-heading">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gov-text hover:text-gov-red px-3 py-2 rounded-md transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold btn-primary-red px-4 py-2 rounded-lg font-heading shadow-xs"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gov-text hover:bg-gov-gray"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gov-border px-4 pt-2 pb-4 space-y-3 font-heading animate-fade-in-up">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-gov-text hover:bg-gov-gray"
          >
            {t('nav.home')}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-semibold text-gov-red hover:bg-gov-gray"
              >
                {t('nav.dashboard')} ({user.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-semibold text-gov-red hover:bg-gov-gray"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-gov-border flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-md text-base font-semibold bg-gov-gray text-gov-text"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-md text-base font-semibold btn-primary-red"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
