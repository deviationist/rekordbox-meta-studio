import { RekordboxEntity, RekordboxArtwork, RekordboxCommon } from "./common";
import { Track } from "./track";

export type Playlist = RekordboxEntity & RekordboxCommon & RekordboxArtwork & {
  sequence: number;
  name: string;
  //artworkUrl: string;
  //imagePath: string;
  itemCount: number;
  attribute: number;
  parentId: string;
  smartList: string;
}

export type PlaylistItem = RekordboxCommon & {
  id: string;
  playlist: Playlist;
  track: Track;
  trackNumber: string;
}
