export type LibraryIndex = LibrarySupports & {
  id: string;
  userId: number;
  name: string;
  filePath: string | null;
  storedFile: string | null;
  isRekordboxFolder: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type Library = LibrarySupports & {
  id: string;
  name: string;
}

export type LibrarySupports = {
  supports: {
    artwork?: boolean;
  }
}

export interface LibraryStatus {
  file: {
    exists: boolean;
    path: string;
    size: number;
    sizeFormatted: string;
    isWritable: boolean;
    lastModified: string | null;
    lastModifiedHuman: string | null;
  };
  database: {
    canConnect: boolean;
    connectionName: string;
    totalTables: number;
    totalRows: number;
    tables: Array<{
      name: string;
      rowCount: number;
      columnCount: number;
      columns: Array<{
        name: string;
        type: string;
        nullable: boolean;
        primaryKey: boolean;
      }>;
    }>;
  };
}
