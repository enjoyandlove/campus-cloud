import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '../../../../../session';
import { STATUS } from '../../../../../shared/constants';
import { AnnouncementsService } from '../announcements.service';
import { NotifyUtilsService } from '../../notify.utils.service';
import { CPTrackingService } from '../../../../../shared/services';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

declare var $: any;

@Component({
  selector: 'cp-announcements-delete',
  templateUrl: './announcements-delete.component.html',
  styleUrls: ['./announcements-delete.component.scss']
})
export class AnnouncementDeleteComponent implements OnInit {
  @Input() item: any;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  isError;
  buttonData;
  errorMessage;

  eventProperties = {
    sub_menu_name: null,
    audience_type: null,
    announcement_id: null,
    announcement_type: null
  };

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private utils: NotifyUtilsService,
    private service: AnnouncementsService,
    private cpTracking: CPTrackingService
  ) {}

  doReset() {
    this.isError = false;
    this.teardown.emit();
  }

  onArchive() {
    this.isError = false;
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteAnnouncement(this.item.id, search).subscribe(
      (_) => {
        this.trackDeleteEvent(this.item);
        this.teardown.emit();
        this.deleted.emit(this.item.id);
        $('#deleteAnnouncementModal').modal('hide');
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      },
      (_) => {
        this.isError = true;
        this.errorMessage = STATUS.SOMETHING_WENT_WRONG;
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      }
    );
  }

  trackDeleteEvent(data) {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.cpTracking.getEventProperties());

    this.eventProperties = {
      ...this.eventProperties,
      ...this.utils.setEventProperties(data, amplitudeEvents.ANNOUNCEMENT)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.NOTIFY_DELETED_LISTING,
      this.eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('archive')
    };
  }
}
