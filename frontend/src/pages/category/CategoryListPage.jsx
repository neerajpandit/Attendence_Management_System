import { useEffect, useState } from 'react';
import CONSTANTS from '../../constants.json';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../components/Pagination';
import Search from '../../components/Search';
import { useSearchParams } from 'react-router-dom';
import { fetchCategoryList } from '../../redux/apis/category';
import { fetchFeeHeadList, addFeeStructure } from '../../redux/apis/feehead';
import AddCategoryModal from './components/AddCategoryModel';

const CategoryListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramPage = searchParams.get('pPage');
  const paramSearch = searchParams.get('pSearch');
  const paramSortBy = searchParams.get('pSortBy');
  const paramSortOrder = searchParams.get('pSortOrder');

  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  const [categoryList, setCategoryList] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(paramSearch || '');
  const [sortBy, setSortBy] = useState(paramSortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState(paramSortOrder || '-1');
  const [recallCategoryAPI, setRecallCategoryAPI] = useState(false);

  const [feeHeadList, setFeeHeadList] = useState([]);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedFeeHeadId, setSelectedFeeHeadId] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: Number(paramPage) || 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const dispatch = useDispatch();

  const handleAddCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };

  const handleSorting = (newSortBy) => {
    const newSortOrder = sortOrder === '1' ? '-1' : '1';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    searchParams.set('pSortBy', newSortBy);
    searchParams.set('pSortOrder', newSortOrder);
    setSearchParams(searchParams);
  };

  const handleSearch = (input) => {
    setSearchInput(input);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    searchParams.set('pSearch', input);
    searchParams.set('pPage', '1');
    setSearchParams(searchParams);
  };

  const getCategoryList = (page = 1) => {
    dispatch(
      fetchCategoryList({
        search: searchInput,
        limit: pagination.limit,
        page,
        sortBy,
        sortOrder,
      })
    ).then((res) => {
      if (res.success) {
        setCategoryList(res.data || []);
        setPagination(
          res.pagination || {
            currentPage: page,
            totalPages: 1,
            totalCount: 0,
            limit: pagination.limit,
          }
        );
      } else {
        toast.error(res.message || 'Failed to fetch category list');
      }
    });
  };

  useEffect(() => {
    getCategoryList(pagination.currentPage);
  }, [
    recallCategoryAPI,
    searchInput,
    sortBy,
    sortOrder,
    pagination.currentPage,
  ]);

  useEffect(() => {
    setSearchInput(paramSearch || '');
    setSortBy(paramSortBy || 'createdAt');
    setSortOrder(paramSortOrder || '-1');
    setPagination((prev) => ({
      ...prev,
      currentPage: Number(paramPage) || 1,
    }));
  }, [searchParams]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: Number(page) || 1 }));
      searchParams.set('pPage', page);
      setSearchParams(searchParams);
    }
  };

  const handleAddFeeNode = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedFeeHeadId(null);

    dispatch(fetchFeeHeadList({ categoryId }))
      .then((res) => {
        if (res.success) {
          setFeeHeadList(res.data || []);
        } else {
          toast.error(res.message || 'Failed to fetch fee heads');
        }
      })
      .catch(() => {
        toast.error('Error while fetching fee heads');
      });

    setShowFeeModal(true);
  };

  const handleSubmitFeeNode = () => {
    if (!selectedFeeHeadId) {
      toast.error('Please select a fee head');
      return;
    }

    dispatch(
      addFeeStructure({
        feeheadId: selectedFeeHeadId,
        categoryId: selectedCategoryId,
      })
    )
      .then((res) => {
        if (res.success) {
          toast.success('Fee structure added successfully');
          setShowFeeModal(false);
        } else {
          toast.error(res.message || 'Failed to add fee structure');
        }
      })
      .catch(() => {
        toast.error('Something went wrong while adding fee structure');
      });
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

  return (
    <div className="p-4">
      <div className="flex items-center justify-start mb-5 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-primary">Category</span> Master
        </h1>
      </div>



      <div className="flex justify-end mb-5">
        {(userRole === '0' || userRole === '1' || userRole === '2') && (
          <button
            onClick={handleAddCategoryModal}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-5 py-2 text-sm"
          >
            Add Category
          </button>
        )}
      </div>

      <div className="flex flex-col mb-5">
        <h2 className="text-md font-semibold text-gray-500 mb-3 uppercase">
          Category List
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-md custom-scrollbar">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <Heading label="Category Name" />
                <Heading label="Category Code" />
                <Heading label="Fee" />
                <Heading label="Description" />
                <Heading label="Status" />
                <Heading label="Action" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categoryList.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-5 text-xs font-semibold text-gray-500"
                  >
                    {CONSTANTS.NO_DATA_MESSAGE}
                  </td>
                </tr>
              ) : (
                categoryList.map((category, index) => (
                  <tr
                    key={category._id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 capitalize">
                      {category.name}
                    </td>
                    <Column label={category.category_code || '-'} />
                    <Column label={category?.fees[0]?.amount?.amount || '-'} />
                    <Column label={category.description || '-'} />
                    <Column
                      label={
                        category.is_active === true
                          ? 'Active'
                          : category.is_active === false
                            ? 'Deactive'
                            : '-'
                      }
                    />
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-500">
                      <button
                        onClick={() => handleAddFeeNode(category._id)}
                        className="text-blue-600 hover:underline"
                      >
                        Add Fee Node
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>

      {isCategoryModalOpen && (
        <AddCategoryModal
          closeModal={() => setIsCategoryModalOpen(false)}
          categoryId={false}
          setRecallApi={setRecallCategoryAPI}
          recallApi={recallCategoryAPI}
        />
      )}

      {/* Fee Head Modal */}
      {showFeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setShowFeeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Add Fee Node
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              Select a fee head to add it to the chosen category.
            </p>

            {/* Fee Head List */}
            <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {feeHeadList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17v-6a4 4 0 118 0v6m-2 4h-4a2 2 0 01-2-2v-4h8v4a2 2 0 01-2 2z"
                    />
                  </svg>
                  No fee heads available.
                </div>
              ) : (
                <ul className="space-y-3">
                  {feeHeadList.map((fee) => (
                    <li
                      key={fee._id}
                      onClick={() => setSelectedFeeHeadId(fee._id)}
                      className={`flex justify-between items-center border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 
                  ${
                    selectedFeeHeadId === fee._id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-400 hover:shadow'
                  }`}
                    >
                      <div>
                        <p className="text-gray-800 font-medium">{fee.name}</p>
                        <p className="text-gray-500 text-xs">
                          Fee Head ID: {fee._id}
                        </p>
                      </div>
                      <span className="text-blue-600 font-semibold">
                        ₹{fee.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowFeeModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeeNode}
                className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium shadow transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryListPage;
