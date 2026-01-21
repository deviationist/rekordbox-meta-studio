import { AudioLines } from "lucide-react";
import { MultiNumericRangeFilter } from "./base-components/numeric-range/multi-numeric-range-filter";

export function AudioQualityFilter() {
  return (
    <MultiNumericRangeFilter
      label="Audio Quality"
      icon={AudioLines}
      fields={[
        {
          label: "Sample Rate",
          minKey: "sampleRateMin",
          maxKey: "sampleRateMax",
          placeholder: { min: "Min", max: "Max" },
          step: 1000,
          suffix: "kHz",
          min: 0,
        },
        {
          label: "Bit Depth",
          minKey: "bitDepthMin",
          maxKey: "bitDepthMax",
          placeholder: { min: "Min", max: "Max" },
          step: 8,
          suffix: "bit",
          min: 0,
        },
        {
          label: "Bit Rate",
          minKey: "bitRateMin",
          maxKey: "bitRateMax",
          placeholder: { min: "Min", max: "Max" },
          step: 32,
          suffix: "kbps",
          min: 0,
        },
      ]}
    />
  );
}
