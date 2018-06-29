import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs/operators';

import { MemberType } from '../member.status';
import { MembersService } from '../members.service';
import { CPSession } from '../../../../../../session';
import { isClubAthletic } from '../../clubs.athletics.labels';
import { MembersUtilsService } from '../members.utils.service';
import { ClubsUtilsService } from './../../clubs.utils.service';
import { CPI18nService } from '../../../../../../shared/services';
import { BaseComponent } from '../../../../../../base/base.component';

declare var $: any;

interface IState {
  members: Array<any>;
  sort_field: string;
  search_str: string;
  sort_direction: string;
}

const state: IState = {
  members: [],
  search_str: null,
  sort_field: 'member_type',
  sort_direction: 'desc'
};

@Component({
  selector: 'cp-clubs-members',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ClubsMembersComponent extends BaseComponent implements OnInit {
  @Input() isOrientation: boolean;
  @Input() orientationId: number;
  @Input() isAthletic = isClubAthletic.club;

  clubId;
  isEdit;
  groupId;
  loading;
  isCreate;
  isDelete;
  query = null;
  sortingLabels;
  hasSSO = false;
  executiveLeader;
  editMember = '';
  deleteMember = '';
  limitedAdmin = true;
  state: IState = state;
  executiveLeaderType = MemberType.executive_leader;
  defaultImage = require('public/default/user.png');

  constructor(
    private session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private utils: MembersUtilsService,
    public helper: ClubsUtilsService,
    private membersService: MembersService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
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
    const schoolId = this.session.g.get('school').id.toString();
    const calendar_id = this.orientationId ? this.orientationId.toString() : null;

    let memberSearch = new HttpParams()
      .append('school_id', schoolId)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('category_id', this.isAthletic.toString());

    const groupSearch = new HttpParams()
      .append('store_id', this.clubId)
      .append('school_id', schoolId)
      .append('calendar_id', calendar_id)
      .append('category_id', this.isAthletic.toString());

    const socialGroupDetails$ = this.membersService.getSocialGroupDetails(groupSearch);

    const stream$ = socialGroupDetails$.pipe(
      flatMap((groups: any) => {
        memberSearch = memberSearch.append('group_id', groups[0].id.toString());

        this.groupId = groups[0].id;

        return this.membersService.getMembers(memberSearch, this.startRange, this.endRange);
      })
    );

    super.fetchData(stream$).then((res) => (this.state.members = res.data));
  }

  forceRefresh() {
    this.fetch();
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.resetPagination();

    this.fetch();
  }

  onLaunchCreateModal() {
    this.isCreate = true;

    $('#membersCreate').modal();
  }

  onTearDown(modal) {
    this[modal] = false;
  }

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.parent.params['clubId'];

    this.limitedAdmin =
      this.isAthletic === isClubAthletic.club
        ? this.helper.limitedAdmin(this.session.g, this.clubId)
        : false;

    this.fetch();

    this.hasSSO = this.session.hasSSO;
    this.executiveLeader = this.utils.getMemberType(this.isOrientation);
    this.sortingLabels = {
      name: this.cpI18n.translate('name'),
      member_type: this.cpI18n.translate('clubs_label_member_type')
    };
  }
}
