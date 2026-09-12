import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Dashboards
import FarmerDashboard from './dashboards/FarmerDashboard';
import StaffDashboard from './dashboards/StaffDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import GovtAdminDashboard from './dashboards/GovtAdminDashboard';

// Farmer Subpages
import MySchedule from './farmer/MySchedule';
import MyToken from './farmer/MyToken';
import LiveQueueView from './farmer/LiveQueueView';
import FindCenter from './farmer/FindCenter';
import TrackProcurement from './farmer/TrackProcurement';
import FarmerHistory from './farmer/FarmerHistory';
import FarmerPayments from './farmer/FarmerPayments';
import HelpVoice from './farmer/HelpVoice';

// Staff Subpages
import TodaysQueue from './staff/TodaysQueue';
import TokenManagement from './staff/TokenManagement';
import CallNextFarmer from './staff/CallNextFarmer';
import QualityCheck from './staff/QualityCheck';
import Weighing from './staff/Weighing';
import ProcurementEntry from './staff/ProcurementEntry';
import FarmerRecords from './staff/FarmerRecords';
import NotificationLogs from './staff/NotificationLogs';

// Manager Subpages
import CenterOverview from './manager/CenterOverview';
import StaffManagement from './manager/StaffManagement';
import QueueMonitoring from './manager/QueueMonitoring';
import ProcurementOverview from './manager/ProcurementOverview';
import PaymentOverview from './manager/PaymentOverview';
import CenterPerformance from './manager/CenterPerformance';
import ReportsPage from './manager/ReportsPage';

// Admin Subpages
import AllCenters from './admin/AllCenters';
import AllFarmers from './admin/AllFarmers';
import ProcurementAnalytics from './admin/ProcurementAnalytics';
import PaymentMonitoring from './admin/PaymentMonitoring';
import GovtCenterPerformance from './admin/GovtCenterPerformance';
import RegionalAnalytics from './admin/RegionalAnalytics';
import GovtReportsPage from './admin/GovtReportsPage';
import SystemManagement from './admin/SystemManagement';

const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role === 'admin' ? 'govt_admin' : user.role;

  return (
    <Routes>
      {/* Farmer Routes */}
      {(role === 'farmer' || !role) && (
        <>
          <Route path="/" element={<FarmerDashboard />} />
          <Route path="/schedule" element={<MySchedule />} />
          <Route path="/my-token" element={<MyToken />} />
          <Route path="/live-queue" element={<LiveQueueView />} />
          <Route path="/find-centre" element={<FindCenter />} />
          <Route path="/track" element={<TrackProcurement />} />
          <Route path="/history" element={<FarmerHistory />} />
          <Route path="/payments" element={<FarmerPayments />} />
          <Route path="/help-voice" element={<HelpVoice />} />
        </>
      )}

      {/* Staff Routes */}
      {role === 'staff' && (
        <>
          <Route path="/" element={<StaffDashboard />} />
          <Route path="/todays-queue" element={<TodaysQueue />} />
          <Route path="/token-management" element={<TokenManagement />} />
          <Route path="/call-next" element={<CallNextFarmer />} />
          <Route path="/quality-check" element={<QualityCheck />} />
          <Route path="/weighing" element={<Weighing />} />
          <Route path="/procurement-entry" element={<ProcurementEntry />} />
          <Route path="/farmer-records" element={<FarmerRecords />} />
          <Route path="/notifications" element={<NotificationLogs />} />
        </>
      )}

      {/* Manager Routes */}
      {role === 'manager' && (
        <>
          <Route path="/" element={<ManagerDashboard />} />
          <Route path="/centre-overview" element={<CenterOverview />} />
          <Route path="/staff-management" element={<StaffManagement />} />
          <Route path="/queue-monitoring" element={<QueueMonitoring />} />
          <Route path="/procurement-overview" element={<ProcurementOverview />} />
          <Route path="/payment-overview" element={<PaymentOverview />} />
          <Route path="/centre-performance" element={<CenterPerformance />} />
          <Route path="/reports" element={<ReportsPage />} />
        </>
      )}

      {/* Govt Admin Routes */}
      {role === 'govt_admin' && (
        <>
          <Route path="/" element={<GovtAdminDashboard />} />
          <Route path="/all-centres" element={<AllCenters />} />
          <Route path="/all-farmers" element={<AllFarmers />} />
          <Route path="/procurement-analytics" element={<ProcurementAnalytics />} />
          <Route path="/payment-monitoring" element={<PaymentMonitoring />} />
          <Route path="/centre-performance" element={<GovtCenterPerformance />} />
          <Route path="/regional-analytics" element={<RegionalAnalytics />} />
          <Route path="/reports" element={<GovtReportsPage />} />
          <Route path="/system-mgmt" element={<SystemManagement />} />
        </>
      )}
    </Routes>
  );
};

export default DashboardPage;
