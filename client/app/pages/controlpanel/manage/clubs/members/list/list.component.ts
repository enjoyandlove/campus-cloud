import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { MembersService } from '../members.service';
import { CPSession } from '../../../../../../session';
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
    private session: CPSession,
    private route: ActivatedRoute,
    private membersService: MembersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    let groupSearch = new URLSearchParams();
    let memberSearch = new URLSearchParams();

    memberSearch.append('school_id', this.session.school.id.toString());

    groupSearch.append('store_id', this.route.snapshot.parent.parent.parent.params['clubId']);
    groupSearch.append('school_id', this.session.school.id.toString());

    let socialGroupDetails$ = this.membersService.getSocialGroupDetails(groupSearch);

    let stream$ = socialGroupDetails$.flatMap((groups: any) => {
      memberSearch.append('group_id', groups[0].id.toString());

      return this.membersService.getMembers(memberSearch);
    });

    super
      .fetchData(stream$)
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

  ngOnInit() {
    this.fetch();
  }
}
