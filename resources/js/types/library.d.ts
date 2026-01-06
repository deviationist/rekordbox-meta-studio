export interface Library {
  id: number;
  userId: number;
  name: string;
  slug: string;
  filePath: string | null;
  storedFile: string | null;
  isRekordboxFolder: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
