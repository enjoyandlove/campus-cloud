import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { baseActions } from '@app/store';
import { SORT_DIRECTION } from '@shared/constants';
import { Mixin, Destroyable } from '@shared/mixins';
import * as actions from '../store/testers.actions';
import { ITestersState } from '../store/testers.state';
import * as selectors from '../store/testers.selectors';
import { ITestUser } from '@libs/testers/model/test-user.interface';

@Component({
  selector: 'cp-testers-list',
  templateUrl: './testers-list.component.html',
  styleUrls: ['./testers-list.component.scss']
})
@Mixin([Destroyable])
export class TestersListComponent implements OnInit, OnDestroy, Destroyable {
  testers$: Observable<ITestUser[]>;
  testersLoading$: Observable<boolean>;
  sortDirection$: Observable<SORT_DIRECTION>;

  // Destroyable
  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(public store: Store<ITestersState>) {}

  doSearch(search) {
    this.store.dispatch(new actions.SetTestersSearch(search));
    this.fetch();
  }

  doCreateModal() {
    console.log('create modal');
  }

  doSort(sortDirection) {
    this.store.dispatch(
      new actions.SetTestersSort(
        sortDirection === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC
      )
    );
    this.fetch();
  }

  doResend(testerId) {
    console.log('resend', testerId);
  }

  doDelete(testerId) {
    console.log('delete', testerId);
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
