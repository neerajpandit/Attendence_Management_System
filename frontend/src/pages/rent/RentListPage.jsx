import { useEffect, useState } from 'react';
import CONSTANTS from '../../constants.json';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import Underline from '../../components/Underline';
import { useSearchParams } from 'react-router-dom';
import { rentList } from '../../redux/apis/rent';

const RentListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  const [rentListData, setRentListData] = useState([]);
  const [searchInput, setSearchInput] = useState(
    searchParams.get('pSearch') || ''
  );
  const [sortBy, setSortBy] = useState('billDate');
  const [sortOrder, setSortOrder] = useState('-1');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const dispatch = useDispatch();

  const handleSorting = (sortField) => {
    const newOrder = sortOrder === '1' ? '-1' : '1';
    setSortBy(sortField);
    setSortOrder(newOrder);
    searchParams.set('pSortBy', sortField);
    searchParams.set('pSortOrder', newOrder);
    setSearchParams(searchParams);
  };

  const handelSearch = (searchText) => {
    setSearchInput(searchText);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    searchParams.set('pSearch', searchText);
    searchParams.set('pPage', '1');
    setSearchParams(searchParams);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
      searchParams.set('pPage', page);
      setSearchParams(searchParams);
    }
  };

  const fetchRentList = () => {
    dispatch(
      rentList({
        search: searchInput,
        sortBy,
        sortOrder,
        page: pagination.currentPage,
        limit: pagination.limit,
      })
    ).then((res) => {
      if (res.success) {
        setRentListData(res.data.bills || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: res.data.pagination.currentPage,
          totalPages: res.data.pagination.totalPages,
          totalCount: res.data.pagination.totalRecords,
          limit: res.data.pagination.limit,
        }));
      } else {
        toast.error(res.message || 'Failed to fetch rent data');
      }
    });
  };

  useEffect(() => {
    fetchRentList();
  }, [searchInput, sortBy, sortOrder, pagination.currentPage]);

  const Heading = ({ label }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
      {label}
    </th>
  );

  const Column = ({ label }) => (
    <td className="px-4 py-4 text-sm text-gray-600 break-words">
      <div className="max-w-xs overflow-auto custom-scrollbar">{label}</div>
    </td>
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-start mb-5 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-primary">Rent</span> Bills
        </h1>
      </div>

      <Search
        searchInput={searchInput}
        placeHolder="Search by unit number, tenant email..."
        onSearch={handelSearch}
      />

      <div className="flex flex-col mb-5">
        <h2 className="text-md font-semibold text-gray-500 mb-3 uppercase">
          Rent Bills List
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-md custom-scrollbar">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <Heading label="Unit Number" />
                <Heading label="Tenant Email" />
                <Heading label="Bill Date" />
                <Heading label="Billing Period" />
                <Heading label="Rent Amount" />
                <Heading label="Additional Charges" />
                <Heading label="One-Time Charges" />
                <Heading label="Total Amount" />
                <Heading label="Payment Status" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rentListData.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-5 text-xs font-semibold text-gray-500"
                  >
                    {CONSTANTS.NO_DATA_MESSAGE}
                  </td>
                </tr>
              ) : (
                rentListData?.map((bill, index) => (
                  <tr
                    key={bill._id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <Column label={bill.unitId?.unitNumber || '-'} />
                    <Column label={bill.tenantId?.email?.trim() || 'N/A'} />
                    <Column
                      label={new Date(bill.billDate).toLocaleDateString()}
                    />
                    <Column
                      label={`${new Date(bill.billingPeriodStart).toLocaleDateString()} - ${new Date(
                        bill.billingPeriodEnd
                      ).toLocaleDateString()}`}
                    />
                    <Column label={`₹ ${bill.rentAmount}`} />
                    <Column
                      label={
                        bill.additionalCharges?.length
                          ? bill.additionalCharges
                              .map((ch) => `${ch.title}: ₹${ch.amount}`)
                              .join(', ')
                          : '-'
                      }
                    />
                    <Column
                      label={
                        bill.oneTimeCharges?.length
                          ? bill.oneTimeCharges
                              .map((ch) => `${ch.title}: ₹${ch.amount}`)
                              .join(', ')
                          : '-'
                      }
                    />
                    <Column label={`₹ ${bill.totalAmount}`} />
                    <Column label={bill.paymentStatus} />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {rentListData.length > 0 && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
};

export default RentListPage;
