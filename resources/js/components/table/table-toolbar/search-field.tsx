import { InputWithCross } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseAsString, useQueryState } from "nuqs";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchField() {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [localValue, setLocalValue] = useState(search);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearch(localValue || null);
  };

  const handleClear = () => {
    setLocalValue('');
    setSearch(null);
  };

  const hasValue = localValue.length > 0;
  const isDirty = localValue !== search;
  const showButton = hasValue && isDirty;

  return (
    <form onSubmit={handleSubmit} className="w-[220px] flex gap-2">
      <InputWithCross
        containerClassName={cn(
          "transition-all duration-200",
          showButton ? "w-[calc(100%-2.5rem)]" : "w-full",
        )}
        className="h-8"
        placeholder="Search"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onClear={handleClear}
      />
      {showButton && (
        <Button
          type="submit"
          size="sm"
          className="h-8 w-8 cursor-pointer shrink-0 animate-in fade-in zoom-in-95 duration-200"
          variant="secondary"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
}
