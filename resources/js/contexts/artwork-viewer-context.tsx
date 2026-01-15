import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Artwork } from '@/types/rekordbox/artwork';
import { Table, Row } from '@tanstack/react-table';
import { RekordboxArtwork, RekordboxEntity } from '@/types/rekordbox/common';

type ArtworkViewerContextType = {
  row: Row<BaseRekordboxData> | undefined;
  artwork: Artwork | null;
  isOpen: boolean;
  openViewer: <TData extends RekordboxEntity & RekordboxArtwork>(
    row: Row<TData>,
    table: Table<TData>
  ) => void;
  closeViewer: () => void;
  navigateNext: () => void;
  navigatePrev: () => void;
  canNavigate: boolean;
  totalCount: number;
};

const ArtworkViewerContext = createContext<ArtworkViewerContextType | undefined>(undefined);

export const useArtworkViewer = () => {
  const context = useContext(ArtworkViewerContext);
  if (!context) {
    throw new Error('useArtworkViewer must be used within ArtworkViewerProvider');
  }
  return context;
};

type BaseRekordboxData = RekordboxEntity & RekordboxArtwork;

const hasArtwork = (row?: Row<BaseRekordboxData>) => !!row?.original.artwork;

interface ArtworkViewerProviderProps {
  children: React.ReactNode;
  skipMissingImages?: boolean;
}

export function ArtworkViewerProvider({ children, skipMissingImages = false }: ArtworkViewerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [row, setRow] = useState<Row<BaseRekordboxData>>();
  const [table, setTable] = useState<Table<BaseRekordboxData>>();
  const artwork = useMemo(() => row?.original.artwork ?? null, [row]);

  const openViewer = useCallback(
    <TData extends RekordboxEntity & RekordboxArtwork>(
      row: Row<TData>,
      table: Table<TData>
    ) => {
      setRow(row as unknown as Row<BaseRekordboxData>);
      setTable(table as unknown as Table<BaseRekordboxData>);
      setIsOpen(true);
    },
    []
  );

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setRow(undefined);
      setTable(undefined);
    }, 300);
  }, []);

  const findNextRow = useCallback((direction: 'next' | 'prev') => {
    if (!table || !row) return;

    const rows = table.getRowModel().rows;
    const currentIdx = rows.findIndex(r => r.id === row.id);
    const isNext = direction === 'next';

    // Create search range: forward or backward with wrap-around
    const searchIndices = isNext
      ? [...Array(rows.length).keys()].slice(currentIdx + 1).concat(
          [...Array(currentIdx).keys()]
        )
      : [...Array(currentIdx).keys()].reverse().concat(
          [...Array(rows.length - currentIdx - 1).keys()].map(i => rows.length - 1 - i)
        );

    for (const i of searchIndices) {
      const targetRow = rows[i];
      if (!skipMissingImages || hasArtwork(targetRow)) {
        setRow(targetRow);
        return;
      }
    }
  }, [table, row, skipMissingImages]);

  const navigateNext = useCallback(() => findNextRow('next'), [findNextRow]);
  const navigatePrev = useCallback(() => findNextRow('prev'), [findNextRow]);

  const canNavigate = table ? table.getRowModel().rows.filter((targetRow) => !skipMissingImages || hasArtwork(targetRow)).length > 1 : false;
  const totalCount = table ? table.getRowModel().rows.filter((targetRow) => !skipMissingImages || hasArtwork(targetRow)).length : 0;

  return (
    <ArtworkViewerContext.Provider
      value={{
        row,
        artwork,
        isOpen,
        openViewer,
        closeViewer,
        navigateNext,
        navigatePrev,
        canNavigate,
        totalCount,
      }}
    >
      {children}
    </ArtworkViewerContext.Provider>
  );
};
