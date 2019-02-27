import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Mixin, Destroyable } from '@shared/mixins';
import { ITestersState, LoadTesters } from '../store';
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

  // Destroyable
  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(public store: Store<ITestersState>) {}

  ngOnInit() {
    this.store.dispatch(new LoadTesters());
    this.testers$ = this.store.select(selectors.getTesters).pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
