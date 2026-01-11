import { RekordboxEntity, RekordboxCommon } from "./common";

export type Label = RekordboxEntity & RekordboxCommon & {
  name: string;
  artistCount: number;
  trackCount: number;
}
