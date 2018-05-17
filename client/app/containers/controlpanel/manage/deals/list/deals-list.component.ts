import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { ManageHeaderService } from '../../utils';
import { BaseComponent } from '../../../../../base';
import { CPI18nService } from '../../../../../shared/services';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-deals-list',
  templateUrl: './deals-list.component.html',
  styleUrls: ['./deals-list.component.scss']
})
export class DealsListComponent extends BaseComponent implements OnInit {
  loading;

  constructor(
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public headerService: ManageHeaderService
  ) {
    super();
    this.loading = false;
  }

  onPaginationNext() {
    super.goToNext();
  }

  onPaginationPrevious() {
    super.goToPrevious();
  }

  doSort() {}

  onSearch() {}

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges()
    });
  }

  ngOnInit() {
    this.buildHeader();
  }
}
