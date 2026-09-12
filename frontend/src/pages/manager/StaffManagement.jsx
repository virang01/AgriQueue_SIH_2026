import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import { UserPlus, Users, UserCheck, Shield, Plus, Lock } from 'lucide-react';

export const StaffManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [shift, setShift] = useState('Morning (08:00 AM - 01:00 PM)');
  const [msg, setMsg] = useState('');

  const [staffList, setStaffList] = useState([
    { id: 'STF-01', name: 'Vikram Singh', phone: '7777777777', role: 'Staff Counter 1', shift: 'Morning Shift', status: 'active' },
    { id: 'STF-02', name: 'Anil Mehta', phone: '7777777778', role: 'Weighbridge Counter', shift: 'Full Day', status: 'active' },
    { id: 'STF-03', name: 'Pooja Verma', phone: '7777777779', role: 'Quality Inspector', shift: 'Evening Shift', status: 'active' },
  ]);

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newStaff = {
      id: `STF-0${staffList.length + 1}`,
      name,
      phone,
      role: 'Staff Counter Operator',
      shift,
      status: 'active'
    };

    setStaffList([...staffList, newStaff]);
    setMsg(`Success! New staff account created for ${name} (${phone}).`);
    setName('');
    setPhone('');
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setStaffList(
      staffList.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
    );
  };

  return (
    <DashboardLayout
      title="Centre Staff Management & Shift Roster"
      subtitle="Manage centre staff credentials, assign weighbridge counters, and toggle shift access"
    >
      <div className="space-y-6">
        {/* Header & Add Action */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-xl border border-gov-border">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gov-red" />
            <span className="text-sm font-bold font-heading text-gov-text">
              Active Staff Members ({staffList.length})
            </span>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Staff Account
          </Button>
        </div>

        {msg && (
          <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-xl font-bold">
            {msg}
          </div>
        )}

        {/* Staff Table */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gov-text">
              <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                <tr>
                  <th className="p-3">Staff ID</th>
                  <th className="p-3">Staff Name</th>
                  <th className="p-3">Phone / Login</th>
                  <th className="p-3">Assigned Duty</th>
                  <th className="p-3">Shift Window</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {staffList.map((s) => (
                  <tr key={s.id} className="hover:bg-gov-gray transition-colors">
                    <td className="p-3 font-mono font-bold text-gov-red">{s.id}</td>
                    <td className="p-3 font-semibold">{s.name}</td>
                    <td className="p-3 font-mono">+91 {s.phone}</td>
                    <td className="p-3">{s.role}</td>
                    <td className="p-3">{s.shift}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-heading ${
                          s.status === 'active'
                            ? 'badge-green-light text-gov-green'
                            : 'bg-red-50 text-gov-red border border-red-200'
                        }`}
                      >
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleStatus(s.id)}
                        className="text-xs font-bold text-gov-red hover:underline"
                      >
                        {s.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Staff Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <Card accent="red" hover={false} className="w-full max-w-md bg-white space-y-4 animate-fade-in-up">
              <div className="border-b border-gov-border pb-3 flex justify-between items-center">
                <h3 className="text-base font-bold font-heading text-gov-text">Create Staff Account</h3>
                <button onClick={() => setShowModal(false)} className="text-gov-muted hover:text-gov-text font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">Staff Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">Mobile Phone (Login) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gov-gray border border-gov-border rounded-lg text-xs font-mono font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">Assigned Shift Window</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                  >
                    <option value="Morning (08:00 AM - 01:00 PM)">Morning (08:00 AM - 01:00 PM)</option>
                    <option value="Afternoon (01:00 PM - 06:00 PM)">Afternoon (01:00 PM - 06:00 PM)</option>
                    <option value="Full Day Shift">Full Day Shift</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create Credentials
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

export default StaffManagement;
