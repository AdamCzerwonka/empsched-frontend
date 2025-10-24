export interface PagedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}
