import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';

interface SortableColumnItemProps {
  id: string;
  label: string;
  isSortable?: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SortableColumnItem({ id, label, isSortable = true, checked, onCheckedChange }: SortableColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center">
      <DropdownMenuCheckboxItem
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="flex-1"
        onSelect={(e) => e.preventDefault()} // Prevent menu from closing
      >
        {label}
      </DropdownMenuCheckboxItem>
      {isSortable && (
        <button
          type="button"
          className="flex items-center justify-center p-1 mx-2 cursor-grab active:cursor-grabbing hover:bg-accent rounded touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
