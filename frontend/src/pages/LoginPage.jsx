import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Phone, LogIn, Sparkles } from 'lucide-react';
import logoIcon from '../assets/logo-icon.png';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(phone, password);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check phone and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (demoPhone) => {
    setPhone(demoPhone);
    setPassword('password123');
    setError('');
    setLoading(true);
    try {
      await login(demoPhone, 'password123');
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 font-body text-gov-text bg-white animate-fade-in-up">
      <div className="bg-white rounded-2xl border border-gov-border hero-container-shadow overflow-hidden border-t-4 border-t-gov-red">
        {/* Header Branding */}
        <div className="bg-gradient-to-br from-white via-red-50/20 to-[#FDF6F6] p-7 text-center space-y-2 border-b border-gov-border relative overflow-hidden">
          <img src={logoIcon} alt="AgriQueue logo" className="w-14 h-14 object-contain mx-auto" />
          <div>
            <div className="text-xl font-black font-heading tracking-tight leading-tight">
              <span className="text-emerald-800">Agri</span><span className="text-gov-red">Queue</span>
            </div>
            <h1 className="text-base font-bold font-heading text-gov-text mt-0.5">{t('auth.login_title')}</h1>
          </div>
          <p className="text-xs text-gov-muted">Department of Consumer Affairs • Direct Procurement Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-gov-red text-xs rounded-lg font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.phone')} *</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gov-muted" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-10 pr-3 py-3 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.password')} *</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-gov-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-3 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 btn-primary-red font-bold font-heading text-sm rounded-lg shadow-xs flex items-center justify-center space-x-2 transition-colors"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span>{loading ? 'Logging in...' : t('auth.login_btn')}</span>
          </button>

          <div className="text-center pt-1">
            <span className="text-xs text-gov-muted">New farmer user? </span>
            <Link to="/register" className="text-xs font-bold font-heading text-gov-red hover:underline">
              {t('auth.register_title')}
            </Link>
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-4 border-t border-gov-border">
            <div className="flex items-center space-x-1.5 text-xs font-bold font-heading text-gov-text mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gov-red" />
              <span>Instant One-Click Role Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-heading">
              <button
                type="button"
                onClick={() => handleDemoFill('9876543211')}
                className="col-span-2 px-3 py-2 bg-gov-gray hover:bg-red-50 border border-gov-border hover:border-gov-red rounded-lg text-left transition-colors flex items-center justify-between"
              >
                <span className="font-semibold text-gov-text">🌾 Farmer (Suresh Patel)</span>
                <span className="text-[11px] text-gov-muted font-mono">9876543211</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('7777777777')}
                className="px-3 py-2 bg-gov-gray hover:bg-red-50 border border-gov-border hover:border-gov-red rounded-lg text-left transition-colors"
              >
                <div className="font-semibold text-gov-text">📋 Centre Staff</div>
                <div className="text-[10px] text-gov-muted font-mono">7777777777</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('8888888888')}
                className="px-3 py-2 bg-gov-gray hover:bg-red-50 border border-gov-border hover:border-gov-red rounded-lg text-left transition-colors"
              >
                <div className="font-semibold text-gov-text">🏢 Centre Manager</div>
                <div className="text-[10px] text-gov-muted font-mono">8888888888</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('9999999999')}
                className="col-span-2 px-3 py-2 bg-gov-gray hover:bg-red-50 border border-gov-border hover:border-gov-red rounded-lg text-left transition-colors flex items-center justify-between"
              >
                <span className="font-semibold text-gov-text">🏛️ Govt Admin (National)</span>
                <span className="text-[11px] text-gov-muted font-mono">9999999999</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
