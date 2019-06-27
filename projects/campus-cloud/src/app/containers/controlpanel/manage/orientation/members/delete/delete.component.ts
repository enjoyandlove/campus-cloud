import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { MODAL_DATA, IModal } from '@campus-cloud/shared/services';
import { IMember, MemerUpdateType } from '@campus-cloud/libs/members/common/model';

@Component({
  selector: 'cp-orientation-members-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class OrientationMembersDeleteComponent implements OnInit {
  groupId: number;
  member: IMember;

  constructor(
    @Inject(MODAL_DATA) private modal: IModal,
    private store: Store<fromStore.IOrientationMembersState>
  ) {}

  resetModal() {
    this.modal.onClose();
  }

  onDelete() {
    const payload = {
      body: {
        group_id: this.groupId,
        member_type: MemerUpdateType.remove
      },
      memberId: this.member.id
    };
    this.store.dispatch(new fromStore.DeleteMember(payload));
    this.modal.onClose();
  }

  ngOnInit() {
    const { member, groupId } = this.modal.data;
    this.member = member;
    this.groupId = groupId;
  }
}
