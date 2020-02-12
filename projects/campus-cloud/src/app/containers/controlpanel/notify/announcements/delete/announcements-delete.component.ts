import { Component, Inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { AnnouncementsService } from '../announcements.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { AnnouncementAmplitudeService } from './../announcement.amplitude.service';
import { IModal, MODAL_DATA, CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-announcements-delete',
  templateUrl: './announcements-delete.component.html',
  styleUrls: ['./announcements-delete.component.scss']
})
export class AnnouncementDeleteComponent {
  constructor(
    private session: CPSession,
    private service: AnnouncementsService,
    private cpTracking: CPTrackingService,
    @Inject(MODAL_DATA) private modal: IModal
  ) {}

  doReset() {
    this.modal.onClose();
  }

  onArchive() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteAnnouncement(this.modal.data.id, search).subscribe(
      (_) => {
        this.modal.onClose();
        this.trackDeleteEvent(this.modal.data);
        this.modal.onAction(this.modal.data.id);
      },
      () => this.modal.onClose(true)
    );
  }

  trackDeleteEvent(data) {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.cpTracking.getAmplitudeMenuProperties()
    );

    const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties() as any;

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.NOTIFY_DELETED_COMMUNICATION, {
      sub_menu_name,
      ...AnnouncementAmplitudeService.getAmplitudeProperties(data, this.modal.data.id)
    });
  }
}
