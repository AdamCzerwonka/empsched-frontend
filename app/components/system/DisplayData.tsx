import type { PagedData } from "~/types/api";
import { LoadingItem, type LoadingItemSize } from "../ui";

interface Props<T> {
  isLoading: boolean;
  data: T | undefined;
  loadingContent?: React.ReactNode;
  dataContent: (data: T) => React.ReactNode;
  emptyContent: React.ReactNode;
  defaultLoadingSize?: LoadingItemSize;
}

export const DisplayData = <T,>({
  isLoading,
  data,
  loadingContent,
  dataContent,
  emptyContent,
  defaultLoadingSize,
}: Props<T>) => {
  const isPagedData = (obj: any): obj is PagedData<T> => {
    return (
      obj && typeof obj === "object" && typeof obj.totalElements === "number"
    );
  };

  if (isLoading) {
    return <>{loadingContent ?? <LoadingItem size={defaultLoadingSize} />}</>;
  }

  if (data) {
    if (isPagedData(data)) {
      if (data.totalElements > 0) {
        return <>{dataContent(data)}</>;
      }
    } else if (Array.isArray(data) ? data.length > 0 : true) {
      return <>{dataContent(data)}</>;
    }
  }

  return <>{emptyContent}</>;
};
