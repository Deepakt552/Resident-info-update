import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import {
  Users,
  Shield,
  Home,
  FileText,
  MailCheck,
  MailX,
  Settings,
  TrendingUp,
  Calendar,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../Components/Dashboard/StatCard';
import RecentSignupsTable from '../Components/Dashboard/RecentSignupsTable';
import LatestMailLogsTable from '../Components/Dashboard/LatestMailLogsTable';
import RightSidebar from '../Components/Dashboard/RightSidebar';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

const COLORS = ['#F34853', '#1D294D', '#10B981', '#F59E0B', '#8B5CF6'];

export default function Dashboard({ stats, recentSignups, latestMailLogs, monthlySignups, monthlyMails, propertySignups, settings, currentDate }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: 'Admins', value: stats.totalAdmins, icon: Shield, color: 'from-purple-500 to-purple-600' },
    { title: 'Properties', value: stats.totalProperties, icon: Home, color: 'from-orange-500 to-orange-600' },
    { title: 'Resident Signups', value: stats.totalResidentSignups, icon: FileText, color: 'from-indigo-500 to-indigo-600' },
    { title: 'Mail Success', value: stats.mailSuccess, icon: MailCheck, color: 'from-emerald-500 to-emerald-600' },
    { title: 'Mail Failed', value: stats.mailFailed, icon: MailX, color: 'from-red-500 to-red-600' },
  ];

  // Pie chart data
  const pieData = [
    { name: 'Success', value: stats.mailSuccess },
    { name: 'Failed', value: stats.mailFailed },
  ];

  return (
    <>
      <AuthenticatedLayout header="Dashboard">
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 lg:p-8 dark:bg-[#111827]">
          {/* Welcome Section */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1D294D] dark:text-white">
                Welcome, Admin
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Here's what's happening with your property management
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm md:mt-0 dark:bg-[#1F2937] dark:border dark:border-gray-700">
              <Calendar className="h-5 w-5 text-[#F34853] dark:text-[#F34853]" />
              <span className="font-medium text-[#1D294D] dark:text-white">
                {currentDate}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-[#1D294D] dark:text-white">
              Quick Stats
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {statCards.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  loading={loading}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <RightSidebar settings={settings} />

          {/* Charts Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-[#1D294D] dark:text-white">
              Analytics
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Monthly Resident Signups - Area Chart */}
              <div className="rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-[#1F2937] dark:border dark:border-gray-700">
                <h3 className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Monthly Resident Signups
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySignups}>
                      <defs>
                        <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F34853" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#F34853" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis 
                        dataKey="month" 
                        className="text-gray-600 dark:text-gray-400"
                        tick={{ fill: 'currentColor' }}
                      />
                      <YAxis 
                        className="text-gray-600 dark:text-gray-400"
                        tick={{ fill: 'currentColor' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--tw-bg-white, #FFFFFF)',
                          borderColor: 'var(--tw-border-gray-200, #E5E7EB)',
                          color: 'var(--tw-text-gray-900, #111827)',
                        }}
                        labelStyle={{
                          color: 'var(--tw-text-gray-900, #111827)',
                        }}
                        wrapperClassName="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#F34853" 
                        fillOpacity={1} 
                        fill="url(#colorSignups)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Mail Sent - Bar Chart */}
              <div className="rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-[#1F2937] dark:border dark:border-gray-700">
                <h3 className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Monthly Mail Activity
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyMails}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis 
                        dataKey="month" 
                        className="text-gray-600 dark:text-gray-400"
                        tick={{ fill: 'currentColor' }}
                      />
                      <YAxis 
                        className="text-gray-600 dark:text-gray-400"
                        tick={{ fill: 'currentColor' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--tw-bg-white, #FFFFFF)',
                          borderColor: 'var(--tw-border-gray-200, #E5E7EB)',
                          color: 'var(--tw-text-gray-900, #111827)',
                        }}
                        labelStyle={{
                          color: 'var(--tw-text-gray-900, #111827)',
                        }}
                        wrapperClassName="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                      <Legend 
                        wrapperStyle={{
                          color: 'var(--tw-text-gray-900, #111827)',
                        }}
                        className="dark:text-white"
                      />
                      <Bar dataKey="success" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="failed" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mail Success vs Failed - Pie Chart */}
              <div className="rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-[#1F2937] dark:border dark:border-gray-700">
                <h3 className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Mail Success vs Failed
                </h3>
                <div className="h-72 cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--tw-bg-white, #FFFFFF)',
                          borderColor: 'var(--tw-border-gray-200, #E5E7EB)',
                          color: 'var(--tw-text-gray-900, #111827)',
                        }}
                        labelStyle={{
                          color: 'var(--tw-text-gray-900, #111827)',
                        }}
                        wrapperClassName="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Property Wise Signups - Horizontal Bar Chart */}
              <div className="rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-[#1F2937] dark:border dark:border-gray-700">
                <h3 className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Property Wise Signups
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={propertySignups}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis 
                        type="number" 
                        className="text-gray-600 dark:text-gray-400"
                        tick={{ fill: 'currentColor' }}
                      />
                      <YAxis 
                        dataKey="property_name" 
                        type="category" 
                        width={100}
                        className="text-gray-600 dark:text-gray-400"
                        tick={{ fill: 'currentColor' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--tw-bg-white, #FFFFFF)',
                          borderColor: 'var(--tw-border-gray-200, #E5E7EB)',
                          color: 'var(--tw-text-gray-900, #111827)',
                        }}
                        labelStyle={{
                          color: 'var(--tw-text-gray-900, #111827)',
                        }}
                        wrapperClassName="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#1D294D" 
                        radius={[0, 4, 4, 0]} 
                        className="dark:fill-[#818CF8]"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentSignupsTable data={recentSignups} loading={loading} />
            <LatestMailLogsTable data={latestMailLogs} loading={loading} />
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  );
}



// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head } from '@inertiajs/react';

// export default function Dashboard() {
//     return (
//         <AuthenticatedLayout
//             header={
//                 <h2 className="text-xl font-semibold leading-tight text-gray-800">
//                     Dashboard
//                 </h2>
//             }
//         >
//             <Head title="Dashboard" />

//             <div className="py-12">
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
//                         <div className="p-6 text-gray-900">
//                             You're logged in!
//                         </div>
//                     </div>
//                 </div>
//             </div> 
//         </AuthenticatedLayout>
//     );
// }
