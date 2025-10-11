export interface PaginationData<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
}

export const paginate = <T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): PaginationData<T> => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    itemsPerPage
  };
};

export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const getPageRange = (
  currentPage: number,
  totalPages: number,
  itemsPerPage: number
): { start: number; end: number; total: number } => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const calculatedEnd = currentPage * itemsPerPage;
  const actualEnd = Math.min(calculatedEnd, totalPages * itemsPerPage);
  
  return {
    start,
    end: actualEnd,
    total: totalPages * itemsPerPage
  };
};