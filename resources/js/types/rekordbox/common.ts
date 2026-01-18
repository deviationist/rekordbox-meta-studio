import { Artwork } from "./artwork";

export type RekordboxCommon = {
  uuid: string;
  //rb_data_status: number;
  //rb_local_data_status: number;
  //rb_local_deleted: number;
  //rb_local_synced: number;
  usn: number;
  //rb_local_usn: number;
  createdAt: string; // Should be cast to Date?
  updatedAt: string; // Should be cast to Date?
}

export type RekordboxArtwork = {
  artwork?: Artwork;
};

export type RekordboxEntity = {
  id: number;
};

export type ArtworkSize = 'm' | 's';
