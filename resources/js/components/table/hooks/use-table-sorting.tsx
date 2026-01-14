import { useQueryState, parseAsString } from 'nuqs';
import { useEffect } from 'react';
import { ColumnSort } from '@tanstack/react-table';

export function useTableSorting(
  defaultSort?: ColumnSort,
  onSortChange?: (sort: ColumnSort | null) => void
) {
  const defaultParam = defaultSort
    ? `${defaultSort.id}.${defaultSort.desc ? 'desc' : 'asc'}`
    : '';

  const [sortParam, setSortParam] = useQueryState(
    'sort',
    parseAsString.withDefault(defaultParam)
  );

  // Parse the current sort state
  const currentSort = sortParam
    ? {
        id: sortParam.split('.')[0],
        desc: sortParam.split('.')[1] === 'desc',
      }
    : null;

  // Notify parent when sort changes
  useEffect(() => {
    onSortChange?.(currentSort);
  }, [sortParam]);

  const setSort = (sortBy: string | null) => {
    setSortParam(sortBy);
  };

  const toggleSort = (columnId: string) => {
    if (!currentSort || currentSort.id !== columnId) {
      // No sort or different column - sort ascending
      setSortParam(`${columnId}.asc`);
    } else if (currentSort.desc === false) {
      // Currently ascending - switch to descending
      setSortParam(`${columnId}.desc`);
    } else {
      // Currently descending - clear sort
      setSortParam(defaultParam || null);
    }
  };

  return {
    currentSort,
    setSort,
    toggleSort,
  };
}
