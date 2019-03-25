export interface IPaginationParam {
  next: boolean;
  previous: boolean;
  page: number;
}

export interface IFilterParam {
  sort_field?: string;
  search_str?: string;
  sort_direction?: string;
}
