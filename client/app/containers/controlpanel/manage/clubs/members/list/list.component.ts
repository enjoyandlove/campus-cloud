import { ActivatedRoute } from '@angular/router';

import { Component, Input, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { MemberType } from '../member.status';
import { MembersService } from '../members.service';

import { CPSession } from '../../../../../../session';

import { BaseComponent } from '../../../../../../base/base.component';
import { isClubAthletic } from '../../clubs.athletics.labels';
import { MembersUtilsService } from '../members.utils.service';

declare var $: any;

interface IState {
  members: Array<any>;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  members: [],
  sort_field: 'member_type',
  sort_direction: 'desc',
};

@Component({
  selector: 'cp-clubs-members',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ClubsMembersComponent extends BaseComponent implements OnInit {
  @Input() isOrientation: boolean;
  @Input() orientationId: number;
  @Input() isAthletic = isClubAthletic.club;

  isEdit;
  groupId;
  loading;
  isCreate;
  isDelete;
  query = null;
  hasSSO = false;
  executiveLeader;
  editMember = '';
  deleteMember = '';
  state: IState = state;
  executiveLeaderType = MemberType.executive_leader;
  defaultImage = require('public/default/user.png');

  constructor(
    private session: CPSession,
    private route: ActivatedRoute,
    private utils: MembersUtilsService,
    private membersService: MembersService,
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc',
    };
    this.fetch();
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
    const calendar_id = this.orientationId ? this.orientationId.toString() : null;

    memberSearch.append('school_id', schoolId);
    memberSearch.append('sort_field', this.state.sort_field);
    memberSearch.append('sort_direction', this.state.sort_direction);
    memberSearch.append('category_id', this.isAthletic.toString());

    groupSearch.append('store_id', clubId);
    groupSearch.append('school_id', schoolId);
    groupSearch.append('calendar_id', calendar_id);
    groupSearch.append('category_id', this.isAthletic.toString());

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

    super.fetchData(stream$).then((res) => (this.state.members = res.data));
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
    this.hasSSO = this.session.hasSSO;
    this.executiveLeader = this.utils.getMemberType(this.isOrientation);
  }
}
