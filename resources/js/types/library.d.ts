export interface Library {
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
