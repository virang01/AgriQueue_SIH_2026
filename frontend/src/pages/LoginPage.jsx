import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Phone, LogIn, Sparkles } from 'lucide-react';

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
    <div className="max-w-md mx-auto my-14 px-4 font-body text-gov-text bg-white animate-fade-in-up">
      <div className="bg-white rounded-2xl border border-gov-border hero-container-shadow overflow-hidden border-t-4 border-t-gov-red">
        <div className="bg-gradient-to-br from-white via-red-50/20 to-[#FDF6F6] p-6 text-center space-y-1 border-b border-gov-border relative overflow-hidden">
          <div className="w-12 h-12 bg-gov-red rounded-xl mx-auto flex items-center justify-center text-xl shadow-xs text-white">
            🌾
          </div>
          <h2 className="text-xl font-bold font-heading text-gov-text">{t('auth.login_title')}</h2>
          <p className="text-xs text-gov-muted">Department of Consumer Affairs Procurement Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-gov-red text-xs rounded-lg font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.phone')} *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gov-muted absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-9 pr-3 py-3 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.password')} *</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gov-muted absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-3 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              />
            </div>
          </div>

          {/* Primary CTA: Solid Red #C62828, White Text #FFFFFF */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 btn-primary-red font-bold font-heading text-sm rounded-lg shadow-xs flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-white" />
                <span>{t('auth.login_btn')}</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-gov-muted">New farmer user? </span>
            <Link to="/register" className="text-xs font-bold font-heading text-gov-red hover:underline">
              {t('auth.register_title')}
            </Link>
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-6 border-t border-gov-border">
            <div className="flex items-center space-x-1 text-xs font-bold font-heading text-gov-text mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gov-red" />
              <span>Instant One-Click Role Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-heading">
              <button
                type="button"
                onClick={() => handleDemoFill('9876543211')}
                className="col-span-2 px-2.5 py-2 bg-gov-gray text-gov-text border border-gov-border rounded-lg font-semibold hover:border-gov-red hover:bg-[#FDECEA] text-left transition-all hover:shadow-xs flex items-center justify-between"
              >
                <div>🌾 Farmer</div>
                <div className="text-[10px] text-gov-muted font-normal">9876543211</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('7777777777')}
                className="px-2.5 py-2 bg-gov-gray text-gov-text border border-gov-border rounded-lg font-semibold hover:border-gov-red hover:bg-[#FDECEA] text-left transition-all hover:shadow-xs"
              >
                <div>📋 Centre Staff</div>
                <div className="text-[10px] text-gov-muted font-normal">7777777777</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('8888888888')}
                className="px-2.5 py-2 bg-gov-gray text-gov-text border border-gov-border rounded-lg font-semibold hover:border-gov-red hover:bg-[#FDECEA] text-left transition-all hover:shadow-xs"
              >
                <div>🏢 Centre Manager</div>
                <div className="text-[10px] text-gov-muted font-normal">8888888888</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('9999999999')}
                className="col-span-2 px-2.5 py-2 bg-gov-gray text-gov-text border border-gov-border rounded-lg font-semibold hover:border-gov-red hover:bg-[#FDECEA] text-center transition-all hover:shadow-xs"
              >
                🏛️ Govt Admin (National Command) - 9999999999
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
