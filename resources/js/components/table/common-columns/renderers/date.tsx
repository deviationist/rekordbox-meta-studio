import { displayValue } from "../../utils";

export function DateCell({ date }: { date: string }) {
  return displayValue(date, () => (
    <div className="font-medium truncate">
      {new Date(date).toLocaleDateString()}
    </div>
  ));
}
