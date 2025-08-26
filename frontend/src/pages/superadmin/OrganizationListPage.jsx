// import { useEffect, useState, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useSearchParams, Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useTable, useSortBy } from 'react-table';

// import CONSTANTS from '../../constants.json';
// import Pagination from '../../components/Pagination';
// import Search from '../../components/Search';
// import Underline from '../../components/Underline';
// import { fetchEntityList } from '../../redux/apis/properties';
// import { fetchObjects } from '../../redux/apis/object';
// import AddOrganizationModal from './components/AddOrganizationModal';
// import { fetchOrganizationList } from '../../redux/apis/organization';

// const OrganizationListPage = () => {
//   const dispatch = useDispatch();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const { userRole } = useSelector((state) => state.userDetailsSlice.details);

//   // Filters & query params
//   const [organizationList, setOrganizationList] = useState([]);
//   const [organizationTypeList, setOrganizationTypeList] = useState([]);
//   const [organizationType, setOrganizationType] = useState(
//     searchParams.get('orgType') || ''
//   );
//   const [searchInput, setSearchInput] = useState(
//     searchParams.get('orgSearch') || ''
//   );
//   const [sortBy, setSortBy] = useState(
//     searchParams.get('orgSortBy') || 'createdAt'
//   );
//   const [sortOrder, setSortOrder] = useState(
//     searchParams.get('orgSortOrder') || '-1'
//   );
//   const [recallApi, setRecallApi] = useState(false);

//   const [pagination, setPagination] = useState({
//     currentPage: Number(searchParams.get('orgPage')) || 1,
//     totalPages: 1,
//     totalCount: 0,
//     limit: 10,
//   });

//   const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);

//   // Fetch organization types
//   const fetchOrganizationTypes = () => {
//     dispatch(
//       fetchObjects({
//         type: 'entity',
//         limit: 100,
//         page: 1,
//         sortBy: 'createdAt',
//         sortOrder: '-1',
//       })
//     ).then((res) => {
//       if (res.success) {
//         setOrganizationTypeList(
//           res.data.propertyTypes
//             .filter((item) => item.status === '0')
//             .map((item) => ({
//               value: item._id,
//               label: item.propertyName,
//             }))
//         );
//       }
//     });
//   };

//   // Fetch organization list
//   const fetchOrganizationListAPI = (page = 1) => {
//     dispatch(
//       fetchOrganizationList({
//         propertyType: organizationType,
//         search: searchInput,
//         limit: pagination.limit,
//         page,
//         sortBy,
//         sortOrder,
//       })
//     ).then((res) => {
//       if (res.success) {
//         setOrganizationList(res.data || []);
//         setPagination(
//           res.pagination || {
//             currentPage: page,
//             totalPages: 1,
//             totalCount: 0,
//             limit: pagination.limit,
//           }
//         );
//       } else {
//         toast.error(res.message || 'Failed to fetch organization list');
//       }
//     });
//   };

//   // Handle sorting
//   const handleSorting = (column) => {
//     const newSortOrder = sortOrder === '1' ? '-1' : '1';
//     setSortBy(column);
//     setSortOrder(newSortOrder);
//     searchParams.set('orgSortBy', column);
//     searchParams.set('orgSortOrder', newSortOrder);
//     setSearchParams(searchParams);
//   };

//   // Handle search
//   const handleSearch = (searchValue) => {
//     setSearchInput(searchValue);
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//     searchParams.set('orgSearch', searchValue);
//     searchParams.set('orgPage', '1');
//     setSearchParams(searchParams);
//   };

//   // Handle type change
//   const handleTypeChange = (type) => {
//     setOrganizationType(type);
//     setSearchInput('');
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//     searchParams.delete('orgSearch');
//     searchParams.set('orgPage', 1);
//     searchParams.set('orgType', type);
//     setSearchParams(searchParams);
//   };

