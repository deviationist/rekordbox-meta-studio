import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Library } from '@/types/library';
import { Music, Calendar, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  isOpening?: boolean;
  isSelectable?: boolean;
  library: Library;
  onSelect?: (library: Library) => void;
};

export function LibraryCard({ className, isOpening, isSelectable = true, library, onSelect }: Props) {
  return (
    <Card
      key={library.id}
      className={cn(
        className,
        isSelectable
          ? "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-primary active:scale-[0.98]"
          : ""
      )}
      onClick={() => onSelect?.(library)}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Music className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{library.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isOpening ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Opening library...</span>
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4" />
              <span>
                Created {new Date(library.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function LibraryCardSkeleton() {
  return (
    <Card className="opacity-50">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted animate-pulse">
          <Music className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      </CardContent>
    </Card>
  )
}
