import { RekordboxCommon } from "./common";

export interface Artist extends RekordboxCommon {
  id: string;
  name: string;
  //searchString: string;
  trackCount: number;
  albumCount: number;
}
