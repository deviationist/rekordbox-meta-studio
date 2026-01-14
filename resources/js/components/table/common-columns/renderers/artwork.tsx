import { useLibrary } from '@/contexts/library-context';
import { useRoute } from "@/hooks/use-route";
import { RekordboxEntity, RekordboxArtwork, ArtworkSize } from "@/types/rekordbox/common";
import { Row } from "@tanstack/react-table";

export function Artwork<Type extends RekordboxArtwork & RekordboxEntity>({ row, size = 'm' }: { row: Row<Type>, size?: ArtworkSize }) {
  const route = useRoute();
  const [library] = useLibrary();
  if (!library) return <></>;
  return (
    <div className="overflow-hidden w-full h-[30px] bg-muted/50">
      {row.original.hasArtwork ? (
        <img
          src={route('library.tracks.artwork.show', { size, library, track: row.original.id })}
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
