import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CP_TRACK_TO, IEventData } from '@campus-cloud/shared/directives';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { CPSession } from '@campus-cloud/session';
import { canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { FormStatus } from '@controlpanel/contact-trace/forms/models';

@Component({
  selector: 'cp-forms-list-action-box',
  templateUrl: './forms-list-action-box.component.html',
  styleUrls: ['./forms-list-action-box.component.scss']
})
export class FormsListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();
  @Output() filterChange: EventEmitter<{ label?: string; action?: string }> = new EventEmitter();
  createFormEventData: IEventData;
  canCreate: boolean;
  types: { label?: string; action?: FormStatus }[];

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
        label: this.cpI18n.translate('contact_trace_forms_all_forms'),
        action: null
      },
      {
        label: this.cpI18n.translate('contact_trace_forms_published'),
        action: FormStatus.published
      },
      {
        label: this.cpI18n.translate('contact_trace_forms_draft'),
        action: FormStatus.draft
      },
      {
        label: this.cpI18n.translate('contact_trace_forms_expired'),
        action: FormStatus.expired
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
