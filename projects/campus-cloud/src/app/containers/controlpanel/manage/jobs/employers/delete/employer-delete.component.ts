import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { IJobsState } from '@projects/campus-cloud/src/app/store';
import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';

@Component({
  selector: 'cp-employer-delete',
  templateUrl: './employer-delete.component.html',
  styleUrls: ['./employer-delete.component.scss']
})
export class EmployerDeleteComponent implements OnInit, OnDestroy {
  @Input() employer;

  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  destroy$ = new Subject();

  constructor(
    public updates$: Actions,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IJobsState>,
    public cpTracking: CPTrackingService
  ) {}

  onDelete() {
    this.store.dispatch(new fromJobs.DeleteEmployer(this.employer.id));
  }

  trackEvent() {
    const eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_type: amplitudeEvents.EMPLOYER
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
        ofType(fromJobs.DELETE_EMPLOYER_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe((action: fromJobs.DeleteEmployerSuccess) => {
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
