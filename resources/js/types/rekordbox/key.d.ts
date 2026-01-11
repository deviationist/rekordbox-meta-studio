import { RekordboxEntity, RekordboxCommon } from "./common";

export type Key = RekordboxEntity & RekordboxCommon & {
  scaleName: string;
  sequence: number;
}
