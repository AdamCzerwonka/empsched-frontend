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
  if (isLoading) {
    return <>{loadingContent ?? <LoadingItem size={defaultLoadingSize} />}</>;
  }

  if (data && (Array.isArray(data) ? data.length > 0 : true)) {
    return <>{dataContent(data)}</>;
  }

  return <>{emptyContent}</>;
};
