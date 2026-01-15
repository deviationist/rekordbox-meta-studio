import { RekordboxEntity, RekordboxCommon, RekordboxArtwork } from "./common";
import { Track } from "./track";

export type Playlist = RekordboxArtwork & RekordboxEntity & RekordboxCommon & {
  sequence: number;
  name: string;
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
