import { Component, OnInit, OnDestroy } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { CPI18nService } from '@shared/services';
import { SortDirection } from '@shared/constants';
import * as actions from '../store/testers.actions';
import { Mixin, Destroyable } from '@shared/mixins';
import { ModalService } from '@shared/services/modal';
import { ITestersState } from '../store/testers.state';
import * as selectors from '../store/testers.selectors';
import { ITestUser } from '../models/test-user.interface';
import { CampusTestersService } from '../campus-testers.service';
import { baseActions, ISnackbar, baseActionClass } from '@app/store';
import { TestersCreateComponent } from '../create/testers-create.component';
import { TestersDeleteComponent } from '../delete/testers-delete.component';

@Component({
  selector: 'cp-testers-list',
  templateUrl: './testers-list.component.html',
  styleUrls: ['./testers-list.component.scss']
})
@Mixin([Destroyable])
export class TestersListComponent implements OnInit, OnDestroy, Destroyable {
  modal: OverlayRef;
  testers$: Observable<ITestUser[]>;
  testersLoading$: Observable<boolean>;
  sortDirection$: Observable<SortDirection>;

  // Destroyable
  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private cpI18n: CPI18nService,
    private modalService: ModalService,
    private service: CampusTestersService,
    public store: Store<ITestersState | ISnackbar>
  ) {}

  doSearch(search) {
    this.store.dispatch(new actions.SetTestersSearch(search));
    this.fetch();
  }

  doCreateModal() {
    this.modal = this.modalService.open(TestersCreateComponent, null, {
      onClose: this.resetModal.bind(this),
      onAction: this.dispatchCreate.bind(this)
    });
  }

  dispatchCreate(testers: string[]) {
    this.store.dispatch(new actions.CreateTesters(testers));
  }

  doSort(sortDirection) {
    this.store.dispatch(
      new actions.SetTestersSort(
        sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
      )
    );
    this.fetch();
  }

  doResend(testerId) {
    this.service.resendInvite(testerId).subscribe(
      () =>
        this.store.dispatch(
          new baseActionClass.SnackbarSuccess({
            body: this.cpI18n.translate('t_sandbox_resend_invite_success')
          })
        ),
      () =>
        this.store.dispatch(
          new baseActionClass.SnackbarError({
            body: this.cpI18n.translate('something_went_wrong')
          })
        )
    );
  }

  doDelete(testerId) {
    this.modal = this.modalService.open(TestersDeleteComponent, null, {
      data: testerId,
      onClose: this.resetModal.bind(this),
      onAction: this.dispatchDelete.bind(this)
    });
  }

  dispatchDelete(testerId) {
    this.store.dispatch(new actions.DeleteTester(testerId));
  }

  resetModal() {
    this.modalService.close(this.modal);
    this.modal = null;
  }
  fetch() {
    this.store.dispatch(new actions.LoadTesters());
  }

  initSelectors() {
    this.testers$ = this.store.select(selectors.getTesters).pipe(takeUntil(this.destroy$));
    this.testersLoading$ = this.store
      .select(selectors.getTestersLoading)
      .pipe(takeUntil(this.destroy$));
    this.sortDirection$ = this.store
      .select(selectors.getSortDirection)
      .pipe(takeUntil(this.destroy$));
  }

  ngOnInit() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 't_sandbox_test_environment_users',
        em: 't_sandbox_sub_heading',
        children: []
      }
    });
    this.initSelectors();
    this.fetch();
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
