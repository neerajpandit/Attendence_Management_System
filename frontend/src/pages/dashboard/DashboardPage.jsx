import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const StaffDashboard = () => {
  const navigate = useNavigate();

  // Mock data for whole month attendance
  const punchData = [
    {
      date: '2025-08-01',
      inTime: '09:15 AM',
      outTime: '06:00 PM',
      status: 'Present',
    },
    { date: '2025-08-02', inTime: '-', outTime: '-', status: 'Absent' },
    {
      date: '2025-08-03',
      inTime: '09:45 AM',
      outTime: '06:20 PM',
      status: 'Late',
    },
    {
      date: '2025-08-04',
      inTime: '09:10 AM',
      outTime: '06:05 PM',
      status: 'Present',
    },
    { date: '2025-08-05', inTime: '-', outTime: '-', status: 'Leave' },
  ];

  // Calculate stats
  const totalPresent = punchData.filter((d) => d.status === 'Present').length;
  const totalAbsent = punchData.filter((d) => d.status === 'Absent').length;
  const totalLeave = punchData.filter((d) => d.status === 'Leave').length;
  const totalLate = punchData.filter((d) => d.status === 'Late').length;

  const statusBadge = (status) => {
    switch (status) {
      case 'Present':
        return (
          <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1">
            <CheckCircle size={14} /> Present
          </span>
        );
      case 'Absent':
        return (
          <span className="bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1">
            <XCircle size={14} /> Absent
          </span>
        );
      case 'Leave':
        return (
          <span className="bg-yellow-100 text-yellow-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1">
            <Clock size={14} /> Leave
          </span>
        );
      case 'Late':
        return (
          <span className="bg-orange-100 text-orange-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1">
            <AlertCircle size={14} /> Late
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/staff-list')}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition text-sm sm:text-base"
      >
        <ArrowLeft size={18} /> Back to Staff List
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 sm:p-6 rounded-2xl shadow-lg mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">👨‍💼 Staff Dashboard</h1>
        <p className="text-xs sm:text-sm opacity-90">
          Monthly Attendance Report for{' '}
          <span className="font-semibold">John Doe</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition text-center">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-700">
            Present
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            {totalPresent}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition text-center">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-700">
            Absent
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">
            {totalAbsent}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition text-center">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-700">
            Leave
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
            {totalLeave}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition text-center">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-700">
            Late
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600">
            {totalLate}
          </p>
        </div>
      </div>

      {/* Punch Time Table */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          📅 Monthly Punch Times
        </h2>
        <table className="w-full min-w-[500px] border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600">
                Date
              </th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600">
                In Time
              </th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600">
                Out Time
              </th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {punchData.map((entry, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2 sm:p-3 text-gray-700 text-xs sm:text-sm">
                  {entry.date}
                </td>
                <td className="p-2 sm:p-3 text-gray-700 text-xs sm:text-sm">
                  {entry.inTime}
                </td>
                <td className="p-2 sm:p-3 text-gray-700 text-xs sm:text-sm">
                  {entry.outTime}
                </td>
                <td className="p-2 sm:p-3">{statusBadge(entry.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffDashboard;