//   // Clear filters
//   const handleClearFilters = () => {
//     const defaultSortBy =
//       userRole === '0' || userRole === '3' ? 'expiringIn' : 'createdAt';
//     const defaultSortOrder = userRole === '0' || userRole === '3' ? '1' : '-1';

//     setOrganizationType('');
//     setSortBy(defaultSortBy);
//     setSortOrder(defaultSortOrder);
//     setSearchInput('');
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));

//     searchParams.delete('orgSearch');
//     searchParams.delete('orgType');
//     searchParams.set('orgPage', 1);
//     searchParams.set('orgSortBy', defaultSortBy);
//     searchParams.set('orgSortOrder', defaultSortOrder);
//     setSearchParams(searchParams);
//   };

//   // Page change
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= pagination.totalPages) {
//       setPagination((prev) => ({ ...prev, currentPage: Number(page) }));
//       searchParams.set('orgPage', page);
//       setSearchParams(searchParams);
//     }
//   };

//   // Table columns
//   const columns = useMemo(
//     () => [
//       {
//         Header: 'Organization Name',
//         accessor: 'name',
//         Cell: ({ row }) => (
//           <Link
//             className="flex gap-2 items-center hover:text-gray-900"
//             to={`/property-list/property-details?propertyId=${row.original._id}`}
//           >
//             {row.original.name}
//           </Link>
//         ),
//       },
//       {
//         Header: 'Institute Limit',
//         accessor: 'max_institute_limit',
//       },
//       {
//         Header: 'SubDomain',
//         accessor: 'subdomain',
//       },
//       {
//         Header: 'Status',
//         accessor: 'is_active',
//         Cell: ({ value }) => (value ? 'Active' : 'Deactive'),
//       },
//       {
//         Header: '',
//         accessor: '_id',
//         Cell: ({ row }) => (
//           <Link
//             className="relative group text-blue-500"
//             to={`/property-list/property-details?propertyId=${row.original._id}`}
//           >
//             {CONSTANTS.LINK.VIEW_DETAILS}
//             <Underline />
//           </Link>
//         ),
//       },
//     ],
//     []
//   );

//   // React Table setup
//   const tableInstance = useTable(
//     {
//       columns,
//       data: organizationList,
//       manualSortBy: true,
//     },
//     useSortBy
//   );

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     tableInstance;

//   // Effects
//   useEffect(() => {
//     fetchOrganizationTypes();
//   }, [recallApi]);

//   useEffect(() => {
//     fetchOrganizationListAPI(pagination.currentPage);
//   }, [
//     recallApi,
//     organizationType,
//     searchInput,
//     sortBy,
//     sortOrder,
//     pagination.currentPage,
//   ]);

//   return (
//     <div className="p-4">
//       <div className="flex items-center justify-start mb-5 gap-3">
//         <h1 className="text-2xl font-bold text-gray-800">
//           <span className="text-primary">Innobles</span> Organization Master
//         </h1>
//       </div>

//       <Search
//         searchInput={searchInput}
//         placeHolder="Search Organization ..."
//         onSearch={handleSearch}
//       />

//       <div className="flex flex-wrap items-center justify-between gap-5 mb-5">
//         <div className="flex flex-wrap items-center gap-5">
//           {/* Filter dropdown */}
//           <select
//             value={organizationType}
//             onChange={(e) => handleTypeChange(e.target.value)}
//             className="border rounded-md px-3 py-2 text-sm"
//           >
//             <option value="">All Types</option>
//             {organizationTypeList.map((type) => (
//               <option key={type.value} value={type.value}>
//                 {type.label}
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={handleClearFilters}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md px-4 py-2 text-sm"
//           >
//             Clear Filters
//           </button>
//         </div>

//         {userRole === '0' && (
//           <button
//             onClick={() => setIsEntityModalOpen(true)}
//             className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-5 py-2 text-sm"
//           >
//             Add More Organization
//           </button>
//         )}
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg shadow-md custom-scrollbar">
//         <table {...getTableProps()} className="min-w-full table-auto">
//           <thead className="bg-gray-100">
//             {headerGroups.map((headerGroup) => (
//               <tr {...headerGroup.getHeaderGroupProps()}>
//                 {headerGroup.headers.map((column) => (
//                   <th
//                     {...column.getHeaderProps(column.getSortByToggleProps())}
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSorting(column.id)}
//                   >
//                     {column.render('Header')}
//                     {column.isSorted
//                       ? column.isSortedDesc
//                         ? ' 🔽'
//                         : ' 🔼'
//                       : ''}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
//             {rows.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="text-center py-5 text-xs font-semibold text-gray-500"
//                 >
//                   {CONSTANTS.NO_DATA_MESSAGE}
//                 </td>
//               </tr>
//             ) : (
//               rows.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr {...row.getRowProps()} className="bg-white">
//                     {row.cells.map((cell) => (
//                       <td
//                         {...cell.getCellProps()}
//                         className="px-6 py-4 text-sm text-gray-600"
//                       >
//                         {cell.render('Cell')}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Pagination pagination={pagination} onPageChange={handlePageChange} />

