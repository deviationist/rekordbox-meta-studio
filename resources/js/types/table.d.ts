export type FilterItem = {
  id: string | number;
  name: string;
};

export type FilterState = {
  [key: string]: FilterItem[];
};
