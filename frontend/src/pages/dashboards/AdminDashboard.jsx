import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Building2, Users, Scale, Landmark, Plus, PieChart } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Centre Modal State
  const [showCentreModal, setShowCentreModal] = useState(false);
  const [centreForm, setCentreForm] = useState({
    name: '',
    code: '',
    state: 'Haryana',
    district: '',
    address: '',
    dailyCapacityQuintals: 800,
  });
  const [centreMsg, setCentreMsg] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resAnalytics, resCentres] = await Promise.all([
        axios.get('/api/analytics'),
        axios.get('/api/centres'),
      ]);
      setAnalytics(resAnalytics.data);
      setCentres(resCentres.data.centres || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateCentre = async (e) => {
    e.preventDefault();
    setCentreMsg('');

    try {
      await axios.post('/api/centres', {
        ...centreForm,
        supportedCrops: ['Wheat', 'Paddy', 'Mustard', 'Chana'],
      });
      setCentreMsg('New procurement centre registered successfully!');
      fetchAdminData();
      setTimeout(() => {
        setShowCentreModal(false);
        setCentreMsg('');
      }, 1500);
    } catch (err) {
      setCentreMsg(err.response?.data?.message || 'Failed to create centre');
    }
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 my-8 font-body text-gov-text bg-white pb-16 animate-fade-in-up">
      {/* Admin Command Header */}
      <div className="relative bg-gradient-to-br from-white via-red-50/20 to-[#FDF6F6] border-2 border-gov-red text-gov-text p-6 sm:p-8 rounded-2xl hero-container-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 overflow-hidden">
        {/* Soft Decorative Blurred Red Circle */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-200/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative">
          <span className="text-xs uppercase tracking-wider text-gov-red font-bold font-heading">{t('roles.admin')} Portal</span>
          <h1 className="text-2xl font-bold font-heading text-gov-text mt-0.5">{user.name}</h1>
          <p className="text-xs text-gov-muted">
            Ministry of Consumer Affairs, Food & Public Distribution • Directorate of Procurement
          </p>
        </div>

        <button
          onClick={() => setShowCentreModal(true)}
          className="relative px-5 py-3 btn-primary-red font-bold font-heading text-xs rounded-lg shadow-xs transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Register New Procurement Centre</span>
        </button>
      </div>

      {/* Aggregate Statistics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-heading">
          <div className="bg-white p-6 rounded-xl border border-gov-border card-hover-elevate space-y-2 border-l-4 border-l-gov-red">
            <div className="flex justify-between items-center text-gov-muted">
              <span className="text-xs font-semibold">{t('admin.total_centres')}</span>
              <Building2 className="w-5 h-5 text-gov-red" />
            </div>
            <div className="text-3xl font-bold text-gov-text mt-1">{analytics.summary?.totalCentresCount}</div>
            <div className="text-[10px] text-gov-muted font-body">Across Haryana, Punjab & MP</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gov-border card-hover-elevate space-y-2 border-l-4 border-l-gov-red">
            <div className="flex justify-between items-center text-gov-muted">
              <span className="text-xs font-semibold">{t('admin.total_farmers')}</span>
              <Users className="w-5 h-5 text-gov-red" />
            </div>
            <div className="text-3xl font-bold text-gov-text mt-1">{analytics.summary?.totalFarmersCount}</div>
            <div className="text-[10px] text-gov-muted font-body">Registered with DBT Bank accounts</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gov-border card-hover-elevate space-y-2 border-l-4 border-l-gov-red">
            <div className="flex justify-between items-center text-gov-muted">
              <span className="text-xs font-semibold">{t('admin.procurement_volume')}</span>
              <Scale className="w-5 h-5 text-gov-red" />
            </div>
            <div className="text-3xl font-bold text-gov-text mt-1">{analytics.summary?.totalProcurementQuintals} <span className="text-sm font-semibold">Qtl</span></div>
            <div className="text-[10px] text-gov-muted font-body">Avg Moisture: {analytics.summary?.averageMoisturePercentage}%</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gov-border card-hover-elevate space-y-2 border-l-4 border-l-gov-green">
            <div className="flex justify-between items-center text-gov-muted">
              <span className="text-xs font-semibold">{t('admin.disbursed_value')}</span>
              <Landmark className="w-5 h-5 text-gov-green" />
            </div>
            <div className="text-2xl font-bold text-gov-green mt-1">₹{analytics.summary?.totalProcurementValueRs?.toLocaleString()}</div>
            <div className="text-[10px] text-gov-muted font-body">Direct Benefit Transfer</div>
          </div>
        </div>
      )}

      {/* Quality Grade Breakdown & Centres Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quality Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
          <h2 className="text-base font-bold font-heading text-gov-text flex items-center space-x-2 border-b border-gov-border pb-3">
            <PieChart className="w-5 h-5 text-gov-red" />
            <span>{t('admin.quality_report')}</span>
          </h2>

          <div className="space-y-3">
            {analytics?.gradeDistribution?.map((g) => (
              <div key={g._id} className="p-3.5 bg-gov-gray rounded-xl border border-gov-border flex justify-between items-center transition-all hover:border-gov-red">
                <div>
                  <div className="text-xs font-bold font-heading text-gov-text">{g._id}</div>
                  <div className="text-[10px] text-gov-muted">{g.totalQty} Quintals Total</div>
                </div>
                <span className="text-xs font-bold badge-red-light border border-red-200 px-2.5 py-1 rounded-full">
                  {g.count} Inspections
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Centres Registry List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
          <h2 className="text-base font-bold font-heading text-gov-text flex items-center space-x-2 border-b border-gov-border pb-3">
            <Building2 className="w-5 h-5 text-gov-red" />
            <span>{t('admin.manage_centres')}</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gov-text">
              <thead className="bg-gov-gray text-gov-text font-bold font-heading uppercase text-[10px] border-b border-gov-border">
                <tr>
                  <th className="p-3">Centre Code & Name</th>
                  <th className="p-3">State & District</th>
                  <th className="p-3">Daily Capacity</th>
                  <th className="p-3">Supported Crops</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {centres.map((c) => (
                  <tr key={c._id} className="hover:bg-gov-gray transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-gov-text">{c.name}</div>
                      <div className="font-mono text-[10px] text-gov-red">{c.code}</div>
                    </td>
                    <td className="p-3 font-semibold">{c.district}, {c.state}</td>
                    <td className="p-3 font-mono font-bold text-gov-text">{c.dailyCapacityQuintals} Qtl</td>
                    <td className="p-3 text-[10px]">{c.supportedCrops?.join(', ')}</td>
                    <td className="p-3">
                      <span className="badge-green-light border border-green-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Centre Modal */}
      {showCentreModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gov-border animate-fade-in-up">
            <div className="bg-white border-b-2 border-gov-red p-5 flex justify-between items-center">
              <h3 className="font-bold font-heading text-base text-gov-text">Register Procurement Centre</h3>
              <button onClick={() => setShowCentreModal(false)} className="text-gov-muted hover:text-gov-text text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateCentre} className="p-6 space-y-4">
              {centreMsg && (
                <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-lg font-bold">
                  {centreMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Centre Name</label>
                <input
                  type="text"
                  required
                  value={centreForm.name}
                  onChange={(e) => setCentreForm({ ...centreForm, name: e.target.value })}
                  placeholder="e.g. Ambala Grain Procurement Hub"
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-xs text-gov-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">Centre Code</label>
                  <input
                    type="text"
                    required
                    value={centreForm.code}
                    onChange={(e) => setCentreForm({ ...centreForm, code: e.target.value.toUpperCase() })}
                    placeholder="AMB01"
                    className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-xs font-mono text-gov-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={centreForm.district}
                    onChange={(e) => setCentreForm({ ...centreForm, district: e.target.value })}
                    placeholder="Ambala"
                    className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-xs text-gov-text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={centreForm.address}
                  onChange={(e) => setCentreForm({ ...centreForm, address: e.target.value })}
                  placeholder="Mandis GT Road"
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-xs text-gov-text"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 font-heading">
                <button
                  type="button"
                  onClick={() => setShowCentreModal(false)}
                  className="px-4 py-2.5 bg-white border border-gov-border text-gov-muted hover:text-gov-text text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 btn-primary-red font-bold text-xs rounded-lg shadow-xs transition-all"
                >
                  Create Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
