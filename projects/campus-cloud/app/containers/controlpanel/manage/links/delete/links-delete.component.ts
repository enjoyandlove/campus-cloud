import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { Destroyable, Mixin } from '@shared/mixins';
import * as fromLinks from '@app/store/manage/links';
import { amplitudeEvents } from '@shared/constants/analytics';
import { CPTrackingService, ErrorService, IModal, MODAL_DATA } from '@shared/services';

@Component({
  selector: 'cp-links-delete',
  templateUrl: './links-delete.component.html',
  styleUrls: ['./links-delete.component.scss']
})
@Mixin([Destroyable])
export class LinksDeleteComponent implements OnInit, OnDestroy, Destroyable {
  buttonData;
  eventProperties;

  // Destroyable
  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    @Inject(MODAL_DATA) public modal: IModal,
    private updates$: Actions,
    private errorService: ErrorService,
    private cpTracking: CPTrackingService,
    private store: Store<fromLinks.ILinksState>
  ) {}

  onDelete() {
    this.store.dispatch(new fromLinks.DeleteLink(this.modal.data.id));
    this.modal.onClose();
  }

  resetModal() {
    this.modal.onClose();
  }

  trackEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties()
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, this.eventProperties);
  }

  ngOnInit() {
    this.updates$
      .pipe(
        ofType(fromLinks.LinksActionTypes.DELETE_LINK_FAILURE),
        takeUntil(this.destroy$)
      )
      .subscribe((action: fromLinks.DeleteLinkFailure) => {
        this.errorService.handleError(action.payload);

        this.buttonData = { ...this.buttonData, disabled: false };
      });

    this.updates$
      .pipe(
        ofType(fromLinks.LinksActionTypes.DELETE_LINK_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.trackEvent();
        this.resetModal();
      });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
