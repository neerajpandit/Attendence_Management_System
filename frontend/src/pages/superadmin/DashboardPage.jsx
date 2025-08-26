import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Circular Progress Bar Component
const CircleBar = ({ value, label, color }) => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          fill="transparent"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-xl font-bold fill-gray-700 rotate-90"
        >
          {value}%
        </text>
      </svg>
      <p className="mt-2 text-gray-600 font-medium">{label}</p>
    </div>
  );
};

const SuperAdminDashboardPage = () => {
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [lastMonthUsers, setLastMonthUsers] = useState([]);

  useEffect(() => {
    // Mock API Data
    const mockSubscriptions = [
      { type: 'Free', count: 120, dueDate: '2025-09-01' },
      { type: 'Basic', count: 80, dueDate: '2025-09-10' },
      { type: 'Premium', count: 50, dueDate: '2025-09-20' },
    ];

    const mockRevenue = [
      { month: 'Jan', revenue: 5000 },
      { month: 'Feb', revenue: 8000 },
      { month: 'Mar', revenue: 7500 },
      { month: 'Apr', revenue: 9000 },
      { month: 'May', revenue: 12000 },
      { month: 'Jun', revenue: 10000 },
    ];

    const mockNewUsers = [
      { month: 'Jan', Free: 30, Basic: 15, Premium: 5 },
      { month: 'Feb', Free: 40, Basic: 20, Premium: 10 },
      { month: 'Mar', Free: 50, Basic: 25, Premium: 15 },
      { month: 'Apr', Free: 45, Basic: 30, Premium: 20 },
      { month: 'May', Free: 60, Basic: 40, Premium: 25 },
      { month: 'Jun', Free: 70, Basic: 50, Premium: 35 }, // 👉 Last Month
    ];

    setSubscriptionData(mockSubscriptions);
    setRevenueData(mockRevenue);

    // Get last month only
    const lastMonth = mockNewUsers[mockNewUsers.length - 1];
    setLastMonthUsers([
      { type: 'Free', count: lastMonth.Free },
      { type: 'Basic', count: lastMonth.Basic },
      { type: 'Premium', count: lastMonth.Premium },
    ]);
  }, []);

  const COLORS = ['#60a5fa', '#34d399', '#fbbf24'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Dashboard Overview
      </h1>

      {/* Subscription Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {subscriptionData.map((sub, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              {sub.type} Plan
            </h2>
            <p className="text-3xl font-bold text-blue-600">{sub.count}</p>
            <p className="text-sm text-gray-500 mt-2">
              Next Due: {sub.dueDate}
            </p>
          </div>
        ))}
      </div>

      {/* Last Month New Users */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        👥 Last Month New Users
      </h2>

      {/* New User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {lastMonthUsers.map((user, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              {user.type} Users
            </h2>
            <p className="text-3xl font-bold text-green-600">{user.count}</p>
            <p className="text-sm text-gray-500 mt-2">
              New Registrations (Last Month)
            </p>
          </div>
        ))}
      </div>

      {/* Circle Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {lastMonthUsers.map((user, index) => {
          const total = lastMonthUsers.reduce((sum, u) => sum + u.count, 0);
          const percentage = Math.round((user.count / total) * 100);
          return (
            <CircleBar
              key={index}
              value={percentage}
              label={`${user.type} Share`}
              color={COLORS[index % COLORS.length]}
            />
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Subscription Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionData}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {subscriptionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Revenue Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;
