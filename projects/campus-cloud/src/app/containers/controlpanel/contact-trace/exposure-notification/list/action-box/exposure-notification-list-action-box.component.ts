import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CP_TRACK_TO, IEventData } from '@campus-cloud/shared/directives';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { CPSession } from '@campus-cloud/session';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { ExposureNotificationStatus } from '@controlpanel/contact-trace/exposure-notification';

@Component({
  selector: 'cp-exposure-notification-list-action-box',
  templateUrl: './exposure-notification-list-action-box.component.html',
  styleUrls: ['./exposure-notification-list-action-box.component.scss']
})
export class ExposureNotificationListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();
  @Output() filterChange: EventEmitter<{ label?: string; action?: string }> = new EventEmitter();
  createFormEventData: IEventData;
  canCreate: boolean;
  types: { label?: string; action?: ExposureNotificationStatus }[];

  constructor(
    private cpTracking: CPTrackingService,
    private session: CPSession,
    private cpI18n: CPI18nService
  ) {}

  ngOnInit(): void {
    // ToDo: PJ: Revisit amplitude config
    this.createFormEventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getAmplitudeMenuProperties()
    };

    this.canCreate = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.contact_trace_forms);

    this.types = [
      {
        label: this.cpI18n.translate('contact_trace_notification_all_statuses'),
        action: null
      },
      {
        label: this.cpI18n.translate('contact_trace_notification_sent'),
        action: ExposureNotificationStatus.sent
      },
      {
        label: this.cpI18n.translate('contact_trace_notification_scheduled'),
        action: ExposureNotificationStatus.scheduled
      }
    ];
  }

  onSearch(query) {
    this.search.emit(query);
  }

  onLaunchCreateModal() {
    this.launchCreateModal.emit();
  }

  onSelectedType(selection): void {
    this.filterChange.emit(selection);
  }
}
