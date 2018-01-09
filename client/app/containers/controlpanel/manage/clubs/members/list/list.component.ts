import { ActivatedRoute } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { MemberType } from '../member.status';
import { MembersService } from '../members.service';

import { CPSession } from '../../../../../../session';

import { BaseComponent } from '../../../../../../base/base.component';

declare var $: any;

interface IState {
  members: Array<any>;
}

const state: IState = {
  members: [],
};

@Component({
  selector: 'cp-clubs-members',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ClubsMembersComponent extends BaseComponent implements OnInit {
  isEdit;
  groupId;
  loading;
  isCreate;
  isDelete;
  query = null;
  hasSSO = false;
  editMember = '';
  deleteMember = '';
  state: IState = state;
  excutiveType = MemberType.executive;
  defaultImage = require('public/default/user.png');

  constructor(
    private session: CPSession,
    private route: ActivatedRoute,
    private membersService: MembersService,
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  private fetch() {
    const groupSearch = new URLSearchParams();
    const memberSearch = new URLSearchParams();
    const schoolId = this.session.g.get('school').id.toString();
    const clubId = this.route.snapshot.parent.parent.parent.params['clubId'];

    memberSearch.append('school_id', schoolId);

    groupSearch.append('store_id', clubId);
    groupSearch.append('school_id', schoolId);

    const socialGroupDetails$ = this.membersService.getSocialGroupDetails(
      groupSearch,
    );

    const stream$ = socialGroupDetails$.flatMap((groups: any) => {
      memberSearch.append('group_id', groups[0].id.toString());

      this.groupId = groups[0].id;

      return this.membersService.getMembers(
        memberSearch,
        this.startRange,
        this.endRange,
      );
    });

    super
      .fetchData(stream$)
      .then((res) => (this.state.members = res.data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  forceRefresh() {
    this.fetch();
  }

  onFilter(query) {
    this.query = query;
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
    this.hasSSO = this.session.hasSSO();
  }
}
