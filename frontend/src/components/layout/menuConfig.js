import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Radio,
  MapPin,
  GitCommit,
  History,
  CreditCard,
  HelpCircle,
  Users,
  CheckSquare,
  Volume2,
  Award,
  Scale,
  FileCheck,
  UserCheck,
  Bell,
  Building2,
  UserPlus,
  Activity,
  FileText,
  BarChart3,
  FileSpreadsheet,
  Globe,
  TrendingUp,
  Settings,
  ShieldCheck
} from 'lucide-react';

export const roleMenus = {
  farmer: [
    { id: 'dashboard', labelKey: 'menu.dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'schedule', labelKey: 'menu.farmer.schedule', path: '/dashboard/schedule', icon: Calendar },
    { id: 'my-token', labelKey: 'menu.farmer.my_token', path: '/dashboard/my-token', icon: Ticket },
    { id: 'live-queue', labelKey: 'menu.farmer.live_queue', path: '/dashboard/live-queue', icon: Radio },
    { id: 'find-centre', labelKey: 'menu.farmer.find_centre', path: '/dashboard/find-centre', icon: MapPin },
    { id: 'track', labelKey: 'menu.farmer.track', path: '/dashboard/track', icon: GitCommit },
    { id: 'history', labelKey: 'menu.farmer.history', path: '/dashboard/history', icon: History },
    { id: 'payments', labelKey: 'menu.farmer.payments', path: '/dashboard/payments', icon: CreditCard },
    { id: 'help-voice', labelKey: 'menu.farmer.help_voice', path: '/dashboard/help-voice', icon: HelpCircle },
  ],

  staff: [
    { id: 'dashboard', labelKey: 'menu.dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'todays-queue', labelKey: 'menu.staff.todays_queue', path: '/dashboard/todays-queue', icon: CheckSquare },
    { id: 'token-management', labelKey: 'menu.staff.token_mgmt', path: '/dashboard/token-management', icon: Ticket },
    { id: 'call-next', labelKey: 'menu.staff.call_next', path: '/dashboard/call-next', icon: Volume2 },
    { id: 'quality-check', labelKey: 'menu.staff.quality_check', path: '/dashboard/quality-check', icon: Award },
    { id: 'weighing', labelKey: 'menu.staff.weighing', path: '/dashboard/weighing', icon: Scale },
    { id: 'procurement-entry', labelKey: 'menu.staff.procurement', path: '/dashboard/procurement-entry', icon: FileCheck },
    { id: 'farmer-records', labelKey: 'menu.staff.farmer_records', path: '/dashboard/farmer-records', icon: UserCheck },
    { id: 'notifications', labelKey: 'menu.staff.notifications', path: '/dashboard/notifications', icon: Bell },
  ],

  manager: [
    { id: 'dashboard', labelKey: 'menu.dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'centre-overview', labelKey: 'menu.manager.centre_overview', path: '/dashboard/centre-overview', icon: Building2 },
    { id: 'staff-management', labelKey: 'menu.manager.staff_mgmt', path: '/dashboard/staff-management', icon: UserPlus },
    { id: 'queue-monitoring', labelKey: 'menu.manager.queue_monitoring', path: '/dashboard/queue-monitoring', icon: Activity },
    { id: 'procurement-overview', labelKey: 'menu.manager.procurement_overview', path: '/dashboard/procurement-overview', icon: FileText },
    { id: 'payment-overview', labelKey: 'menu.manager.payment_overview', path: '/dashboard/payment-overview', icon: CreditCard },
    { id: 'centre-performance', labelKey: 'menu.manager.centre_performance', path: '/dashboard/centre-performance', icon: BarChart3 },
    { id: 'reports', labelKey: 'menu.manager.reports', path: '/dashboard/reports', icon: FileSpreadsheet },
  ],

  admin: [
    { id: 'dashboard', labelKey: 'menu.dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'all-centres', labelKey: 'menu.admin.all_centres', path: '/dashboard/all-centres', icon: Building2 },
    { id: 'all-farmers', labelKey: 'menu.admin.all_farmers', path: '/dashboard/all-farmers', icon: Users },
    { id: 'procurement-analytics', labelKey: 'menu.admin.procurement_analytics', path: '/dashboard/procurement-analytics', icon: BarChart3 },
    { id: 'payment-monitoring', labelKey: 'menu.admin.payment_monitoring', path: '/dashboard/payment-monitoring', icon: CreditCard },
    { id: 'centre-performance', labelKey: 'menu.admin.centre_performance', path: '/dashboard/centre-performance', icon: TrendingUp },
    { id: 'regional-analytics', labelKey: 'menu.admin.regional_analytics', path: '/dashboard/regional-analytics', icon: Globe },
    { id: 'reports', labelKey: 'menu.admin.reports', path: '/dashboard/reports', icon: FileSpreadsheet },
    { id: 'system-mgmt', labelKey: 'menu.admin.system_mgmt', path: '/dashboard/system-mgmt', icon: Settings },
  ],
};

// Aliases for role lookup
roleMenus.govt_admin = roleMenus.admin;
