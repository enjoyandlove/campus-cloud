import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MembersService } from '../members.service';
import { MembersUtilsService } from '../members.utils.service';
import { CPTrackingService } from '../../../../../../shared/services';
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

  eventProperties = {
    member_id: null,
    member_type: null
  };

  constructor(
    private cpI18n: CPI18nService,
    private service: MembersService,
    private utils: MembersUtilsService,
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
          this.trackEvent(this.member);
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

  trackEvent(res) {
    this.eventProperties = {
      ...this.eventProperties,
      member_id: res.id,
      member_type: this.utils.getMemberTypeLabel(res.member_type)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DELETED_CLUB_MEMBER,
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
