import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import { mockAPIData } from '../tests';
import * as fromActions from '../store/actions';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { ModalService } from '@campus-cloud/shared/services';
import { commonParams } from '@campus-cloud/shared/constants';
import { IPaginationParam } from '@campus-cloud/shared/types';
import { IPublicApiAccessToken, IAPIManagementState } from '../model';
import { RouterParamsUtils } from '@campus-cloud/shared/utils/router';
import { ApiDeleteComponent } from '@controlpanel/api-management/delete';

@Component({
  selector: 'cp-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.scss'],
  providers: [RouterParamsUtils, ModalService]
})
export class ApiListComponent implements OnInit {
  modal: OverlayRef;
  items = mockAPIData;
  dateFormat = FORMAT.SHORT;
  loading$: Observable<boolean>;
  pagination$: Observable<IPaginationParam>;
  items$: Observable<IPublicApiAccessToken[]>;

  constructor(
    private modalService: ModalService,
    private routerUtils: RouterParamsUtils,
    private store: Store<IAPIManagementState>
  ) {}

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

  revokeAccessToken(accessToken: IPublicApiAccessToken) {
    this.modal = this.modalService.open(
      ApiDeleteComponent,
      {},
      {
        data: accessToken,
        onClose: this.resetModal.bind(this)
      }
    );
  }

  resetModal() {
    this.modalService.close(this.modal);
    this.modal = null;
  }

  ngOnInit() {
    this.routerUtils.appendParamToRoute({
      [commonParams.page]: 1
    });
    this.items$ = this.store.select(fromStore.getTokens);
    this.loading$ = this.store.select(fromStore.getTokenLoading);
    this.pagination$ = this.store.select(fromStore.getPagination);

    this.fetch();
  }
}
