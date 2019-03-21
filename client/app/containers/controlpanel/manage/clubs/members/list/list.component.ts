import { switchMap, take, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { CPSession } from '@app/session';
import { IMember } from '@libs/members/common/model';
import { ISocialGroup } from './../../../feeds/model';
import { BaseComponent } from '@app/base/base.component';
import { ClubsUtilsService } from './../../clubs.utils.service';
import { canSchoolReadResource } from '@shared/utils/privileges';
import { CP_PRIVILEGES_MAP, amplitudeEvents } from '@shared/constants';
import { CPI18nService, CPTrackingService, RouteLevel } from '@shared/services';
import {
  LibsCommonMembersService,
  LibsCommonMembersUtilsService
} from '@libs/members/common/providers';

interface IState {
  members: Array<IMember>;
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
  isEdit = false;
  clubId: number;
  groupId: number;
  isDelete = false;
  isCreate = false;
  loading: boolean;
  limitedAdmin: boolean;
  state: IState = state;
  showStudentIds: boolean;
  selectedMember: IMember = null;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    public helper: ClubsUtilsService,
    private cpTracking: CPTrackingService,
    private utils: LibsCommonMembersUtilsService,
    private membersService: LibsCommonMembersService
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

    const groupSearch = new HttpParams()
      .set('school_id', schoolId)
      .set('store_id', this.clubId.toString());

    const socialGroupDetails$ = this.membersService.getSocialGroupDetails(groupSearch);

    const stream$ = socialGroupDetails$.pipe(
      take(1),
      map((groups: ISocialGroup[]) => groups.map((g) => g.id)[0]),
      switchMap((groupId: number) => {
        this.groupId = groupId;

        const memberSearch = new HttpParams()
          .set('school_id', schoolId)
          .set('sort_field', this.state.sort_field)
          .set('search_str', this.state.search_str)
          .set('sort_direction', this.state.sort_direction)
          .set('group_id', groupId.toString());

        return this.membersService.getMembers(memberSearch, this.startRange, this.endRange);
      })
    );

    super.fetchData(stream$).then((members) => {
      this.state = {
        ...this.state,
        members: members.data
      };
    });
  }

  onEditClick(member: IMember) {
    this.trackEditEvent();

    this.isEdit = true;
    this.selectedMember = member;
    setTimeout(() => $('#membersEdit').modal());
  }

  trackEditEvent() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.MEMBER
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.VIEWED_ITEM, {
      eventProperties
    });
  }

  forceRefresh() {
    this.fetch();
  }

  onSearch(search_str: string) {
    this.state = { ...this.state, search_str };

    this.resetPagination();

    this.fetch();
  }

  onDownloadCsvFile() {
    this.trackDownloadedMembers();
    this.utils.createExcel(this.state.members);
  }

  onLaunchCreateModal() {
    this.isCreate = true;
    setTimeout(() => $('#membersCreate').modal());
  }

  trackDownloadedMembers() {
    const sub_menu_name = this.cpTracking.activatedRoute(RouteLevel.second);

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_DOWNLOAD_MEMBER_DATA, {
      sub_menu_name
    });
  }

  onDeleteClick(member: IMember) {
    this.isDelete = true;
    this.selectedMember = member;

    setTimeout(() => $('#membersDelete').modal());
  }

  onEditTeaDown() {
    this.isEdit = false;
    $('#membersEdit').modal('hide');
  }

  onDeleteTearDown() {
    this.isDelete = false;
    $('#membersDelete').modal('hide');
  }

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.parent.params['clubId'];

    this.limitedAdmin = this.helper.limitedAdmin(this.session.g, this.clubId);

    this.fetch();

    this.showStudentIds =
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs) && this.session.hasSSO;
  }
}
