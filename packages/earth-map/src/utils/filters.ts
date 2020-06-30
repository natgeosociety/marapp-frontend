// Serialize in the format filter=type==Continent,Jurisdiction,featured==true
export const serializeFilters = (filters: IFilters): string => {
  return Object.keys(filters).reduce((acc, key) => {
    const filterGroup = filters[key];
    return `${key}==${filterGroup.join(',')},${acc}`;
  }, ``);
};

/**
 * Check if filters contain any values
 */
export const hasFilters = (filters: IFilters): boolean => {
  return !!Object.keys(filters).find((key) => filters[key].length);
};

/**
 * Strips keys that have empty arrays
 */
export const cleanFilters = (filters: IFilters): IFilters => {
  return Object.keys(filters)
    .filter((key) => filters[key].length)
    .reduce((acc, key) => {
      acc[key] = filters[key];
      return acc;
    }, {});
};

export interface IFilters {
  [key: string]: string[] | boolean[];
}
