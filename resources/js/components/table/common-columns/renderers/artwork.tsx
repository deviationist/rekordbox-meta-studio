import { useRoute } from "@/hooks/use-route";
import { RekordboxEntity, RekordboxArtwork } from "@/types/rekordbox/common";
import { Row } from "@tanstack/react-table";

export function Artwork<Type extends RekordboxArtwork & RekordboxEntity>({ row }: { row: Row<Type>}) {
  const route = useRoute();
  return (
    <div className="overflow-hidden w-full h-[30px] bg-muted/50">
      {row.original.hasArtwork ? (
        <img
          src={route('library.tracks.artwork.show', { size: 'm', library: 'c0b67651-f91b-4e9b-a2e7-a4abf925c1ff', track: row.original.id })}
          alt="Album artwork"
          className="w-full h-full object-cover object-top"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-muted-foreground">-</span>
        </div>
      )}
    </div>
  );
}
