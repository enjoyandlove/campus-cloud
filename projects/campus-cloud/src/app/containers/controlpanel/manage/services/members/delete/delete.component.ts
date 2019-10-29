import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { ICPButtonProps } from '@campus-cloud/shared/components';
import { IMember, MemerUpdateType } from '@campus-cloud/libs/members/common/model';
import { CPTrackingService, CPI18nService } from '@campus-cloud//shared/services';
import { LibsCommonMembersService } from '@campus-cloud/libs/members/common/providers';

@Component({
  selector: 'cp-services-members-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class ServicesMembersDeleteComponent implements OnInit {
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
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.cpTracking.getAmplitudeMenuProperties()
    );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('remove'),
      class: 'danger'
    };
  }
}
