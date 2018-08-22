import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrientationService } from './../orientation.services';
import { HttpParams } from '@angular/common/http';

import { CPSession } from './../../../../../session';
import { CPTrackingService } from '../../../../../shared/services';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';

@Component({
  selector: 'cp-orientation-program-delete',
  templateUrl: './orientation-program-delete.component.html',
  styleUrls: ['./orientation-program-delete.component.scss']
})
export class OrientationProgramDeleteComponent implements OnInit {
  @Input() orientationProgram;
  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  eventProperties;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: OrientationService,
    public cpTracking: CPTrackingService
  ) {}

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteProgram(this.orientationProgram.id, search).subscribe(() => {
      this.trackEvent();
      this.deleted.emit(this.orientationProgram.id);
      this.resetDeleteModal.emit();
      $('#programDelete').modal('hide');

      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: false
      });
    });
  }

  trackEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.cpTracking.getEventProperties()
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, this.eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
