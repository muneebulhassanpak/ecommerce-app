interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSize: number;
  disablePageSizeChange?: boolean;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  totalEntries,
  onPageChange,
  onPageSizeChange,
  pageSize,
  disablePageSizeChange = false,
}: CustomPaginationProps) {
  return (
    <div className="flex items-center flex-col md:flex-row justify-between p-4 mt-5 md:mt-0 gap-3 md:gap-0">
      <div className="flex-1 text-sm text-gray-700 mb-2 sm:mb-0">
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries}{" "}
        entries
      </div>
      <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center space-x-6">
        {!disablePageSizeChange && (
          <select
            className="border rounded p-1"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="30">30 per page</option>
            <option value="40">40 per page</option>
            <option value="50">50 per page</option>
          </select>
        )}
        <div className="space-x-2">
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
