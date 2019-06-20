import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { baseActionClass } from '@campus-cloud/store';
import { baseActions, IHeader } from '@campus-cloud/store/base';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { parseErrorResponse, UserType } from '@campus-cloud/shared/utils';
import { CPI18nService, AdminService, CPTrackingService } from '@campus-cloud/shared/services';
import { HttpErrorResponseMessage, PhraseAppKeys, RequestParams } from '../team.utils.service';

interface IState {
  admins: Array<any>;
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  admins: [],
  search_str: null,
  sort_field: 'firstname',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent extends BaseComponent implements OnInit {
  loading;
  sortingLabels;
  deleteAdmin = '';
  state: IState = state;
  disabledSendInviteButtons = [];

  constructor(
    public session: CPSession,
    public store: Store<IHeader>,
    public cpI18n: CPI18nService,
    public adminService: AdminService,
    public cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.resetPagination();

    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  fetch() {
    const search = new HttpParams()
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.adminService.getAdmins(this.startRange, this.endRange, search))
      .then((res) => {
        this.state = Object.assign({}, this.state, { admins: res.data });
      })
      .catch((_) => {});
  }

  private buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: require('../../settings.header.json')
    });
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  onForbidden() {
    $('#teamUnauthorziedModal').modal();
  }

  onDeleted(adminId) {
    this.state = Object.assign({}, this.state, {
      admins: this.state.admins.filter((admin) => admin.id !== adminId)
    });

    if (this.state.admins.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  onResendInvite(data, index) {
    this.disabledSendInviteButtons[index] = true;
    const body = {
      resend_invite: RequestParams.resend
    };

    this.adminService.updateAdmin(data.id, body).subscribe(
      () => {
        this.trackResendInvite(data.email);
        this.handleSuccess(PhraseAppKeys.inviteSuccess);
      },
      (err) => {
        this.handleError(err);
        this.disabledSendInviteButtons[index] = false;
      }
    );
  }

  handleError(err) {
    const error = parseErrorResponse(err.error);
    const phraseAppKey =
      error === HttpErrorResponseMessage.adminActivated
        ? PhraseAppKeys.inviteFail
        : PhraseAppKeys.somethingWrong;

    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate(phraseAppKey)
      })
    );
  }

  handleSuccess(phraseAppKey) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(phraseAppKey)
      })
    );
  }

  trackResendInvite(email) {
    const source = UserType.isInternal(email) ? amplitudeEvents.INTERNAL : amplitudeEvents.EXTERNAL;

    const eventProperties = {
      source,
      invite_type: amplitudeEvents.RESENT_INVITE
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.INVITED_TEAM_MEMBER, eventProperties);
  }

  ngOnInit() {
    this.fetch();
    this.buildHeader();

    this.sortingLabels = {
      name: this.cpI18n.translate('name'),
      status: this.cpI18n.translate('t_shared_status')
    };
  }
}
