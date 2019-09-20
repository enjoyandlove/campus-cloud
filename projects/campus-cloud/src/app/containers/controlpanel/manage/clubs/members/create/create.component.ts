import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CPI18nService } from '@campus-cloud/shared/services';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { IItem, ICPButtonProps } from '@campus-cloud/shared/components';
import { MemberModel, IMember, MemberType } from '@campus-cloud/libs/members/common/model';
import {
  LibsCommonMembersService,
  LibsCommonMembersUtilsService
} from '@campus-cloud/libs/members/common/providers';

@Mixin([Destroyable])
@Component({
  selector: 'cp-members-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class ClubsMembersCreateComponent implements OnInit, OnDestroy {
  @Input() groupId: number;

  @Output() added: EventEmitter<IMember> = new EventEmitter();

  form: FormGroup;
  memberTypes: IItem[];
  buttonData: ICPButtonProps;
  isExecutiveLeader = MemberType.executive_leader;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private cpI18n: CPI18nService,
    private service: LibsCommonMembersService,
    private utils: LibsCommonMembersUtilsService
  ) {}

  doReset() {
    this.form.controls['member'].setValue(null);
    this.form.controls['member_type'].setValue(this.memberTypes[0].action);
  }

  onSave() {
    if (!this.form.valid) {
      return;
    }

    const memberPostion: AbstractControl = this.form.get('member_position');
    const memberTypeControl: AbstractControl = this.form.get('member_type');

    if (memberTypeControl.value !== MemberType.executive_leader) {
      memberPostion.setValue('');
    }

    this.service.addMember(this.form.value, this.form.value.member).subscribe(
      (member: IMember) => {
        this.utils.trackMemberCreate(member);
        this.added.emit(member);
        $('#membersCreate').modal('hide');
        this.doReset();
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

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('save'),
      disabled: true,
      class: 'primary'
    };

    this.memberTypes = this.utils.getMemberDropdown('executive');

    this.form = MemberModel.form();
    this.form.get('group_id').setValue(this.groupId);
    this.form.get('member_type').setValue(this.memberTypes[0].action);

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.buttonData = {
        ...this.buttonData,
        disabled: !this.form.valid
      };
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
