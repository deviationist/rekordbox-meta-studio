import { RekordboxEntity, RekordboxCommon } from "./common";

export type Artist = RekordboxEntity & RekordboxCommon & {
  name: string;
  //searchString: string;
  trackCount: number;
  albumCount: number;
}
