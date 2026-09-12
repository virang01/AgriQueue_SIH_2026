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
              className={`px-3 py-1 font-heading transition-all duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gov-red after:rounded-full after:transition-all after:duration-300 ${i18n.language?.startsWith('hi')
                  ? 'text-[#c62828] font-black after:w-full'
                  : 'text-slate-900 font-bold hover:text-[#c62828] after:w-0 hover:after:w-full'
                }`}
            >
              हिन्दी
            </button>
            <span className="text-slate-400 font-bold">/</span>
            <button
              onClick={() => handleLanguageToggle('en')}
              className={`px-3 py-1 font-heading transition-all duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gov-red after:rounded-full after:transition-all after:duration-300 ${!i18n.language?.startsWith('hi')
                  ? 'text-[#c62828] font-black after:w-full'
                  : 'text-slate-900 font-bold hover:text-[#c62828] after:w-0 hover:after:w-full'
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
            {(() => {
              const getNavLinkClass = (path, isDashboard = false) => {
                const isActive = isDashboard
                  ? location.pathname.startsWith('/dashboard')
                  : location.pathname === path;

                const base = "text-sm font-semibold relative py-1.5 transition-all after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:bg-gov-red after:rounded-full after:transition-all after:duration-300";

                return isActive
                  ? `${base} text-gov-red font-bold after:w-full`
                  : `${base} text-gov-text hover:text-gov-red after:w-0 hover:after:w-full`;
              };

              return (
                <>
                  <Link
                    to="/"
                    className={getNavLinkClass('/')}
                  >
                    {t('nav.home')}
                  </Link>

                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        className={getNavLinkClass('/dashboard', true)}
                      >
                        {t('nav.dashboard')}
                      </Link>
                      <div className="flex items-center ml-4 bg-red-50/60 px-3 py-1.5 rounded-xl border border-gov-border border-l-2 border-l-gov-red shadow-sm font-body">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-white border border-gov-red/30 flex items-center justify-center font-bold text-xs text-gov-red font-heading flex-shrink-0 shadow-2xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-gov-red" />}
                        </div>

                        {/* Name & Role Badge inline */}
                        <div className="flex items-center ml-2.5">
                          <span className="text-sm font-bold text-gov-text whitespace-nowrap">{user.name}</span>
                          <span className="ml-2 inline-flex items-center">{getRoleBadge(user.role)}</span>
                        </div>

                        {/* Vertical Divider */}
                        <div className="h-6 w-px bg-gov-border mx-3 flex-shrink-0" />

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          title={t('nav.logout')}
                          className="p-1 text-gov-muted hover:text-gov-red transition-colors flex items-center justify-center flex-shrink-0"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center space-x-6 font-heading">
                      <Link
                        to="/login"
                        className={getNavLinkClass('/login')}
                      >
                        {t('nav.login')}
                      </Link>
                      <Link
                        to="/register"
                        className={getNavLinkClass('/register')}
                      >
                        {t('nav.register')}
                      </Link>
                    </div>
                  )}
                </>
              );
            })()}
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
