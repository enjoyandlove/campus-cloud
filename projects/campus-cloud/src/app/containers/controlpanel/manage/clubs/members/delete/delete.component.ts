import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud//shared/constants/analytics';
import { CPI18nService } from '@campus-cloud//shared/services/i18n.service';
import { ICPButtonProps } from '@campus-cloud//shared/components';
import { CPTrackingService, RouteLevel } from '@campus-cloud//shared/services';
import { LibsCommonMembersService } from '@campus-cloud//libs/members/common/providers';
import { IMember, MemerUpdateType } from '@campus-cloud/libs/members/common/model';

@Component({
  selector: 'cp-members-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class ClubsMembersDeleteComponent implements OnInit {
  @Input() member: IMember;
  @Input() groupId: number;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData: ICPButtonProps;

  constructor(
    private cpI18n: CPI18nService,
    private cpTracking: CPTrackingService,
    private service: LibsCommonMembersService
  ) {}

  resetModal() {
    this.teardown.emit();
  }

  onDelete() {
    this.service
      .removeMember(
        {
          group_id: this.groupId,
          member_type: MemerUpdateType.remove
        },
        this.member.id
      )
      .subscribe(
        (_) => {
          this.trackEvent();
          this.deleted.emit(this.member.id);
          this.resetModal();
          this.buttonData = {
            ...this.buttonData,
            disabled: false
          };
        },
        () => {
          this.buttonData = {
            ...this.buttonData,
            disabled: false
          };
        }
      );
  }

  trackEvent() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('remove'),
      class: 'danger'
    };
  }
}
