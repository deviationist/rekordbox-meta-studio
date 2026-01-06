import { Row } from "@tanstack/react-table";

export function Artwork<Type>({ key = 'artworkUrl', row }: { key?: string; row: Row<Type>}) {
  const value = row.getValue(key) as string;
  return (
    <div className="overflow-hidden w-full h-[30px] bg-muted/50">
      {value ? (
        <img
          src={value}
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
