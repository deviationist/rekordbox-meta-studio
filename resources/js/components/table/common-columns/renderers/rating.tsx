import { Row } from "@tanstack/react-table";
import { cn } from '@/lib/utils';

export function Rating<Type>({ row }: { row: Row<Type> }) {
  const rating = row.getValue('rating') as number;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={cn(
            'h-4 w-4',
            rating >= star
              ? 'fill-muted-foreground text-muted-foreground'
              : 'fill-none text-muted-foreground'
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}
