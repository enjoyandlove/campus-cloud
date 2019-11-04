import { TemplateRef } from '@angular/core';

export interface CPTableRow {
  label?: string;
  template?: TemplateRef<any>;
  context?: any;
}

export interface CPTableColumn {
  label: string;
  onClick?: () => {};
  sortable?: boolean;
  sorting?: boolean;
  sortingDirection?: CPTableSorting;
}

export enum CPTableSorting {
  asc = 'asc',
  desc = 'desc'
}
