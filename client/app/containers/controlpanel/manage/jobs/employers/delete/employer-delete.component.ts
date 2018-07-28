import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { EmployerService } from '../employer.service';
import { CPSession } from '../../../../../../session';
import { CPTrackingService } from '../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-employer-delete',
  templateUrl: './employer-delete.component.html',
  styleUrls: ['./employer-delete.component.scss']
})
export class EmployerDeleteComponent implements OnInit {
  @Input() employer;

  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  eventProperties;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EmployerService,
    public cpTracking: CPTrackingService
  ) {}

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteEmployer(this.employer.id, search).subscribe(() => {
      this.trackEvent();
      this.deleted.emit(this.employer.id);
      this.resetDeleteModal.emit();
      $('#deleteModal').modal('hide');
    });
  }

  trackEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties(),
      page_type: amplitudeEvents.EMPLOYER,
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
