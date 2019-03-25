import { FormGroup, AbstractControl } from '@angular/forms';
import { OnInit, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { IItem } from '@shared/components';
import { MODAL_DATA, IModal } from '@shared/services';
import { MemberModel, IMember, MemberType } from '@libs/members/common/model';
import { LibsCommonMembersUtilsService } from '@libs/members/common/providers';

@Component({
  selector: 'cp-orientation-members-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class OrientationMembersEditComponent implements OnInit {
  form: FormGroup;
  member: IMember;
  groupId: number;
  selectedType: IItem;
  memberTypes: IItem[];
  members: IMember[] = [];
  isExecutiveLeader = MemberType.executive_leader;

  constructor(
    @Inject(MODAL_DATA) private modal: IModal,
    private utils: LibsCommonMembersUtilsService,
    private store: Store<fromStore.IOrientationMembersState>
  ) {}

  onClose() {
    this.modal.onClose();
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }

    const memberPostion: AbstractControl = this.form.get('member_position');
    const memberTypeControl: AbstractControl = this.form.get('member_type');

    if (memberTypeControl.value !== MemberType.executive_leader) {
      memberPostion.setValue('');
    }

    const payload = {
      member: this.form.value,
      memberId: this.modal.data.member.id
    };

    this.store.dispatch(new fromStore.EditMember(payload));
    this.modal.onClose();
  }

  ngOnInit() {
    const { member, groupId } = this.modal.data;
    this.member = member;
    this.groupId = groupId;

    this.memberTypes = this.utils.getMemberDropdown('leader');
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
