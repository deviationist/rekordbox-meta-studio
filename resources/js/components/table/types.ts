import { ColumnDef } from '@tanstack/react-table';
import { PageProps } from '@inertiajs/core'

export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export type GenericPageProps<TData> = PageProps & {
  data: TData[];
  meta: PaginationMeta;
};

export type GenericFilters = Record<string, string | number>;

export type TableProps<TData, TFilter> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  meta: PaginationMeta;
  endpoint: string;
  filterMarkup?: React.ReactNode;
  filters?: TFilter;
  storageKey?: string;
}
