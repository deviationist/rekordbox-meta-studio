import { InputWithCross } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseAsString, useQueryState } from "nuqs";
import { useState, type FormEvent } from "react";
import { Search, SearchIcon } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="flex-1 flex">
      <InputWithCross
        icon={<SearchIcon />}
        containerClassName={cn(
          "h-8",
          showButton ? "rounded-r-none" : "w-full",
        )}
        placeholder="Search"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onClear={handleClear}
      />
      {showButton && (
        <Button
          type="submit"
          size="sm"
          className="cursor-pointer shrink-0 rounded-l-none"
          variant="secondary"
        >
          <span className="sr-only">
            Search
          </span>
          <Search className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
}
