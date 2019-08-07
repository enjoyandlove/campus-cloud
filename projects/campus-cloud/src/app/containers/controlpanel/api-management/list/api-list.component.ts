import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import { mockAPIData } from '../tests';
import * as fromActions from '../store/actions';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { commonParams } from '@campus-cloud/shared/constants';
import { IPaginationParam } from '@campus-cloud/shared/types';
import { RouterParamsUtils } from '@campus-cloud/shared/utils/router';
import { IPublicApiAccessToken, IAPIManagementState } from '../api-management.interface';

@Component({
  selector: 'cp-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.scss'],
  providers: [RouterParamsUtils]
})
export class ApiListComponent implements OnInit {
  items = mockAPIData;
  dateFormat = FORMAT.SHORT;
  loading$: Observable<boolean>;
  pagination$: Observable<IPaginationParam>;
  items$: Observable<IPublicApiAccessToken[]>;

  constructor(private routerUtils: RouterParamsUtils, private store: Store<IAPIManagementState>) {}

  onPaginationNext(currentPage: number) {
    this.routerUtils.appendParamToRoute({ [commonParams.page]: currentPage });
    this.fetch();
  }

  onPaginationPrevious(currentPage: number) {
    this.routerUtils.appendParamToRoute({ [commonParams.page]: currentPage });
    this.fetch();
  }

  fetch() {
    this.store.dispatch(fromActions.loadRequest());
  }

  trackByFn(_, item) {
    return item.id;
  }

  ngOnInit() {
    this.routerUtils.appendParamToRoute({
      [commonParams.page]: 1
    });
    this.items$ = this.store.select(fromStore.getAPIs);
    this.loading$ = this.store.select(fromStore.getAPILoading);
    this.pagination$ = this.store.select(fromStore.getPagination);

    this.fetch();
  }
}
