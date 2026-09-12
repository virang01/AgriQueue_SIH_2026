import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Building2, Clock, Users, Save, CheckCircle2 } from 'lucide-react';

export const CenterOverview = () => {
  const [centreName, setCentreName] = useState('Karnal Anaj Mandi Procurement Centre');
  const [district, setDistrict] = useState('Karnal');
  const [state, setState] = useState('Haryana');
  const [capacity, setCapacity] = useState(800);
  const [operatingHours, setOperatingHours] = useState('08:00 AM - 05:00 PM');
  const [slotDuration, setSlotDuration] = useState('120'); // minutes
  const [maxFarmersPerSlot, setMaxFarmersPerSlot] = useState(10);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    setTimeout(() => {
      setMsg('Success! Centre details and slot capacity configuration saved successfully.');
      setSaving(false);
    }, 1000);
  };

  return (
    <DashboardLayout
      title="Centre Overview & Capacity Configuration"
      subtitle="Edit centre parameters, daily grain capacity, operating hours, and automated slot generators"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <Card accent="red" hover={false} className="hero-container-shadow space-y-5">
          <div className="border-b border-gov-border pb-3">
            <span className="text-[10px] uppercase font-bold text-gov-red tracking-wider font-heading flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-gov-red mr-1" />
              <span>Centre Configuration Editor</span>
            </span>
            <h2 className="text-lg font-bold font-heading text-gov-text mt-0.5">
              Edit Centre Operating Parameters & Slot Limits
            </h2>
          </div>

          {msg && (
            <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-xl font-bold">
              {msg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">Procurement Centre Name *</label>
              <input
                type="text"
                required
                value={centreName}
                onChange={(e) => setCentreName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">District *</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">
                  Max Daily Capacity (Quintals/Day) *
                </label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Daily Operating Hours *</label>
                <input
                  type="text"
                  required
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gov-border pt-4">
              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Time Slot Window Duration</label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                >
                  <option value="60">1 Hour Slots</option>
                  <option value="120">2 Hour Slots (Recommended)</option>
                  <option value="180">3 Hour Slots</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Max Farmers Per Slot Window</label>
                <input
                  type="number"
                  required
                  value={maxFarmersPerSlot}
                  onChange={(e) => setMaxFarmersPerSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" disabled={saving} variant="primary">
                <Save className="w-4 h-4 mr-1.5" />
                {saving ? 'Saving Config...' : 'Save Configuration'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CenterOverview;
