import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const StaffListDetailsPage = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();

  // Mock Staff Profile Data
  const staffProfile = {
    id: staffId,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    department: 'Engineering',
    role: 'Software Developer',
    avatar: 'https://i.pravatar.cc/150?img=12',
  };

  // Mock Leave Data
  const leaveSummary = {
    totalLeaves: 24,
    usedLeaves: 8,
    remainingLeaves: 16,
  };

  // Mock Punch Data (Month-wise)
  const punchData = {
    January: [
      {
        date: '2025-01-02',
        in: '09:05 AM',
        out: '06:00 PM',
        status: 'Present',
      },
      { date: '2025-01-03', in: '09:45 AM', out: '06:15 PM', status: 'Late' },
      { date: '2025-01-04', in: null, out: null, status: 'Absent' },
    ],
    February: [
      {
        date: '2025-02-01',
        in: '09:00 AM',
        out: '06:10 PM',
        status: 'Present',
      },
      {
        date: '2025-02-02',
        in: '09:20 AM',
        out: '06:05 PM',
        status: 'Present',
      },
    ],
  };

  const [selectedMonth, setSelectedMonth] = useState('January');

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-4"
      >
        <ChevronLeft size={20} /> Back
      </button>

      {/* Staff Profile */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-6">
        <img
          src={staffProfile.avatar}
          alt={staffProfile.name}
          className="w-24 h-24 rounded-full shadow-md border-2 border-blue-100"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {staffProfile.name}
          </h2>
          <p className="text-blue-600 font-medium">{staffProfile.role}</p>
          <p className="text-sm text-gray-500">{staffProfile.department}</p>
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p>
              Email: <span className="font-medium">{staffProfile.email}</span>
            </p>
            <p>
              Phone: <span className="font-medium">{staffProfile.phone}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Leave Summary */}
      <div className="bg-white shadow-lg rounded-2xl p-6 grid grid-cols-3 text-center">
        <div>
          <h3 className="text-2xl font-bold text-blue-600">
            {leaveSummary.totalLeaves}
          </h3>
          <p className="text-gray-600">Total Leaves</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-red-600">
            {leaveSummary.usedLeaves}
          </h3>
          <p className="text-gray-600">Used Leaves</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-600">
            {leaveSummary.remainingLeaves}
          </h3>
          <p className="text-gray-600">Remaining Leaves</p>
        </div>
      </div>

      {/* Month Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Punch In / Punch Out Logs
        </h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          {Object.keys(punchData).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Punch In / Out Logs */}
      <div className="bg-white shadow-lg rounded-2xl p-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Punch In</th>
              <th className="p-3 border-b">Punch Out</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {punchData[selectedMonth]?.map((entry, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-3 border-b">{entry.date}</td>
                <td className="p-3 border-b">{entry.in || '-'}</td>
                <td className="p-3 border-b">{entry.out || '-'}</td>
                <td
                  className={`p-3 border-b font-medium ${
                    entry.status === 'Present'
                      ? 'text-green-600'
                      : entry.status === 'Late'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {entry.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffListDetailsPage;
