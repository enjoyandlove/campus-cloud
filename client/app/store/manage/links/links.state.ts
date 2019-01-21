import { ILink } from '../../../containers/controlpanel/manage/links/link.interface';

export interface ILinkRange {
  start_range: number;

  end_range: number;
}

export interface ILinkSort {
  sort_field: string;

  sort_direction: string;
}

export interface ILinksState {
  range: ILinkRange;

  search_str: string;

  sort: ILinkSort;

  links: ILink[];

  loaded: boolean;

  loading: boolean;
}
