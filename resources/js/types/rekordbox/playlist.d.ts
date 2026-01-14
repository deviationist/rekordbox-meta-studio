import { Artwork } from "./artwork";
import { RekordboxEntity, RekordboxCommon } from "./common";
import { Track } from "./track";

export type Playlist = RekordboxEntity & RekordboxCommon & {
  sequence: number;
  name: string;
  itemCount: number;
  attribute: number;
  parentId: string;
  smartList: string;
  artwork?: Artwork;
}

export type PlaylistItem = RekordboxCommon & {
  id: string;
  playlist: Playlist;
  track: Track;
  trackNumber: string;
}
