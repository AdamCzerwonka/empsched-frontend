export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export const defaultPaginationParams: PaginationParams = {
  pageNumber: 0,
  pageSize: 10,
};
