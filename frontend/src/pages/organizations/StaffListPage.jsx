import { useEffect, useState } from 'react';
import CONSTANTS from '../../constants.json';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import Underline from '../../components/Underline';
import { Link, useSearchParams } from 'react-router-dom';
import { addStaff, fetchStaffList } from '../../redux/apis/organization';
import AddStaffModal from './components/AddStaffModal';

const StaffListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const oPage = searchParams.get('oPage');
  const oSearch = searchParams.get('oSearch');
  const oSortBy = searchParams.get('oSortBy');
  const oSortOrder = searchParams.get('oSortOrder');

  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  const [staffList, setStaffList] = useState([]);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(oSearch || '');
  const [sortBy, setSortBy] = useState(oSortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState(oSortOrder || '-1');
  const [recallApi, setRecallApi] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: Number(oPage) || 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const dispatch = useDispatch();

  const handleSorting = (field) => {
    const newSortOrder = sortOrder === '1' ? '-1' : '1';
    setSortBy(field);
    setSortOrder(newSortOrder);
    searchParams.set('oSortBy', field);
    searchParams.set('oSortOrder', newSortOrder);
    setSearchParams(searchParams);
  };

  const handleSearch = (value) => {
    setSearchInput(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    searchParams.set('oSearch', value);
    searchParams.set('oPage', '1');
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSortBy('createdAt');
    setSortOrder('-1');
    setSearchInput('');
    searchParams.delete('oSearch');
    searchParams.set('oPage', 1);
    setSearchParams(searchParams);
    if (pagination.currentPage !== 1) handlePageChange(1);
  };

  const fetchStaffListAPI = (page = 1) => {
    dispatch(
      fetchStaffList({
        search: searchInput,
        limit: pagination.limit,
        page,
        sortBy,
        sortOrder,
      })
    ).then((res) => {
      if (res.success) {
        setStaffList(res.data?.data || []);
        setPagination({
          currentPage: res.data?.currentPage || page,
          totalPages: res.data?.totalPages || 1,
          totalCount: res.data?.total || 0,
          limit: res.data?.pageSize || pagination.limit,
        });
      } else {
        toast.error(res.message || 'Failed to fetch staff list');
      }
    });
  };

  useEffect(() => {
    fetchStaffListAPI(pagination.currentPage);
  }, [recallApi, searchInput, sortBy, sortOrder, pagination.currentPage]);

  useEffect(() => {
    setSearchInput(oSearch || '');
    setSortBy(oSortBy || 'createdAt');
    setSortOrder(oSortOrder || '-1');
    setPagination((prev) => ({
      ...prev,
      currentPage: Number(oPage) || 1,
    }));
  }, [searchParams]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: Number(page) || 1 }));
      searchParams.set('oPage', page);
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-start mb-5 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-primary">Staff</span> Master
        </h1>
      </div>

      <Search
        searchInput={searchInput}
        placeHolder="Search Staff ..."
        onSearch={handleSearch}
      />

      <div className="flex items-center justify-between gap-5 mb-5">
        <div
          className="text-blue-500 relative cursor-pointer group text-xs font-semibold uppercase"
          onClick={handleClearFilters}
        >
          {CONSTANTS.LINK.CLEAR_FILTERS}
          <Underline />
        </div>

        {userRole === '1' && (
          <button
            onClick={() => setIsStaffModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-5 py-2 text-sm"
          >
            Add Staff
          </button>
        )}
      </div>

      <div className="flex flex-col mb-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">👨‍💼 Staff List</h2>
        <div className="overflow-x-auto rounded-lg shadow-md custom-scrollbar">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th
                  onClick={() => handleSorting('ownerName')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Owner Name
                </th>
                <th
                  onClick={() => handleSorting('businessName')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Business Name
                </th>
                <th
                  onClick={() => handleSorting('email')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Email
                </th>
                <th
                  onClick={() => handleSorting('phoneNo')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Phone
                </th>
                <th
                  onClick={() => handleSorting('status')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Status
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffList.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-5 text-xs font-semibold text-gray-500"
                  >
                    {CONSTANTS.NO_DATA_MESSAGE}
                  </td>
                </tr>
              ) : (
                staffList.map((item, index) => (
                  <tr
                    key={item._id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item?.profileId?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item?.businessId?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.email || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.phoneNo || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.isDeleted === false ? 'Active' : 'Deleted'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-500">
                      <Link
                        className="relative group"
                        to={`/staff-list/staff-details/${item._id}`}
                      >
                        {CONSTANTS.LINK.VIEW_DETAILS}
                        <Underline />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>

      {/* Add Staff Modal */}
      {isStaffModalOpen && (
        <AddStaffModal
          closeModal={() => setIsStaffModalOpen(false)}
          setRecallApi={setRecallApi}
          recallApi={recallApi}
        />
      )}
    </div>
  );
};

export default StaffListPage;
