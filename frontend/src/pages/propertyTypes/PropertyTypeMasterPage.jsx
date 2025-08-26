import { useEffect, useState } from 'react';
import CONSTANTS from '../../constants.json';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Pagination from '../../components/Pagination';
import { setStatus } from '../../utils/setStatus';
import moment from 'moment/moment';
import { BiEdit } from 'react-icons/bi';
import ActionModal from '../../components/ActionModal';
import { fetchObjects } from '../../redux/apis/object';
import AddObject from '../../components/AddObject';
import TableHeading from '../../components/TableHeading';

const PropertyTypeMasterPage = () => {
  const [objects, setObjects] = useState([]);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [currentObjectStatus, setCurrentObjectStatus] = useState(null);
  const [isAddObjectModalOpen, setIsAddObjectModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('-1');
  const [recallApi, setRecallApi] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const dispatch = useDispatch();

  // Handle opening the ActionModal
  const handleActionClick = (userId, currentStatus) => {
    setSelectedObjectId(userId);
    setIsActionModalOpen(true);
    setCurrentObjectStatus(currentStatus);
  };

  // Handle sorting
  const handleSorting = (sortBy) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder === '1' ? '-1' : '1');
  };

  const fetchObjectAPI = (page = 1) => {
    dispatch(
      fetchObjects({
        type: 'property-type',
        limit: pagination.limit,
        page: page,
        sortBy,
        sortOrder,
      })
    ).then((res) => {
      if (res.success) {
        setObjects(res.data.propertyTypes || []);
        setPagination(
          res.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCount: res.data.length || 0,
            limit: 10,
          }
        );
      } else {
        toast.error(res.message);
      }
    });
  };

  useEffect(() => {
    fetchObjectAPI(pagination.currentPage);
  }, [recallApi, sortBy, sortOrder]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchObjectAPI(page);
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-start mb-5 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-primary">PropertyType</span> Master
        </h1>
      </div>

      <div className="flex flex-wrap gap-5 mb-5">
        <button
          onClick={() => setIsAddObjectModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-14 py-2"
        >
          {CONSTANTS.BUTTON.ADD_PROPERTY_TYPE}
        </button>
      </div>

      <div className="flex flex-col">
        <h2 className="text-md font-semibold text-gray-500 mb-3 uppercase">
          {CONSTANTS.PROPERTY_TYPE_LIST}
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-md custom-scrollbar">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <TableHeading
                  label="Property Type Name"
                  isSorted={sortBy === 'name'}
                  sortOrder={sortOrder}
                  onSort={() => handleSorting('name')}
                />
                <TableHeading
                  label={CONSTANTS.LABEL.DOC}
                  isSorted={sortBy === 'createdAt'}
                  sortOrder={sortOrder}
                  onSort={() => handleSorting('createdAt')}
                />
                <TableHeading
                  label={CONSTANTS.LABEL.STATUS}
                  isSorted={sortBy === 'status'}
                  sortOrder={sortOrder}
                  onSort={() => handleSorting('status')}
                />
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  {CONSTANTS.LABEL.ACTION}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {objects.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-5 text-xs font-semibold text-gray-500"
                  >
                    {CONSTANTS.NO_DATA_MESSAGE}
                  </td>
                </tr>
              ) : (
                objects.map((object, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 capitalize">
                      {object.propertyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(object.createdAt).format('DD MMM YYYY - hh:mmA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {setStatus(object.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex justify-center text-sm font-medium text-gray-900">
                      <BiEdit
                        className="text-blue-500 hover:text-blue-600 cursor-pointer"
                        size={20}
                        onClick={() =>
                          handleActionClick(object._id, object.status)
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Component */}
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>
      {/* Render Action Modal */}
      {isActionModalOpen && (
        <ActionModal
          closeModal={() => setIsActionModalOpen(false)}
          type="property type"
          id={selectedObjectId}
          currentStatus={currentObjectStatus}
          setRecallApi={setRecallApi}
          recallApi={recallApi}
        />
      )}
      {/* Render Add Object Modal */}
      {isAddObjectModalOpen && (
        <AddObject
          closeModal={() => setIsAddObjectModalOpen(false)}
          type="property type"
          recallApi={recallApi}
          setRecallApi={setRecallApi}
        />
      )}
    </div>
  );
};

export default PropertyTypeMasterPage;
