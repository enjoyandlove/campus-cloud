import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MembersService } from '../members.service';
import { CPTrackingService, RouteLevel } from '../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

declare var $: any;

@Component({
  selector: 'cp-members-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class ClubsMembersDeleteComponent implements OnInit {
  @Input() member: any;
  @Input() groupId: number;

  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;
  eventProperties;

  constructor(
    private cpI18n: CPI18nService,
    private service: MembersService,
    private cpTracking: CPTrackingService
  ) {}

  onDelete() {
    this.service
      .removeMember(
        {
          member_type: -1,
          group_id: this.groupId
        },
        this.member.id
      )
      .subscribe(
        (_) => {
          this.trackEvent();
          this.deleted.emit(this.member.id);
          $('#membersDelete').modal('hide');
          this.buttonData = Object.assign({}, this.buttonData, {
            disabled: true
          });
        },
        (err) => {
          this.buttonData = Object.assign({}, this.buttonData, {
            disabled: true
          });
          throw new Error(err);
        }
      );
  }

  trackEvent() {
    this.eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.eventProperties
    );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('remove'),
      class: 'danger'
    };
  }
}
