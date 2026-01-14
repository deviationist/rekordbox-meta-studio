import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useLibrary } from '@/contexts/library-context';
import { type Artwork } from '@/types/rekordbox/artwork';
import { RekordboxEntity } from "@/types/rekordbox/common";
import { Row } from "@tanstack/react-table";
import { X } from 'lucide-react';
import { useState } from 'react';

export function Artwork<Type extends { artwork?: Artwork } & RekordboxEntity>({ row }: { row: Row<Type> }) {
  const [library] = useLibrary();
  const [open, setOpen] = useState<boolean>(false);
  const { artwork } = row.original;
  if (!library) return <></>;
  return (
      artwork ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <button onClick={() => setOpen(true)} className="overflow-hidden w-full h-[30px] bg-muted/50 cursor-pointer">
            <img
              src={artwork.src}
              alt={artwork.alt}
              title={artwork.title}
              className="w-full h-full object-cover object-top"
            />
          </button>
          <DialogContent showCloseButton={false} className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 border-0 bg-black/95">
            <DialogClose asChild>
              <Button variant="ghost" className="absolute top-4 right-4 z-50 p-2 cursor-pointer">
                <X className="h-6 w-6 text-white" />
              </Button>
            </DialogClose>
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={artwork.srcOriginal}
                alt={artwork.alt}
                title={artwork.title}
                className="max-w-full max-h-full object-contain p-4"
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="overflow-hidden w-full h-[30px] bg-muted/50">
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground">-</span>
          </div>
        </div>
      )
  );
}
