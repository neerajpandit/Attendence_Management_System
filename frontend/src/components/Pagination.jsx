import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, limit, totalCount } = pagination;

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Display total results */}
      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * limit + 1} to{' '}
        {Math.min(currentPage * limit, totalCount)} of {totalCount} results
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          Prev
        </button>

        {/* Current Page */}
        <button className="px-3 py-1 rounded-md bg-blue-500 text-white cursor-default">
          {currentPage}
        </button>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages || totalPages === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
