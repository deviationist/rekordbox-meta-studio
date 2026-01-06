import { RekordboxCommon } from "./common";

export interface Key extends RekordboxCommon {
  id: string;
  scaleName: string;
  sequence: number;
}
