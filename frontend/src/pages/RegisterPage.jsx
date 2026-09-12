import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import logoIcon from '../assets/logo-icon.png';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    preferredLanguage: 'hi',
    village: '',
    district: '',
    state: 'Haryana',
    landAreaAcres: '',
    aadhaarNumber: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: 'farmer',
        preferredLanguage: formData.preferredLanguage,
        farmerDetails: {
          village: formData.village,
          district: formData.district,
          state: formData.state,
          landAreaAcres: Number(formData.landAreaAcres),
          aadhaarNumber: formData.aadhaarNumber,
          bankDetails: {
            accountName: formData.name,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            bankName: formData.bankName,
          },
        },
      });
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 px-4 font-body text-gov-text bg-white animate-fade-in-up">
      <div className="bg-white rounded-2xl border border-gov-border hero-container-shadow overflow-hidden border-t-4 border-t-gov-red">
        {/* Header Branding */}
        <div className="bg-gradient-to-br from-white via-red-50/20 to-[#FDF6F6] p-7 text-center space-y-2 border-b border-gov-border relative overflow-hidden">
          <img src={logoIcon} alt="AgriQueue logo" className="w-14 h-14 object-contain mx-auto" />
          <div>
            <div className="text-xl font-black font-heading tracking-tight leading-tight">
              <span className="text-emerald-800">Agri</span><span className="text-gov-red">Queue</span>
            </div>
            <h2 className="text-base font-bold font-heading text-gov-text mt-0.5">{t('auth.register_title')}</h2>
          </div>
          <p className="text-xs text-gov-muted">Department of Consumer Affairs • Direct Procurement Portal</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="p-7 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-gov-red text-xs rounded-lg font-semibold">
              {error}
            </div>
          )}

          {/* 1. Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-gov-text border-b border-gov-border pb-1.5">
              1. Personal & Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.full_name')} *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rameshwar Kumar"
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.phone')} *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.password')} *</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.preferred_lang')} *</label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm font-semibold text-gov-red focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none font-heading transition-all duration-150"
                >
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="en">English</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Location & Land Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-gov-text border-b border-gov-border pb-1.5">
              2. Location & Land Holding Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.state')} *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
                >
                  <option value="Haryana">Haryana</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.district')} *</label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g. Karnal"
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.village')}</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="e.g. Kachhwa"
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-gov-text mb-1">{t('auth.land_area')}</label>
                <input
                  type="number"
                  name="landAreaAcres"
                  step="0.1"
                  value={formData.landAreaAcres}
                  onChange={handleChange}
                  placeholder="Total land holding in acres (e.g. 5.5)"
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
                />
              </div>
            </div>
          </div>

          {/* 3. Bank Account Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-gov-text border-b border-gov-border pb-1.5">
              3. Bank Account for DBT Payment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="e.g. State Bank of India"
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Bank Account No."
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="e.g. SBIN0001234"
                  className="w-full px-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:border-gov-red focus:outline-none transition-all duration-150"
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 btn-primary-red font-bold font-heading text-sm rounded-lg shadow-xs transition-colors"
          >
            {loading ? 'Registering Account...' : t('auth.register_btn')}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-gov-muted">Already registered? </span>
            <Link to="/login" className="text-xs font-bold font-heading text-gov-red hover:underline">
              {t('auth.login_title')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
