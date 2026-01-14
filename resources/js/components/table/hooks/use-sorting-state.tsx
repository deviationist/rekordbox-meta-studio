import { useQueryState, parseAsString, parseAsStringEnum } from 'nuqs';
import { useEffect, useMemo } from 'react';
import { ColumnSort, SortingState, SortDirection, OnChangeFn } from '@tanstack/react-table';

export interface UseSortingState {
  sortBy: string;
  sortOrder: SortDirection;
  currentSort: ColumnSort | null;
  sortingState: SortingState,
  setSorting: OnChangeFn<SortingState>;
}

interface UseSortingStateProps {
  defaultSort?: ColumnSort,
  onSortChange?: (sort: ColumnSort | null) => void
}

export function useSortingState({
  defaultSort,
  onSortChange,
}: UseSortingStateProps = {}): UseSortingState {

  const [sortBy, setSortBy] = useQueryState(
    'sortBy',
    parseAsString.withDefault(defaultSort?.id ?? '')
  );
  console.log("sortBy", sortBy);

  const [sortOrder, setSortOrder] = useQueryState<SortDirection>(
    'sortOrder',
    parseAsStringEnum<SortDirection>(['asc', 'desc'])
      .withDefault(defaultSort?.desc ? 'desc' : 'asc')
  );

  const currentSort = useMemo<ColumnSort | null>(() => {
    if (sortBy) {
      return {
        id: sortBy,
        desc: sortOrder === 'desc',
      } as ColumnSort;
    }
    return null;
  }, [sortBy, sortOrder]);
  const sortingState = useMemo<SortingState>(() => currentSort ? [currentSort] : [], [currentSort])

  useEffect(() => onSortChange?.(currentSort), [onSortChange, currentSort]);

  const setSorting: OnChangeFn<SortingState> = (updaterOrValue) => {
    const newSortingState = typeof updaterOrValue === 'function'
      ? updaterOrValue(sortingState) // Call the updater with current state
      : updaterOrValue;
    const [columnSort] = newSortingState;
    console.log("hmm", columnSort);
    if (columnSort) {
      setSortBy(columnSort.id);
      setSortOrder(columnSort.desc ? 'desc' : 'asc');
    } else {
      // Handle empty sorting state (when sorting is cleared)
      setSortBy(null);
      setSortOrder(null);
    }
  };

  return {
    sortBy,
    sortOrder,
    currentSort,
    sortingState,
    setSorting,
  };
}
