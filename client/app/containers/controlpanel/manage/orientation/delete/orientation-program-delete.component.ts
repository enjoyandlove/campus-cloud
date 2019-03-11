import { Component, OnInit, Inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@app/session';
import { amplitudeEvents } from '@shared/constants';
import { OrientationService } from './../orientation.services';
import { CPI18nService, CPTrackingService, IModal, MODAL_DATA } from '@shared/services';

@Component({
  selector: 'cp-orientation-program-delete',
  templateUrl: './orientation-program-delete.component.html',
  styleUrls: ['./orientation-program-delete.component.scss']
})
export class OrientationProgramDeleteComponent implements OnInit {
  eventProperties;
  orientationProgram;
  deleteWarnings = [
    this.cpI18n.translate('t_shared_delete_resource_warning_wall_posts'),
    this.cpI18n.translate('t_shared_delete_resource_warning_assessment_data'),
    this.cpI18n.translate('t_shared_delete_resource_warning_events'),
    this.cpI18n.translate('t_shared_delete_resource_warning_todos')
  ];

  constructor(
    @Inject(MODAL_DATA) private modal: IModal,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: OrientationService,
    public cpTracking: CPTrackingService
  ) {}

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteProgram(this.orientationProgram.id, search).subscribe(() => {
      this.trackEvent();
      this.modal.onClose(this.orientationProgram.id);
    });
  }

  onClose() {
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
    this.orientationProgram = this.modal.data;
  }
}
