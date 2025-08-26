import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTable, useSortBy } from "react-table";

import CONSTANTS from "../../constants.json";
import Pagination from "../../components/Pagination";
import Search from "../../components/Search";
import Underline from "../../components/Underline";
import { fetchEntityList } from "../../redux/apis/properties";
import { fetchObjects } from "../../redux/apis/object";
import AddEntityModal from "./components/AddEntityModel";

const EntityListPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  // Filters & query params
  const [entityList, setEntityList] = useState([]);
  const [entityTypeList, setEntityTypeList] = useState([]);
  const [entityType, setEntityType] = useState(searchParams.get("eType") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("eSearch") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("eSortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("eSortOrder") || "-1");
  const [recallApi, setRecallApi] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: Number(searchParams.get("ePage")) || 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);

  // Fetch entity types
  const fetchEntityTypes = () => {
    dispatch(
      fetchObjects({
        type: "entity",
        limit: 100,
        page: 1,
        sortBy: "createdAt",
        sortOrder: "-1",
      })
    ).then((res) => {
      if (res.success) {
        setEntityTypeList(
          res.data.propertyTypes
            .filter((item) => item.status === "0")
            .map((item) => ({
              value: item._id,
              label: item.propertyName,
            }))
        );
      }
    });
  };

  // Fetch entity list
  const fetchEntityListAPI = (page = 1) => {
    dispatch(
      fetchEntityList({
        propertyType: entityType,
        search: searchInput,
        limit: pagination.limit,
        page,
        sortBy,
        sortOrder,
      })
    ).then((res) => {
      if (res.success) {
        setEntityList(res.data || []);
        setPagination(
          res.pagination || {
            currentPage: page,
            totalPages: 1,
            totalCount: 0,
            limit: pagination.limit,
          }
        );
      } else {
        toast.error(res.message || "Failed to fetch entity list");
      }
    });
  };

  // Handle sorting
  const handleSorting = (column) => {
    const newSortOrder = sortOrder === "1" ? "-1" : "1";
    setSortBy(column);
    setSortOrder(newSortOrder);
    searchParams.set("eSortBy", column);
    searchParams.set("eSortOrder", newSortOrder);
    setSearchParams(searchParams);
  };

  // Handle search
  const handleSearch = (searchValue) => {
    setSearchInput(searchValue);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    searchParams.set("eSearch", searchValue);
    searchParams.set("ePage", "1");
    setSearchParams(searchParams);
  };

  // Handle type change
  const handleTypeChange = (type) => {
    setEntityType(type);
    setSearchInput("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    searchParams.delete("eSearch");
    searchParams.set("ePage", 1);
    searchParams.set("eType", type);
    setSearchParams(searchParams);
  };

  // Clear filters
  const handleClearFilters = () => {
    setEntityType("");
    setSortBy(userRole === "0" || userRole === "3" ? "expiringIn" : "createdAt");
    setSortOrder(userRole === "0" || userRole === "3" ? "1" : "-1");
    setSearchInput("");
    searchParams.delete("eSearch");
    searchParams.set("ePage", 1);
    searchParams.set("eSortBy", sortBy);
    searchParams.set("eSortOrder", sortOrder);
    setSearchParams(searchParams);
  };

  // Page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: Number(page) }));
      searchParams.set("ePage", page);
      setSearchParams(searchParams);
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        Header: "Entity Name",
        accessor: "name",
        Cell: ({ row }) => (
          <Link
            className="flex gap-2 items-center hover:text-gray-900"
            to={`/property-list/property-details?propertyId=${row.original._id}`}
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        Header: "Institute Limit",
        accessor: "max_institute_limit",
      },
      {
        Header: "SubDomain",
        accessor: "subdomain",
      },
      {
        Header: "Status",
        accessor: "is_active",
        Cell: ({ value }) => (value ? "Active" : "Deactive"),
      },
      {
        Header: "",
        accessor: "_id",
        Cell: ({ row }) => (
          <Link
            className="relative group text-blue-500"
            to={`/property-list/property-details?propertyId=${row.original._id}`}
          >
            {CONSTANTS.LINK.VIEW_DETAILS}
            <Underline />
          </Link>
        ),
      },
    ],
    []
  );

  // React Table setup
  const tableInstance = useTable(
    {
      columns,
      data: entityList,
      manualSortBy: true,
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  // Effects
  useEffect(() => {
    fetchEntityTypes();
  }, [recallApi]);

  useEffect(() => {
    fetchEntityListAPI(pagination.currentPage);
  }, [recallApi, entityType, searchInput, sortBy, sortOrder, pagination.currentPage]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-start mb-5 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-primary">Innobles</span> Master
        </h1>
      </div>

      <Search
        searchInput={searchInput}
        placeHolder="Search Entity ..."
        onSearch={handleSearch}
      />

      <div className="flex flex-wrap items-center justify-between gap-5 mb-5">
        <div className="flex flex-wrap items-center gap-5">

        </div>

        {userRole === "0" && (
          <button
            onClick={() => setIsEntityModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-5 py-2 text-sm"
          >
            Add More Entity
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md custom-scrollbar">
        <table {...getTableProps()} className="min-w-full table-auto">
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-5 text-xs font-semibold text-gray-500"
                >
                  {CONSTANTS.NO_DATA_MESSAGE}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="bg-white">
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-6 py-4 text-sm text-gray-600"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      {isEntityModalOpen && (
        <AddEntityModal
          closeModal={() => setIsEntityModalOpen(false)}
          categoryId={false}
          setRecallApi={setRecallApi}
          recallApi={recallApi}
        />
      )}
    </div>
  );
};

export default EntityListPage;
