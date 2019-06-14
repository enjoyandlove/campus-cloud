import { Input, OnInit, Output, Component, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { IItem } from '@campus-cloud/shared/components';
import { MemberModel, IMember, MemberType } from '@campus-cloud/libs/members/common/model';
import {
  LibsCommonMembersService,
  LibsCommonMembersUtilsService
} from '@campus-cloud/libs/members/common/providers';

@Component({
  selector: 'cp-members-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ClubsMembersEditComponent implements OnInit {
  @Input() member: IMember;
  @Input() groupId: number;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() edited: EventEmitter<IMember> = new EventEmitter();

  form: FormGroup;
  selectedType: IItem;
  memberTypes: IItem[];
  members: IMember[] = [];
  isExecutiveLeader = MemberType.executive_leader;

  constructor(
    private service: LibsCommonMembersService,
    private utils: LibsCommonMembersUtilsService
  ) {}

  doTearDown() {
    this.teardown.emit();
    $('#membersEdit').modal('hide');
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

    this.service.addMember(this.form.value, this.member.id).subscribe((member: IMember) => {
      this.utils.trackMemberEdit(member);
      this.edited.emit(member);
      this.form.reset();
      this.doTearDown();
    });
  }

  ngOnInit() {
    this.memberTypes = this.utils.getMemberDropdown('executive');
    const selectedType = (type: IItem) => type.action === this.member.member_type;
    this.selectedType = this.memberTypes.find(selectedType);

    this.form = MemberModel.form(this.member);
    this.form.get('group_id').setValue(this.groupId);

    // set placeholder for disabled field
    const memberPlaceHolder = `${this.member.firstname} ${this.member.lastname} (${
      this.member.email
    })`;
    this.form.get('member').setValue(memberPlaceHolder);
    this.form.get('member').disable();
  }
}
