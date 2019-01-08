import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { CPSession } from '@app/session';
import { IJobsState } from '@client/app/store';
import * as fromJobs from '@app/store/manage/jobs';
import { CPTrackingService } from '@shared/services';
import { amplitudeEvents } from '@shared/constants/analytics';
import { CPI18nService } from '@shared/services/i18n.service';

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
  eventProperties;
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
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties(),
      page_type: amplitudeEvents.EMPLOYER
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, this.eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };

    this.updates$
      .ofType(fromJobs.DELETE_EMPLOYER_SUCCESS)
      .pipe(takeUntil(this.destroy$))
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
