import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs/operators';

import { MemberType } from '../member.status';
import { IMember } from '../members.interface';
import { MembersService } from '../members.service';
import { CPSession } from '../../../../../../session';
import { isClubAthletic } from '../../clubs.athletics.labels';
import { MembersUtilsService } from '../members.utils.service';
import { ClubsUtilsService } from './../../clubs.utils.service';
import { BaseComponent } from '../../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from '../../../../../../shared/constants';
import { CP_TRACK_TO } from '../../../../../../shared/directives/tracking';
import { environment } from './../../../../../../../environments/environment';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { canSchoolReadResource } from '../../../../../../shared/utils/privileges';
import { CPI18nService, CPTrackingService, RouteLevel } from '../../../../../../shared/services';

declare var $: any;

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
  @Input() storeId: number;
  @Input() isOrientation: boolean;
  @Input() orientationId: number;
  @Input() isAthletic = isClubAthletic.club;

  clubId;
  isEdit;
  groupId;
  loading;
  isCreate;
  isDelete;
  eventData;
  query = null;
  sortingLabels;
  showStudentIds;
  executiveLeader;
  editMember = '';
  deleteMember = '';
  limitedAdmin = true;
  state: IState = state;
  executiveLeaderType = MemberType.executive_leader;
  defaultImage = `${environment.root}public/default/user.png`;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    public helper: ClubsUtilsService,
    private utils: MembersUtilsService,
    private membersService: MembersService,
    private cpTracking: CPTrackingService
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
      .append('category_id', this.isAthletic.toString())
      .append('search_str', this.state.search_str);

    let groupSearch = new HttpParams().append('school_id', schoolId);

    if (this.isOrientation) {
      groupSearch = groupSearch.append('calendar_id', calendar_id);
    } else {
      groupSearch = groupSearch
        .append('category_id', this.isAthletic.toString())
        .append('store_id', this.clubId ? this.clubId : this.storeId);
    }

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

  onDownloadCsvFile() {
    this.trackDownloadedMembers();
    this.utils.createExcel(this.state.members);
  }

  onLaunchCreateModal() {
    this.isCreate = true;

    $('#membersCreate').modal();
  }

  onTearDown(modal) {
    this[modal] = false;
  }

  trackDownloadedMembers() {
    const sub_menu_name = this.cpTracking.activatedRoute(RouteLevel.second);

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_DOWNLOAD_MEMBER_DATA, {
      sub_menu_name
    });
  }

  ngOnInit() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.MEMBER
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties
    };

    this.clubId = this.route.snapshot.parent.parent.parent.params['clubId'];

    this.limitedAdmin =
      this.isAthletic === isClubAthletic.club
        ? this.helper.limitedAdmin(this.session.g, this.clubId)
        : false;

    this.fetch();

    const clubPrivilege =
      this.isAthletic === isClubAthletic.athletic
        ? CP_PRIVILEGES_MAP.athletics
        : this.isOrientation ? CP_PRIVILEGES_MAP.orientation : CP_PRIVILEGES_MAP.clubs;
    this.showStudentIds =
      canSchoolReadResource(this.session.g, clubPrivilege) && this.session.hasSSO;
    this.executiveLeader = this.utils.getMemberType(this.isOrientation);
    this.sortingLabels = {
      name: this.cpI18n.translate('name'),
      member_type: this.cpI18n.translate('clubs_label_member_type')
    };
  }
}
