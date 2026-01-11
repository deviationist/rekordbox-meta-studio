import { RekordboxEntity, RekordboxCommon } from "./common";
import { Track } from "./track";

export type Tag = RekordboxEntity & RekordboxCommon & {
  sequence: number;
  name: string;
  attribute: number;
  parentId: string;
}

export type TagItem = RekordboxEntity & RekordboxCommon & {
  tag: Tag;
  track: Track;
  trackNumber: string;
}
