import { Row } from "@tanstack/react-table";
import { displayValue } from "../../utils";

export function NamedItem<Type extends { name: string }>({ namedItem }: { namedItem: Type }) {
  return displayValue(namedItem, () => (
    <div className="font-medium truncate" title={namedItem.name}>
      {namedItem.name}
    </div>
  ));
}
