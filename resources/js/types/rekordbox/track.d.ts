import { Album } from "./album"
import { Artist } from "./artist"
import { Artwork } from "./artwork"
import { RekordboxEntity, RekordboxCommon } from "./common"
import { type FileType } from "./file-type"
import { Genre } from "./genre"
import { Key } from "./key"
import { Label } from "./label"
import { Tag } from "./tag"

export type Track = RekordboxEntity & RekordboxCommon & {
  artwork?: Artwork;

  filePath: string;
  fileName: string;
  title: string;
  artist: Artist;
  album: Album;
  genre: Genre;
  bpm: number;
  duration: string;
  trackNumber: number;
  bitRate: number;
  bitDepth: number;
  comment: string;
  fileType: FileType;
  rating: number;
  releaseYear: number;
  remixer?: Artist;
  label?: Label;
  originalArtist?: Artist;
  key: Key;
  stockDate: string; // Should be cast to Date?
  //colorId: string;
  playCount: number;
  //artworkUrl: string;
  //imagePath: string;
  //masterDbId: string;
  //masterSongId: string;
  //analysisDataPath: string;
  //searchString: string;
  fileSize: number;
  discNo: number;
  composer?: Artist;
  subTitle: string;
  sampleRate: number;
  //disableQuantize: number;
  //analysed: number;
  releaseDate: string; // Should be cast to Date?
  dateCreated: string; // Should be cast to Date?
  //contentLink: number;
  tag?: Tag;
  //modifiedByRBM: string;
  //hotCueAutoLoad: boolean;
  //deliveryControl: string;
  //deliveryComment: string;
  //cueUpdated: string;
  //analysisUpdated: string;
  //trackInfoUpdated: string;
  lyricist: string;
  isrc: string;
  //samplerTrackInfo: number;
  //samplerPlayOffset: number;
  //samplerGain: number;
  //videoAssociate: string;
  //lyricStatus: number;
  //serviceID: number;
  //orgFolderPath: string;
  //reserved1: string;
  //reserved2: string;
  //reserved3: string;
  //reserved4: string;
  //extInfo: string;
  //rb_file_id: string;
  //deviceID: string;
  //rb_LocalFolderPath: string;
  //srcID: string;
  //srcTitle: string;
  //srcArtistName: string;
  //srcAlbumName: string;
  //srcLength: number;
}
