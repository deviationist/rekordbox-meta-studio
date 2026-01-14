<?php

namespace App\Http\Resources\Rekordbox;



class TrackResource extends BaseResource
{
    protected function additionalFields(): array
    {
        return [
            'id' => $this->ID,
            'filePath' => $this->FolderPath,
            'fileName' => $this->FileNameL,
            'title' => $this->Title,
            'artist' => ArtistResource::make($this->artist)->resolve(),
            'album' => AlbumResource::make($this->album)->resolve(),
            'genre' => GenreResource::make($this->genre)->resolve(),
            'bpm' => $this->BPM,
            'duration' => $this->length_human,
            'trackNumber' => $this->TrackNo,
            'bitRate' => $this->BitRate,
            'bitDepth' => $this->BitDepth,
            'comment' => $this->Commnt,
            'fileType' => $this->file_type_label,
            'rating' => $this->Rating,
            'releaseYear' => $this->ReleaseYear,
            'remixer' => ArtistResource::make($this->remixer)->resolve(),
            'label' => LabelResource::make($this->label)->resolve(),
            'originalArtist' => ArtistResource::make($this->originalArtist)->resolve(),
            'key' => KeyResource::make($this->Key)->resolve(),
            'stockDate' => $this->StockDate,
            //'colorId' => $this->ColorID,
            'playCount' => $this->DJPlayCount,
            'artwork' => $this->hasArtwork() ? ArtworkMetaResource::make($this->getArtworkMeta())->resolve() : null,
            //'artworkUrl' => $this->getArtworkUrl('m'),
            //'imagePath' => $this->ImagePath,
            //'masterDbId' => $this->MasterDBID,
            //'masterSongId' => $this->MasterSongID,
            //'analysisDataPath' => $this->AnalysisDataPath,
            //'searchString' => $this->SearchString,
            'fileSize' => $this->FileSize,
            'discNo' => $this->DiscNo,
            'composer' => ArtistResource::make($this->Composer)->resolve(),
            'subTitle' => $this->Subtitle,
            'sampleRate' => $this->SampleRate,
            //'disableQuantize' => $this->DisableQuantize,
            //'analysed' => $this->Analysed,
            'releaseDate' => $this->ReleaseDate,
            'dateCreated' => $this->DateCreated,
            //'contentLink' => $this->ContentLink,
            'tag' => $this->Tag,
            //'modifiedByRBM' => $this->ModifiedByRBM,
            //'hotCueAutoLoad' => $this->HotCueAutoLoad, // TODO: Return boolean if === "on"
            //'deliveryControl' => $this->DeliveryControl,
            //DeliveryComment
            //CueUpdated
            //AnalysisUpdated
            //TrackInfoUpdated
            'lyricist' => $this->Lyricist,
            'isrc' => $this->ISRC,
            //SamplerTrackInfo
            //SamplerPlayOffset
            //SamplerGain
            //VideoAssociate
            //LyricStatus
            //ServiceID
            //OrgFolderPath
            //Reserved1
            //Reserved2
            //Reserved3
            //Reserved4
            //ExtInfo
            //rb_file_id
            //DeviceID
            //rb_LocalFolderPath
            //SrcID
            //SrcTitle
            //SrcArtistName
            //SrcAlbumName
            //SrcLength*/
        ];
    }
}
