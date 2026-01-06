import { RekordboxCommon } from "./common";
import { Track } from "./track";

export interface Playlist extends RekordboxCommon {
  id: string;
  sequence: number;
  name: string;
  artworkUrl: string;
  //imagePath: string;
  itemCount: number;
  attribute: number;
  parentId: string;
  smartList: string;
}

export interface PlaylistItem extends RekordboxCommon {
  id: string;
  playlist: Playlist;
  track: Track;
  trackNumber: string;
}
