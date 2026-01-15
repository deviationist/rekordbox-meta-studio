import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { useArtworkViewer } from '@/contexts/artwork-viewer-context';
import { useDocumentListener } from '@/hooks/use-document-listener';

export function ArtworkViewer() {
  const {
    row,
    artwork,
    isOpen,
    totalCount,
    closeViewer,
    navigateNext,
    navigatePrev,
    canNavigate,
  } = useArtworkViewer();

  useDocumentListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      closeViewer();
    } else if (e.key === 'ArrowRight' && canNavigate) {
      navigateNext();
    } else if (e.key === 'ArrowLeft' && canNavigate) {
      navigatePrev();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={closeViewer}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 border-0 bg-black/95"
      >
        <DialogTitle className="sr-only">{artwork?.title || 'Artwork'}</DialogTitle>

        <DialogClose asChild>
          <Button
            variant="ghost"
            className="absolute top-4 right-4 z-50 p-2 cursor-pointer hover:bg-white/10"
            aria-label="Close viewer"
          >
            <X className="h-6 w-6 text-white" />
          </Button>
        </DialogClose>

        {canNavigate && (
          <>
            <Button
              variant="ghost"
              onClick={navigatePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 cursor-pointer hover:bg-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </Button>
            <Button
              variant="ghost"
              onClick={navigateNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 cursor-pointer hover:bg-white/10"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </Button>
          </>
        )}

        {canNavigate && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 text-white/70 text-sm">
            {(row?.index ?? 0) + 1} / {totalCount}
          </div>
        )}

        {artwork?.title && (
          <div className="absolute top-4 left-4 z-50 text-white text-lg font-medium max-w-[60%] truncate">
            {artwork.title}
          </div>
        )}

        <div className="relative w-full h-full flex items-center justify-center">
          {artwork ? (
            <img
              src={artwork.srcOriginal}
              alt={artwork.alt || artwork.title || 'Artwork'}
              title={artwork.title}
              className="max-w-full max-h-full object-contain p-4"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-white/70">
              <ImageOff className="h-24 w-24" />
              <p className="text-lg">{'No artwork available'}</p>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}
