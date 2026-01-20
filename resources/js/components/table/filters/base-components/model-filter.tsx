import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { LucideIcon, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { route } from "ziggy-js";
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
import { useLibrary } from "@/contexts/library-context";
import type { FilterItem as FilterItem } from "@/types/table";
import { InputWithCross } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type BaseFilterProps = {
  search?: boolean;
  label: string;
  icon?: LucideIcon;
  className?: string;
  selectableItems?: FilterItem[];
  activeItems: FilterItem[];
  itemComponent?: (item: FilterItem) => React.ReactElement;
};

type ModelFilterProps = BaseFilterProps &
  (
    | { modelName: string; queryParam?: string }
    | { modelName?: never; queryParam: string }
  );

export function ModelFilter({
  modelName,
  queryParam,
  //displayAll
  search = true,
  label,
  icon: Icon,
  className,
  activeItems: activeItemsInitial,
  itemComponent,
}: ModelFilterProps) {
  // Implement displayAll-prop - if true then all items are loaded, 100 at a time, with lazy load
  const [library] = useLibrary();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectableItems, setSelectableItems] = useState<FilterItem[]>([]);
  const [activeItems, setActiveItems] = useState<FilterItem[]>(activeItemsInitial);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // nuqs for URL state (comma-separated IDs)
  const [selectedIds, setSelectedIds] = useQueryState(queryParam ?? modelName as string, {
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

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query: string, excludeIds: string[]) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!query.trim()) {
        setSelectableItems([]);
        setIsLoading(false);
        return;
      }

      // Create new AbortController
      abortControllerRef.current = new AbortController();

      try {

        const response = await fetch(
          route(`api.library.${modelName}.search`, {
            library: library.id,
            search: query,
            exclude: excludeIds.length > 0 ? excludeIds.join(',') : undefined,
          }),
          { signal: abortControllerRef.current.signal }
        );

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setSelectableItems(data.data || []);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Search error:", error);
          setSelectableItems([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;

  // Trigger search when query or selected items change
  useEffect(() => {
    setIsLoading(true);
    const excludeIds = Array.from(selectedIdSet);
    debouncedSearch(searchQuery, excludeIds);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, selectedIdSet, debouncedSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectableItems([]);
  };

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
              className,
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

                {hasSearchQuery && selectableItems.length > 0 && (
                  <DropdownMenuSeparator className="my-2" />
                )}
              </>
            )}

            {/* Show search results (excluding selected items) */}
            {hasSearchQuery && (
              <>
                {hasActiveFilters && selectableItems.length > 0 && (
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground inline-flex items-center gap-1">
                    Search Results {isLoading && <Spinner className="inline-block ml-1 h-3 w-3" />}
                  </div>
                )}

                {isLoading && selectableItems.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                )}

                {!isLoading && selectableItems.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No results found
                  </div>
                )}

                {selectableItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 group rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
                  >
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => handleToggleItem(item)}
                      className="group-hover:border-primary"
                    />
                    <span className="text-sm flex-1">{itemComponent ? itemComponent(item) : item.name}</span>
                  </label>
                ))}
              </>
            )}

            {/* Empty state when no search and no active filters */}
            {!hasSearchQuery && search && !hasActiveFilters && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Search to add filters
              </div>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
