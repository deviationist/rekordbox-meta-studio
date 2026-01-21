interface GetMinMaxLabelTextProps {
  minValue: string | number | null;
  maxValue: string | number | null;
  delimiter?: string;
  prefix?: string;
  suffix?: string;
}

export function getMinMaxLabelText({
  minValue,
  maxValue,
  delimiter = '-',
  prefix,
  suffix,
}: GetMinMaxLabelTextProps): string | undefined {
  const formatValue = (value: string | number) => {
    const stringValue = String(value);
    return [prefix, stringValue, suffix].filter(Boolean).join('');
  };

  if (minValue && maxValue) {
    return [formatValue(minValue), formatValue(maxValue)].join(delimiter);
  } else if (minValue) {
    const formattedMin = formatValue(minValue);
    return typeof minValue === 'number' ? `${formattedMin}+` : formattedMin;
  } else if (maxValue) {
    const formattedMax = formatValue(maxValue);
    return typeof maxValue === 'number' ? `≤${formattedMax}` : formattedMax;
  }
}
