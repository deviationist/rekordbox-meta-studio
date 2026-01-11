import { useEffect } from "react";

type UseColumnOverflowProps = {
  totalColumnsWidth: number;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  onChange: (columnOverflow: boolean) => void;
}

export function useDetectColumnsOverflow({
  totalColumnsWidth,
  tableContainerRef,
  onChange
}: UseColumnOverflowProps) {
  useEffect(() => {
    const checkOverflow = () => {
      const tableContainerWidth = tableContainerRef.current?.clientWidth;
      onChange(!!(tableContainerWidth && totalColumnsWidth > tableContainerWidth));
    };

    // Check on mount and when totalColumnsWidth changes
    checkOverflow();

    // Add resize listener
    window.addEventListener('resize', checkOverflow);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [onChange, totalColumnsWidth, tableContainerRef]);
}
