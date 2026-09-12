import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Settings, Server, Plus, UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SystemManagement = () => {
  const [showCentreModal, setShowCentreModal] = useState(false);
  const [centreName, setCentreName] = useState('');
  const [code, setCode] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Haryana');
  const [msg, setMsg] = useState('');

  const handleAddCentre = (e) => {
    e.preventDefault();
    setMsg(`Success! New procurement centre "${centreName}" (${code}) added to national registry.`);
    setCentreName('');
    setCode('');
    setDistrict('');
    setShowCentreModal(false);
  };

  return (
    <DashboardLayout
      title="System Health & Infrastructure Management"
      subtitle="Configure national procurement centres, manager credentials, and monitor SMS gateway delivery"
    >
      <div className="space-y-6">
        {/* System Health Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card accent="green" hover={false}>
            <div className="flex items-center space-x-2 text-gov-green font-bold text-xs uppercase font-heading">
              <Server className="w-4 h-4" />
              <span>API Gateway Status</span>
            </div>
            <div className="text-xl font-bold text-gov-green font-heading mt-2">100% OPERATIONAL</div>
            <div className="text-[10px] text-gov-muted mt-1">Latency: 24ms • Uptime: 99.99%</div>
          </Card>

          <Card accent="green" hover={false}>
            <div className="flex items-center space-x-2 text-gov-green font-bold text-xs uppercase font-heading">
              <CheckCircle2 className="w-4 h-4" />
              <span>SMS Gateway Status</span>
            </div>
            <div className="text-xl font-bold text-gov-green font-heading mt-2">99.8% DELIVERED</div>
            <div className="text-[10px] text-gov-muted mt-1">NIC SMS Portal Integrated</div>
          </Card>

          <Card accent="red" hover={false}>
            <div className="flex items-center space-x-2 text-gov-red font-bold text-xs uppercase font-heading">
              <Settings className="w-4 h-4" />
              <span>Active Sockets</span>
            </div>
            <div className="text-xl font-bold text-gov-red font-heading mt-2">1,248 Connected</div>
            <div className="text-[10px] text-gov-muted mt-1">Real-time room channels</div>
          </Card>
        </div>

        {msg && (
          <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-xl font-bold">
            {msg}
          </div>
        )}

        {/* System Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-xl border border-gov-border">
          <div className="text-sm font-bold font-heading text-gov-text">
            Infrastructure Administrative Controls
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="primary" onClick={() => setShowCentreModal(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Register New Centre
            </Button>
          </div>
        </div>

        {/* Register Centre Modal */}
        {showCentreModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <Card accent="red" hover={false} className="w-full max-w-md bg-white space-y-4 animate-fade-in-up">
              <div className="border-b border-gov-border pb-3 flex justify-between items-center">
                <h3 className="text-base font-bold font-heading text-gov-text">Register New Procurement Centre</h3>
                <button onClick={() => setShowCentreModal(false)} className="text-gov-muted hover:text-gov-text font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCentre} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">Centre Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ambala Grain Procurement Hub"
                    value={centreName}
                    onChange={(e) => setCentreName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gov-text mb-1">Centre Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., AMB01"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gov-gray border border-gov-border rounded-lg text-xs font-mono font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gov-text mb-1">District *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Ambala"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <Button variant="outline" onClick={() => setShowCentreModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Register Centre
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SystemManagement;
