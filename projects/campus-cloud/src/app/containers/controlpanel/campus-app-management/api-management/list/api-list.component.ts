import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import * as fromActions from '../store/actions';
import { ModalService } from '@campus-cloud/shared/services';
import { commonParams } from '@campus-cloud/shared/constants';
import { IPaginationParam } from '@campus-cloud/shared/types';
import { IPublicApiAccessToken, IAPIManagementState } from '../model';
import { RouterParamsUtils } from '@campus-cloud/shared/utils/router';
import { RouteNavigationGuard } from '@controlpanel/campus-app-management/api-management/guards';
import { DiscardChangesModalComponent } from '@controlpanel/campus-app-management/api-management/components';
import { ApiManagementUtilsService } from '@controlpanel/campus-app-management/api-management/api-management.utils.service';

@Component({
  selector: 'cp-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.scss'],
  providers: [RouterParamsUtils, ModalService]
})
export class ApiListComponent implements OnInit, RouteNavigationGuard {
  isEdit = false;
  formDirty = false;
  discardModal: OverlayRef;
  loading$: Observable<boolean>;
  pagination$: Observable<IPaginationParam>;
  items$: Observable<IPublicApiAccessToken[]>;

  constructor(
    private modalService: ModalService,
    private routerUtils: RouterParamsUtils,
    private utils: ApiManagementUtilsService,
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

  loadAccessTokens() {
    this.store
      .select(fromStore.getTokenLoaded)
      .pipe(
        tap((loaded: boolean) => {
          if (!loaded) {
            this.fetch();
          }
        }, take(1))
      )
      .subscribe();

    this.items$ = this.store.select(fromStore.getTokens);
  }

  showDiscardModal() {
    this.discardModal = this.modalService.open(
      DiscardChangesModalComponent,
      {},
      { onClose: this.resetDiscardModal.bind(this) }
    );

    return this.utils.navigateAwaySelection$;
  }

  resetDiscardModal() {
    this.modalService.close(this.discardModal);
    this.discardModal = null;
  }

  formStatus(value) {
    this.formDirty = value;
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.formDirty) {
      return this.showDiscardModal();
    }

    return true;
  }

  ngOnInit() {
    this.routerUtils.appendParamToRoute({
      [commonParams.page]: 1
    });

    this.loading$ = this.store.select(fromStore.getTokenLoading);
    this.pagination$ = this.store.select(fromStore.getPagination);

    this.loadAccessTokens();
  }
}
