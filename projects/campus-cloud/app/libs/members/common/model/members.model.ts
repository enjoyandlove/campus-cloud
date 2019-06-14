import { FormBuilder, Validators } from '@angular/forms';
import { IMember } from './members.interface';

export class MemberModel {
  static form(member?: IMember) {
    const fb = new FormBuilder();

    const _member = {
      member: member ? member.id : null,
      member_type: member ? member.member_type : null,
      member_position: member ? member.member_position : null
    };

    return fb.group({
      group_id: [null],
      member: [_member.member, Validators.required],
      member_type: [_member.member_type, Validators.required],
      member_position: [_member.member_position]
    });
  }
}
