import { useMemo, useState } from "react";
import { LucideIcon, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ModelFilterItem as FilterItem } from "@/types/table";
import { InputWithCross } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FilterSelectProps = {
  queryParam: string;
  search?: boolean;
  label: string;
  icon?: LucideIcon;
  selectableItems?: FilterItem[];
};

export function FilterSelect({
  queryParam,
  search = true,
  label,
  icon: Icon,
  selectableItems,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // nuqs for URL state (comma-separated IDs)
  const [selectedIds, setSelectedIds] = useQueryState(queryParam, {
    defaultValue: "",
    parse: (value) => value,
    serialize: (value) => value,
  });


  // Parse selected IDs from URL - memoized to prevent unnecessary re-renders
  const selectedIdSet = useMemo(() => {
    return new Set(
      selectedIds
        .split(",")
        .filter(Boolean)
        .map((id) => id.trim())
    );
  }, [selectedIds]);

  const [activeItems, setActiveItems] = useState<FilterItem[]>(() => selectableItems?.filter(item => selectedIdSet.has(String(item.id))) ?? []);

  // Trigger search when query or selected items change
  const filteredItems = useMemo(() =>
    (selectableItems || []).filter((item =>
      (!searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !selectedIdSet.has(String(item.id))
    )
  ), [searchQuery, selectedIdSet, selectableItems]);

  const handleToggleItem = (item: FilterItem) => {
    const itemId = String(item.id);
    const newIds = new Set(selectedIdSet);

    if (newIds.has(itemId)) {
      newIds.delete(itemId);
      setActiveItems(activeItems.filter((i) => String(i.id) !== itemId));
    } else {
      newIds.add(itemId);
      setActiveItems([...activeItems, item]);
    }

    // Update URL
    const idsArray = Array.from(newIds);
    setSelectedIds(idsArray.length > 0 ? idsArray.join(",") : null);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(null);
    setActiveItems([]);
  };

  const handleClearSearch = () => setSearchQuery("");

  const activeCount = useMemo(() => activeItems.length, [activeItems]);
  const hasActiveFilters = useMemo(() => activeCount > 0, [activeCount]);
  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>

      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-0 w-full">
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "cursor-pointer flex-1 inline-flex items-center gap-2",
              hasActiveFilters ? "rounded-r-none" : "",
          )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {label}
            {hasActiveFilters && (
              <Badge variant="secondary">
                {activeCount}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              title="Clear all"
              className="cursor-pointer has-[>svg]:px-2 rounded-l-none border-l-0"
              onClick={handleClear}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
        {search && (
          <div className="p-1">
            <InputWithCross
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={handleClearSearch}
              className="h-9"
            />
          </div>
        )}

        <ScrollArea className="h-[50vh]">
          <div className="p-1 space-y-1">
            {/* Always show active/selected items first */}
            {hasActiveFilters && (
              <>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                  Selected
                </div>
                {activeItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
                  >
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => handleToggleItem(item)}
                    />
                    <span className="text-sm flex-1">{item.name}</span>
                  </label>
                ))}

                {hasSearchQuery && activeItems.length > 0 && (
                  <DropdownMenuSeparator className="my-2" />
                )}
              </>
            )}

            {/* Show search results (excluding selected items) */}
            <>
              {hasActiveFilters && activeItems.length > 0 && (
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground inline-flex items-center gap-1">
                  Available
                </div>
              )}

              {filteredItems.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  None
                </div>
              )}

              {filteredItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 group rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
                >
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => handleToggleItem(item)}
                    className="group-hover:border-primary"
                  />
                  <span className="text-sm flex-1">{item.name}</span>
                </label>
              ))}
            </>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
