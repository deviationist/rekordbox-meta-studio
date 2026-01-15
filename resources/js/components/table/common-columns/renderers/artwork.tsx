import { useArtworkViewer } from '@/contexts/artwork-viewer-context';
import { type Artwork } from '@/types/rekordbox/artwork';
import { RekordboxEntity } from "@/types/rekordbox/common";
import { Row, Table } from "@tanstack/react-table";

export function Artwork<Type extends { artwork?: Artwork } & RekordboxEntity>({ row, table }: { row: Row<Type>, table: Table<Type> }) {
  const { artwork } = row.original;
  const { openViewer } = useArtworkViewer();
  return (
    artwork ? (
      <button onClick={() => openViewer(row, table)} className="cursor-pointer overflow-hidden w-full h-[30px] bg-muted/50">
        <img
          src={artwork.src}
          alt={artwork.alt}
          title={artwork.title}
          className="w-full h-full object-cover object-top"
        />
      </button>
    ) : (
      <div className="overflow-hidden w-full h-[30px] bg-muted/50">
        <div className="flex items-center justify-center h-full">
          <span className="text-muted-foreground">-</span>
        </div>
      </div>
    )
  );
}
