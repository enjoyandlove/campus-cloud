import { AbstractControl, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { IItem } from '@shared/components';
import { MODAL_DATA, IModal } from '@shared/services';
import { MemberModel, MemberType } from '@libs/members/common/model';
import { LibsCommonMembersUtilsService } from '@libs/members/common/providers';

@Component({
  selector: 'cp-orientation-members-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class OrientationMembersCreateComponent implements OnInit {
  form: FormGroup;
  memberTypes: IItem[];
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
      memberId: this.form.value.member
    };

    this.store.dispatch(new fromStore.CreateMember(payload));
    this.modal.onClose();
  }

  ngOnInit() {
    this.memberTypes = this.utils.getMemberDropdown('leader');

    this.form = MemberModel.form();
    this.form.get('group_id').setValue(this.modal.data);
    this.form.get('member_type').setValue(this.memberTypes[0].action);
  }
}
