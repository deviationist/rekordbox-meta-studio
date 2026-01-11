import { useCallback, useMemo, useState } from 'react';
import { type TableState, type ColumnPinningState, type ColumnOrderState, type ColumnSizingState, type VisibilityState } from '@tanstack/react-table';

interface StoredTableState {
  order: ColumnOrderState;
  visibility: VisibilityState;
  sizing: ColumnSizingState;
  pinned: ColumnPinningState;
}

interface UseTableStateOptions {
  storageKey: string;
  defaults?: Partial<StoredTableState>;
}

export interface ColumnSetStateCallbacks {
  columnOrder: (value: ColumnOrderState | ((prev: ColumnOrderState) => ColumnOrderState)) => void;
  columnVisibility: (value: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void;
  columnSizing: (value: ColumnSizingState | ((prev: ColumnSizingState) => ColumnSizingState)) => void;
  columnPinning: (value: ColumnPinningState | ((prev: ColumnPinningState) => ColumnPinningState)) => void;
}

export interface ColumnResetStateCallbacks {
  columnOrder: () => void;
  columnVisibility: () => void;
  columnSizing: () => void;
  columnPinning: () => void;
  all: () => void;
}

export interface UseTableState {
  columnOrder: ColumnOrderState;
  columnVisibility: VisibilityState;
  columnSizing: ColumnSizingState;
  columnPinning: ColumnPinningState;
  state: Pick<TableState, 'columnOrder' | 'columnVisibility' | 'columnSizing' | 'columnPinning'>;
  setState: ColumnSetStateCallbacks;
  resetState: ColumnResetStateCallbacks;
}

export function useTableState({ storageKey, defaults = {} }: UseTableStateOptions): UseTableState {
  const defaultState = useMemo(() => ({
    order: defaults.order || [],
    visibility: defaults.visibility || {},
    sizing: defaults.sizing || {},
    pinned: defaults.pinned || { left: [], right: [] },
  }), [defaults]);

  // Lazy initializer - reads from localStorage only once on mount
  const getInitialState = useCallback((): StoredTableState => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as StoredTableState;
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
    return defaultState;
  }, [storageKey, defaults, defaultState]);

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
  const [columnPinning, setPinnedColumnsState] = useState<ColumnPinningState>(
    () => getInitialState().pinned
  );

  // Helper to persist current state
  const persistState = useCallback((newState: Partial<StoredTableState>) => {
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

  const setPinnedColumns = useCallback((value: ColumnPinningState | ((prev: ColumnPinningState) => ColumnPinningState)) => {
    setPinnedColumnsState(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      persistState({ pinned: newValue });
      return newValue;
    });
  }, [persistState]);

  const resetColumnOrder = useCallback(() => setColumnOrderState(defaultState.order), [defaultState]);
  const resetColumnVisibility = useCallback(() => setColumnVisibilityState(defaultState.visibility), [defaultState]);
  const resetColumnSizing = useCallback(() => setColumnSizingState(defaultState.sizing), [defaultState]);
  const resetPinnedColumns = useCallback(() => setPinnedColumnsState(defaultState.pinned), [defaultState]);

  // Reset to defaults and clear localStorage
  const resetState = useMemo<ColumnResetStateCallbacks>(() => ({
    columnOrder: () => {
      resetColumnOrder();
      persistState({ order: defaultState.order });
    },
    columnVisibility: () => {
      resetColumnVisibility();
      persistState({ visibility: defaultState.visibility });
    },
    columnSizing: () => {
      resetColumnSizing();
      persistState({ sizing: defaultState.sizing });
    },
    columnPinning: () => {
      resetPinnedColumns();
      persistState({ pinned: defaultState.pinned });
    },
    all: () => {
      resetColumnOrder();
      resetColumnVisibility();
      resetColumnSizing();
      resetPinnedColumns();
      localStorage.removeItem(storageKey);
    },
  }), [storageKey, defaultState, persistState, resetColumnOrder, resetColumnVisibility, resetColumnSizing, resetPinnedColumns]);

  const setState = {
    columnOrder: setColumnOrder,
    columnVisibility: setColumnVisibility,
    columnSizing: setColumnSizing,
    columnPinning: setPinnedColumns,
  };

  const state = {
    columnOrder,
    columnVisibility,
    columnSizing,
    columnPinning,
  };

  return {
    ...state,
    state,
    setState,
    resetState,
  };
}
