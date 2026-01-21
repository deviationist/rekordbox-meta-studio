import { RatingRangeFilter } from "./base-components/rating-range-filter";

export function RatingFilter() {
  return (
    <RatingRangeFilter
      minKey="minRating"
      maxKey="maxRating"
      label="Rating"
    />
  );
}
