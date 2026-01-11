import { RekordboxEntity, RekordboxCommon } from "./common";

export type Genre = RekordboxEntity & RekordboxCommon & {
  name: string;
  artistCount: number;
  trackCount: number;
}
