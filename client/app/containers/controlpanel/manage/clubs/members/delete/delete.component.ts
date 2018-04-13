import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MembersService } from '../members.service';

import { CPI18nService } from './../../../../../../shared/services/i18n.service';

declare var $: any;

@Component({
  selector: 'cp-members-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class ClubsMembersDeleteComponent implements OnInit {
  @Input() member: any;
  @Input() groupId: number;
  @Input() orientationId: number;

  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;

  constructor(private cpI18n: CPI18nService, private service: MembersService) {}

  onDelete() {
    this.service
      .removeMember(
        {
          calendar_id: this.orientationId,
          member_type: -1,
          group_id: this.groupId,
        },
        this.member.id,
      )
      .subscribe(
        (_) => {
          this.deleted.emit(this.member.id);
          $('#membersDelete').modal('hide');
          this.buttonData = Object.assign({}, this.buttonData, {
            disabled: true,
          });
        },
        (err) => {
          this.buttonData = Object.assign({}, this.buttonData, {
            disabled: true,
          });
          throw new Error(err);
        },
      );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('remove'),
      class: 'danger',
    };
  }
}
