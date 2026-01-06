import { useCallback, useState } from 'react';
import type { ColumnOrderState, ColumnSizingState, VisibilityState } from '@tanstack/react-table';

interface PinnedColumns {
  left: string[];
  right: string[];
}

interface TableState {
  order: ColumnOrderState;
  visibility: VisibilityState;
  sizing: ColumnSizingState;
  pinned: PinnedColumns;
}

interface UseTableStateOptions {
  storageKey: string;
  defaults?: Partial<TableState>;
}

export function useTableState({ storageKey, defaults = {} }: UseTableStateOptions) {
  // Lazy initializer - reads from localStorage only once on mount
  const getInitialState = useCallback((): TableState => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as TableState;
        return {
          order: parsed.order || defaults.order || [],
          visibility: parsed.visibility || defaults.visibility || {},
          sizing: parsed.sizing || defaults.sizing || {},
          pinned: parsed.pinned || defaults.pinned || { left: [], right: [] },
        };
      }
    } catch (e) {
      console.error('Failed to parse saved table state:', e);
    }

    // Return defaults if nothing saved or parse failed
    return {
      order: defaults.order || [],
      visibility: defaults.visibility || {},
      sizing: defaults.sizing || {},
      pinned: defaults.pinned || { left: [], right: [] },
    };
  }, [storageKey, defaults]);

  // Initialize state from localStorage
  const [columnOrder, setColumnOrderState] = useState<ColumnOrderState>(
    () => getInitialState().order
  );
  const [columnVisibility, setColumnVisibilityState] = useState<VisibilityState>(
    () => getInitialState().visibility
  );
  const [columnSizing, setColumnSizingState] = useState<ColumnSizingState>(
    () => getInitialState().sizing
  );
  const [pinnedColumns, setPinnedColumnsState] = useState<PinnedColumns>(
    () => getInitialState().pinned
  );

  // Helper to persist current state
  const persistState = useCallback((newState: Partial<TableState>) => {
    try {
      const saved = localStorage.getItem(storageKey);
      const current = saved ? JSON.parse(saved) : {};
      const updated = { ...current, ...newState };
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist table state:', e);
    }
  }, [storageKey]);

  // Wrapped setters that persist to localStorage
  const setColumnOrder = useCallback((value: ColumnOrderState | ((prev: ColumnOrderState) => ColumnOrderState)) => {
    setColumnOrderState(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      persistState({ order: newValue });
      return newValue;
    });
  }, [persistState]);

  const setColumnVisibility = useCallback((value: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => {
    setColumnVisibilityState(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      persistState({ visibility: newValue });
      return newValue;
    });
  }, [persistState]);

  const setColumnSizing = useCallback((value: ColumnSizingState | ((prev: ColumnSizingState) => ColumnSizingState)) => {
    setColumnSizingState(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      persistState({ sizing: newValue });
      return newValue;
    });
  }, [persistState]);

  const setPinnedColumns = useCallback((value: PinnedColumns | ((prev: PinnedColumns) => PinnedColumns)) => {
    setPinnedColumnsState(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      persistState({ pinned: newValue });
      return newValue;
    });
  }, [persistState]);

  // Reset to defaults and clear localStorage
  const resetState = useCallback(() => {
    const defaultState = {
      order: defaults.order || [],
      visibility: defaults.visibility || {},
      sizing: defaults.sizing || {},
      pinned: defaults.pinned || { left: [], right: [] },
    };

    setColumnOrderState(defaultState.order);
    setColumnVisibilityState(defaultState.visibility);
    setColumnSizingState(defaultState.sizing);
    setPinnedColumnsState(defaultState.pinned);

    localStorage.removeItem(storageKey);
  }, [storageKey, defaults]);

  return {
    columnOrder,
    setColumnOrder,
    columnVisibility,
    setColumnVisibility,
    columnSizing,
    setColumnSizing,
    pinnedColumns,
    setPinnedColumns,
    resetState,
  };
}
