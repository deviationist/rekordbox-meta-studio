import { Artist } from "./artist";
import { RekordboxCommon } from "./common";

export interface Album extends RekordboxCommon {
  id: string;
  name: string;
  artist: Artist;
  imagePath: string;
  compilation: number;
  //searchString: string;
}
