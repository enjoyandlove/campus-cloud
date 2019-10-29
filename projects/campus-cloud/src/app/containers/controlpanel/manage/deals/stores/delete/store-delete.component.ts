import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import * as fromDeals from '@campus-cloud/store/manage/deals';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService, CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-store-delete',
  templateUrl: './store-delete.component.html',
  styleUrls: ['./store-delete.component.scss']
})
export class StoreDeleteComponent implements OnInit, OnDestroy {
  @Input() store;

  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  destroy$ = new Subject();

  constructor(
    public updates$: Actions,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService,
    public stateStore: Store<fromDeals.IDealsState>
  ) {}

  onDelete() {
    this.stateStore.dispatch(new fromDeals.DeleteStore(this.store.id));
  }

  trackEvent() {
    const eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_type: amplitudeEvents.STORE
    };

    delete eventProperties['page_name'];

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };

    this.updates$
      .pipe(
        ofType(fromDeals.DELETE_STORE_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe((action: fromDeals.DeleteStoreSuccess) => {
        this.trackEvent();
        this.deleted.emit(action.payload);
        this.resetDeleteModal.emit();
        $('#deleteModal').modal('hide');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