//       {isEntityModalOpen && (
//         <AddOrganizationModal
//           closeModal={() => setIsEntityModalOpen(false)}
//           categoryId={false}
//           setRecallApi={setRecallApi}
//           recallApi={recallApi}
//         />
//       )}
//     </div>
//   );
// };

// export default OrganizationListPage;


import { useEffect, useState } from 'react';
import CONSTANTS from '../../constants.json';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import Underline from '../../components/Underline';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchOrganizationList } from '../../redux/apis/superadmin';
import AddOrganizationModal from './components/AddOrganizationModal';

const OrganizationListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const oPage = searchParams.get('oPage');
  const oSearch = searchParams.get('oSearch');
  const oSortBy = searchParams.get('oSortBy');
  const oSortOrder = searchParams.get('oSortOrder');

  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  const [organizationList, setOrganizationList] = useState([]);
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
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

  const fetchOrganizationListAPI = (page = 1) => {
    dispatch(
      fetchOrganizationList({
        search: searchInput,
        limit: pagination.limit,
        page,
        sortBy,
        sortOrder,
      })
    ).then((res) => {
      if (res.success) {
        setOrganizationList(res.data?.data || []);
        setPagination({
          currentPage: res.data?.currentPage || page,
          totalPages: res.data?.totalPages || 1,
          totalCount: res.data?.total || 0,
          limit: res.data?.pageSize || pagination.limit,
        });
      } else {
        toast.error(res.message || 'Failed to fetch organization list');
      }
    });
  };

  useEffect(() => {
    fetchOrganizationListAPI(pagination.currentPage);
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
          <span className="text-primary">Organization</span> Master
        </h1>
      </div>

      <Search
        searchInput={searchInput}
        placeHolder="Search Organization ..."
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

        {userRole === '0' && (
          <button
            onClick={() => setIsOrganizationModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-5 py-2 text-sm"
          >
            Add Organization
          </button>
        )}
      </div>

      <div className="flex flex-col mb-5">
        <h2 className="text-md font-semibold text-gray-500 mb-3 uppercase">
          Organization List
        </h2>
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
                  onClick={() => handleSorting('Business Name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Buseness Name
                </th>
                <th
                  onClick={() => handleSorting('email')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Owner Email
                </th>
                <th
                  onClick={() => handleSorting('phoneNo')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  Owner Phone
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
              {organizationList.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-5 text-xs font-semibold text-gray-500"
                  >
                    {CONSTANTS.NO_DATA_MESSAGE}
                  </td>
                </tr>
              ) : (
                organizationList.map((item, index) => (
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
                        to={`/organization-list/organization-details?organizationId=${item._id}`}
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

      {/* Organization Add Modal */}
      {isOrganizationModalOpen && (
        <AddOrganizationModal
          closeModal={() => setIsOrganizationModalOpen(false)}
          setRecallApi={setRecallApi}
          recallApi={recallApi}
        />
      )}
    </div>
  );
};

export default OrganizationListPage;

