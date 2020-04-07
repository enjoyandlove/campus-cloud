import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { CPI18nService } from '@campus-cloud/shared/services';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { IJobsState } from '@campus-cloud/store';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays/modal/modal.service';

@Component({
  selector: 'cp-employer-delete',
  templateUrl: './employer-delete.component.html',
  styleUrls: ['./employer-delete.component.scss']
})
export class EmployerDeleteComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();

  constructor(
    @Inject(READY_MODAL_DATA) public modal,
    public updates$: Actions,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IJobsState>,
    public cpTracking: CPTrackingService
  ) {}

  onDelete() {
    this.store.dispatch(new fromJobs.DeleteEmployer(this.modal.data.id));
  }

  trackEvent() {
    const eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_type: amplitudeEvents.EMPLOYER
    };

    delete eventProperties['page_name'];

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, eventProperties);
  }

  resetModal() {
    this.modal.onClose();
  }

  ngOnInit() {
    this.updates$
      .pipe(
        ofType(fromJobs.DELETE_EMPLOYER_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe((action: fromJobs.DeleteEmployerSuccess) => {
        this.trackEvent();
        this.resetModal();
        this.modal.onAction(action.payload);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
