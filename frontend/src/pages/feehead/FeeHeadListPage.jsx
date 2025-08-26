import { useEffect, useState } from 'react';
import CONSTANTS from '../../constants.json';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import Underline from '../../components/Underline';
import { Link, useSearchParams } from 'react-router-dom';
import TableHeading from '../../components/TableHeading';
import { fetchEntityList } from '../../redux/apis/properties';
import { fetchObjects } from '../../redux/apis/object';

import { fetchInstituteList } from '../../redux/apis/institute';
import { fetchFeeHeadList } from '../../redux/apis/feehead';
import AddFeeHeadModal from './components/AddFeeHeadModel';

const FeeHeadListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pType = searchParams.get('pType');
  const pPage = searchParams.get('pPage');
  const pSearch = searchParams.get('pSearch');
  const pSortBy = searchParams.get('pSortBy');
  const pSortOrder = searchParams.get('pSortOrder');

  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  const [propertyList, setPropertyList] = useState([]);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [propertyType, setPropertyType] = useState(pType || '');
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

  const handlePropertyModal = () => {
    setIsPropertyModalOpen(true);
  };

  const handleSorting = (sortBy) => {
    const newSortOrder = sortOrder === '1' ? '-1' : '1';
    setSortBy(sortBy);
    setSortOrder(newSortOrder);
    searchParams.set('pSortBy', sortBy);
    searchParams.set('pSortOrder', newSortOrder);
    setSearchParams(searchParams);
  };

  const handelSearch = (searchInput) => {
    setSearchInput(searchInput);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    searchParams.set('pType', '');
    searchParams.set('pSearch', searchInput);
    searchParams.set('pPage', '1');
    setSearchParams(searchParams);
  };

  const handleTypeChange = (type) => {
    setPropertyType(type);
    setSearchInput('');
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    searchParams.delete('pSearch');
    searchParams.set('pPage', 1);
    searchParams.set('pType', type);
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setPropertyType('');
    setSortBy(
      userRole === '0' || userRole === '3' ? 'expiringIn' : 'createdAt'
    );
    setSortOrder(userRole === '0' || userRole === '3' ? '1' : '-1');
    setSearchInput('');
    if (pagination.currentPage !== 1) {
      handlePageChange(1);
    }
    searchParams.set('pPage', 1);
    searchParams.set(
      'pSortBy',
      userRole === '0' || userRole === '3' ? 'expiringIn' : 'createdAt'
    );
    searchParams.set(
      'pSortOrder',
      userRole === '0' || userRole === '3' ? '1' : '-1'
    );
    searchParams.delete('pSearch');
    searchParams.delete('bgType');
    setSearchParams(searchParams);
  };

  const fetchInstituteListAPI = (page = 1) => {
    dispatch(
      fetchFeeHeadList({
        propertyType,
        search: searchInput,
        limit: pagination.limit,
        page,
        sortBy,
        sortOrder,
      })
    ).then((res) => {
      if (res.success) {
        console.log(res.pagination);

        // API sends res.data.data (list) and res.data.pagination
        setPropertyList(res.data || []);
        setPagination(
          res.pagination || {
            currentPage: page,
            totalPages: 1,
            totalCount: 0,
            limit: pagination.limit,
          }
        );
      } else {
        toast.error(res.message || 'Failed to fetch entity list');
      }
    });
  };

  useEffect(() => {
    fetchInstituteListAPI(pagination.currentPage);
  }, [
    recallApi,
    propertyType,
    searchInput,
    sortBy,
    sortOrder,
    pagination.currentPage,
  ]);

  useEffect(() => {
    setPropertyType(pType || '');
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

  const Heading = ({ label }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
      {label}
    </th>
  );

  const Column = ({ label }) => (
    <td className="px-6 py-4 text-sm text-gray-600">
      <div className="min-w-32 max-w-48 max-h-20 overflow-auto break-words whitespace-normal p-2 custom-scrollbar">
        {label}
      </div>
    </td>
  );

  const fetchPropertyTypes = () => {
    dispatch(
      fetchObjects({
        type: 'entity',
        limit: 100,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: '-1',
      })
    ).then((res) => {
      if (res.success) {
        const filteredData = res.data.propertyTypes
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.propertyName,
          }));

        setPropertyTypeList(filteredData);
      }
    });
  };

  useEffect(() => {
    fetchPropertyTypes();
  }, [recallApi]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-start mb-5 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-primary">Entity</span> Master
        </h1>
      </div>


      <div className="flex flex-wrap items-center justify-between gap-5 mb-5">
        <div className="flex flex-wrap items-center gap-5">
          <div className="min-w-48 mb-3"></div>
        </div>

        {userRole === '0' ||
          (userRole === '1' && (
            <div>
              <button
                onClick={handlePropertyModal}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-5 py-2 text-sm"
              >
                Add More FeeHead
              </button>
            </div>
          ))}
      </div>

      <div className="flex flex-col mb-5">
        <h2 className="text-md font-semibold text-gray-500 mb-3 uppercase">
          Institute List
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-md custom-scrollbar">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <Heading label="Category Name" />
                <Heading label="Amount" />
                <Heading label="Status" />
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {propertyList.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-5 text-xs font-semibold text-gray-500"
                  >
                    {CONSTANTS.NO_DATA_MESSAGE}
                  </td>
                </tr>
              ) : (
                propertyList.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 capitalize">
                      <div className="min-w-28 max-w-40 overflow-auto whitespace-nowrap p-2 custom-scrollbar">
                        <Link
                          className="flex gap-2 items-center hover:text-gray-900"
                          // to={`/property-list/property-details?propertyId=${item._id}`}
                        >
                          {item.name}
                        </Link>
                      </div>
                    </td>
                    <Column label={item.amount || '-'} />
                    <Column
                      label={
                        item.is_active === true
                          ? 'Active'
                          : item.is_active === false
                            ? 'Deactive'
                            : '-'
                      }
                    />

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-500">
                      <Link
                        className="relative group"
                        // to={`/property-list/property-details?propertyId=${item._id}`}
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

      {isPropertyModalOpen && (
        <AddFeeHeadModal
          closeModal={() => setIsPropertyModalOpen(false)}
          entityId={false}
          setRecallApi={setRecallApi}
          recallApi={recallApi}
        />
      )}
    </div>
  );
};

export default FeeHeadListPage;
