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

const OrganizationDashboardPage = () => {
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [lastMonthUsers, setLastMonthUsers] = useState([]);
  const [staffData, setStaffData] = useState([]);

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

    const mockStaff = [
      {
        name: 'Neeraj Pandey',
        punchIn: '09:15 AM',
        punchOut: '06:30 PM',
        location: 'Lucknow Office',
        status: 'Present',
      },
      {
        name: 'Amit Sharma',
        punchIn: '09:45 AM',
        punchOut: '—',
        location: 'Remote - Delhi',
        status: 'Present',
      },
      {
        name: 'Priya Singh',
        punchIn: '—',
        punchOut: '—',
        location: '—',
        status: 'Leave',
      },
      {
        name: 'Ravi Verma',
        punchIn: '09:10 AM',
        punchOut: '05:50 PM',
        location: 'Lucknow Office',
        status: 'Present',
      },
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

    setStaffData(mockStaff);
  }, []);

  const COLORS = ['#60a5fa', '#34d399', '#fbbf24'];

  // Staff Stats
  const totalStaff = staffData.length;
  const leaveStaff = staffData.filter((s) => s.status === 'Leave').length;
  const presentStaff = staffData.filter((s) => s.status === 'Present').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Dashboard Overview
      </h1>

      {/* Staff Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">
            👨‍💼 Total Staff
          </h2>
          <p className="text-3xl font-bold text-blue-600">{totalStaff}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">
            ✅ Present Staff
          </h2>
          <p className="text-3xl font-bold text-green-600">{presentStaff}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700">🚫 On Leave</h2>
          <p className="text-3xl font-bold text-red-500">{leaveStaff}</p>
        </div>
      </div>


      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">
        👥 Today Staff Punch-In and Punch-Out Time
      </h2> */}

      {/* Staff Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          👨‍💼 Staff Attendance Today
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Punch In
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Punch Out
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {staffData.map((staff, index) => {
                // Check late punch-in
                const officeStart = new Date(`2025-08-18T09:30:00`);
                let isLate = false;
                if (staff.punchIn && staff.punchIn !== '—') {
                  const [time, modifier] = staff.punchIn.split(' ');
                  let [hours, minutes] = time.split(':').map(Number);

                  if (modifier === 'PM' && hours !== 12) hours += 12;
                  if (modifier === 'AM' && hours === 12) hours = 0;

                  const punchInDate = new Date();
                  punchInDate.setHours(hours, minutes, 0);

                  if (punchInDate > officeStart) {
                    isLate = true;
                  }
                }

                return (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } border-t hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {staff.name}
                    </td>
                    <td
                      className={`px-6 py-3 ${
                        isLate
                          ? 'text-orange-600 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {staff.punchIn}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {staff.punchOut}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {staff.location}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          staff.status === 'Leave'
                            ? 'bg-red-100 text-red-600'
                            : isLate
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {isLate && staff.status === 'Present'
                          ? 'Late'
                          : staff.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboardPage;
