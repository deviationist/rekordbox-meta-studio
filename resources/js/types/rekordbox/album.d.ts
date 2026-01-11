import { Artist } from "./artist";
import { RekordboxEntity, RekordboxCommon } from "./common";

export type Album = RekordboxEntity & RekordboxCommon & {
  name: string;
  artist: Artist;
  imagePath: string;
  compilation: number;
  //searchString: string;
}
