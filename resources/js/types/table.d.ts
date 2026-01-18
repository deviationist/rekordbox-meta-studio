export type ModelFilterItem = {
  id: string | number;
  name: string;
};

export type ModelFilterState = {
  [key: string]: ModelFilterItem[];
};
