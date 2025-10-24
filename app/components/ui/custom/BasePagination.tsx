import { useCallback, useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "..";

interface Props {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  showPages?: 3 | 5 | 7;
}

export const BasePagination = ({
  page,
  setPage,
  totalPages,
  showPages = 3,
  ...props
}: Props & React.ComponentProps<"nav">) => {
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  const calculatePageNumbers = useCallback(() => {
    if (totalPages <= showPages) {
      setVisiblePages([...Array(totalPages).keys()]);
    } else {
      let startPage = Math.max(0, page - Math.floor(showPages / 2));

      if (startPage + showPages > totalPages) {
        startPage = Math.max(0, totalPages - showPages);
      }

      setVisiblePages([...Array(showPages)].map((_, i) => startPage + i));
    }
  }, [page, totalPages, showPages]);

  useEffect(() => {
    calculatePageNumbers();
  }, [page, totalPages, showPages]);

  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem className={`${page === 0 && "invisible"}`}>
          <PaginationPrevious onClick={() => setPage(Math.max(0, page - 1))} />
        </PaginationItem>
        {visiblePages.map((pageNumber) => (
          <PaginationItem
            key={pageNumber}
            className={pageNumber === page ? "bg-secondary rounded-md" : ""}
          >
            <PaginationLink onClick={() => setPage(pageNumber)}>
              {pageNumber + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem className={`${page === totalPages - 1 && "invisible"}`}>
          <PaginationNext
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
