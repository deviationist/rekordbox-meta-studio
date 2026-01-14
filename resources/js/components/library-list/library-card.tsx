import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LibraryIndex } from '@/types/library';
import { Music, Calendar, Loader2, MoreVertical, Pencil, Trash2, FolderOpen, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { DeleteDialog } from '../delete-dialog';

type Props = {
  className?: string;
  isOpening?: boolean;
  isSelectable?: boolean;
  library: LibraryIndex;
  onSelect?: (library: LibraryIndex) => void;
  onEdit?: (library: LibraryIndex) => void;
  onDelete?: (library: LibraryIndex) => void;
};

export function LibraryCard({
  className,
  isOpening,
  isSelectable = true,
  library,
  onSelect,
  onDelete,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const onClick = useCallback(() => {
    setIsLoading(true);
    onSelect?.(library);
  }, [onSelect, library]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    router.delete(route('libraries.destroy', { library: library.id }), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        onDelete?.(library);
      },
      onError: (errors) => {
        console.error('Delete failed:', errors);
      },
      onFinish: () => {
        setIsDeleting(false);
      },
    });
  }, [onDelete, library]);

  return (
    <>
      <DeleteDialog
        itemName={library.name}
        isOpen={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
      />
      <Card
        key={library.id}
        className={cn(
          className,
          isSelectable
            ? "cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary"
            : ""
        )}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Music className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{library.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-sm hover:bg-accent p-2 cursor-pointer self-start transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <FolderOpen className="mr-2 h-4 w-4" />
                <span>Open</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  href={route('libraries.edit', { library: library.id })}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  href={route('libraries.status', { library: library.id })}
                >
                  <HeartPulse className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
                className="text-destructive cursor-pointer focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {(isOpening || isLoading) ? (
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
    </>
  );
}
