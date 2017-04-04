import { Component, OnInit } from '@angular/core';

import { MembersService } from '../members.service';
import { BaseComponent } from '../../../../../../base/base.component';

declare var $: any;

@Component({
  selector: 'cp-clubs-members',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ClubsMembersComponent extends BaseComponent implements OnInit {
  members;
  loading;
  isEdit;
  isCreate;
  isDelete;
  editMember = '';
  deleteMember = '';

  constructor(
    private membersService: MembersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.membersService.getMembers())
      .then(res => this.members = res.data)
      .catch(err => console.log(err));
  }

  onLaunchCreateModal() {
    this.isCreate = true;
    $('#membersCreate').modal();
  }

  onTearDown(modal) {
    this[modal] = false;
  }

  ngOnInit() { }
}
