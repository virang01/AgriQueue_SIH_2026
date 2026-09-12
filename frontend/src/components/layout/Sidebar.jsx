import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { roleMenus } from './menuConfig';
import { ShieldCheck, ChevronRight, X } from 'lucide-react';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const currentRole = user.role === 'govt_admin' ? 'admin' : user.role;
  const menuItems = roleMenus[currentRole] || roleMenus.farmer;

  const getRoleTitle = (role) => {
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

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-gov-border font-body">
      {/* Role Sub-Header */}
      <div className="p-4 border-b border-gov-border bg-gov-gray flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gov-red text-white flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-gov-red font-bold font-heading block">
              {getRoleTitle(user.role)} Portal
            </span>
            <span className="text-[11px] text-gov-muted truncate block max-w-[150px] font-medium">
              {user.name}
            </span>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-gov-muted hover:text-gov-text"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isDashboardRoot = item.path === '/dashboard';

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={isDashboardRoot}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading transition-all duration-150 focus:outline-none ${
                  isActive
                    ? 'bg-red-100/90 border border-red-300 text-gov-red font-bold shadow-2xs scale-[1.01]'
                    : 'text-slate-900 font-semibold bg-transparent hover:bg-slate-100 hover:text-gov-red active:bg-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-gov-red font-bold' : 'text-gov-red group-hover:text-gov-red'}`} />
                    <span className={`transition-colors ${isActive ? 'text-gov-red font-bold' : 'text-slate-900 group-hover:text-gov-red'}`}>
                      {t(item.labelKey)}
                    </span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-gov-red font-bold" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Official Bottom Footer */}
      <div className="p-3 border-t border-gov-border bg-gov-gray text-[10px] text-gov-muted text-center font-heading">
        <div>Department of Consumer Affairs</div>
        <div className="text-gov-red font-semibold">DCA ProcureNet v2.4</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 h-[calc(100vh-65px)] sticky top-[65px]">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-white z-10 animate-fade-in-up">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
