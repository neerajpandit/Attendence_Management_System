import { useEffect, useState } from 'react';
import CONSTANTS from '../../constants.json';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import Underline from '../../components/Underline';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchPlanList } from '../../redux/apis/plan'; // <-- replace with your API function
import AddPlanModal from './components/AddPlanModal'; // <-- replace with your modal

const PlanListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pPage = searchParams.get('pPage');
  const pSearch = searchParams.get('pSearch');
  const pSortBy = searchParams.get('pSortBy');
  const pSortOrder = searchParams.get('pSortOrder');

  const [planList, setPlanList] = useState([]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(pSearch || '');
  const [sortBy, setSortBy] = useState(pSortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState(pSortOrder || '-1');
  const [recallApi, setRecallApi] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: Number(pPage) || 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const dispatch = useDispatch();

  const handleSorting = (field) => {
    const newSortOrder = sortOrder === '1' ? '-1' : '1';
    setSortBy(field);
    setSortOrder(newSortOrder);
    searchParams.set('pSortBy', field);
    searchParams.set('pSortOrder', newSortOrder);
    setSearchParams(searchParams);
  };

  const handleSearch = (value) => {
    setSearchInput(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    searchParams.set('pSearch', value);
    searchParams.set('pPage', '1');
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSortBy('createdAt');
    setSortOrder('-1');
    setSearchInput('');
    searchParams.delete('pSearch');
    searchParams.set('pPage', 1);
    setSearchParams(searchParams);
    if (pagination.currentPage !== 1) handlePageChange(1);
  };

  const fetchPlanListAPI = (page = 1) => {
    dispatch(
      fetchPlanList({
        search: searchInput,
        limit: pagination.limit,
        page,
        sortBy,
        sortOrder,
      })
    ).then((res) => {
      if (res.statusCode ===200) {
        setPlanList(res?.data || []);
        setPagination({
          currentPage: res.data?.currentPage || page,
          totalPages: res.data?.totalPages || 1,
          totalCount: res.data?.total || 0,
          limit: res.data?.pageSize || pagination.limit,
        });
      } else {
        toast.error(res.message || 'Failed to fetch plan list');
      }
    });
  };

  useEffect(() => {
    fetchPlanListAPI(pagination.currentPage);
  }, [recallApi, searchInput, sortBy, sortOrder, pagination.currentPage]);

  useEffect(() => {
    setSearchInput(pSearch || '');
    setSortBy(pSortBy || 'createdAt');
    setSortOrder(pSortOrder || '-1');
    setPagination((prev) => ({
      ...prev,
      currentPage: Number(pPage) || 1,
    }));
  }, [searchParams]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: Number(page) || 1 }));
      searchParams.set('pPage', page);
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-start mb-5 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-primary">Plan</span> Master
        </h1>
      </div>

      <Search
        searchInput={searchInput}
        placeHolder="Search Plan ..."
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

        <button
          onClick={() => setIsPlanModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-5 py-2 text-sm"
        >
          Add Plan
        </button>
      </div>

      <div className="flex flex-col mb-5">
        <h2 className="text-md font-semibold text-gray-500 mb-3 uppercase">
          Plan List
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-md custom-scrollbar">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th
                  onClick={() => handleSorting('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Plan Name
                </th>
                <th
                  onClick={() => handleSorting('durationDays')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Duration (Days)
                </th>
                <th
                  onClick={() => handleSorting('price')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Price
                </th>
                <th
                  onClick={() => handleSorting('features')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Features
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {planList.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-5 text-xs font-semibold text-gray-500"
                  >
                    {CONSTANTS.NO_DATA_MESSAGE}
                  </td>
                </tr>
              ) : (
                planList.map((item, index) => (
                  <tr
                    key={item._id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item?.durationDays || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item?.price || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item?.features?.join(', ') || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-500">
                      <Link
                        className="relative group"
                        to={`/plan-list/plan-details?planId=${item._id}`}
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

      {/* Plan Add Modal */}
      {isPlanModalOpen && (
        <AddPlanModal
          closeModal={() => setIsPlanModalOpen(false)}
          setRecallApi={setRecallApi}
          recallApi={recallApi}
        />
      )}
    </div>
  );
};

export default PlanListPage;
