import { RekordboxCommon } from "./common";
import { Track } from "./track";

export interface Tag extends RekordboxCommon {
  id: string;
  sequence: number;
  name: string;
  attribute: number;
  parentId: string;
}

export interface TagItem extends RekordboxCommon {
  id: string;
  tag: Tag;
  track: Track;
  trackNumber: string;
}
