import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { UserType } from '@campus-cloud/shared/utils';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { TeamModel } from '@controlpanel/settings/team/model/team.model';
import { accountsToStoreMap } from '@campus-cloud/shared/utils/privileges';
import { baseActionClass, baseActions, IHeader } from '@campus-cloud/store/base';
import { AdminService, CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
  user;
  schoolId;
  form: FormGroup;
  isAllAccessEnabled;
  schoolPrivileges = {};
  accountPrivileges = {};

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public teamService: AdminService,
    public cpTracking: CPTrackingService,
    public store: Store<IHeader | ISnackbar>
  ) {}

  private buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: require('../../settings.header.json')
    });
  }

  onSubmit(data) {
    this.teamService.createAdmin(data).subscribe(
      () => {
        const source = UserType.isInternal(data.email)
          ? amplitudeEvents.INTERNAL
          : amplitudeEvents.EXTERNAL;

        const eventProperties = {
          source,
          invite_type: amplitudeEvents.NEW_INVITE
        };

        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.INVITED_TEAM_MEMBER, eventProperties);
        this.router.navigate(['/settings/team']);
      },
      (err) => {
        if (err.status === 409) {
          const message = this.cpI18n.translate('duplicate_entry');
          this.handleError(message);

          return;
        }

        const message = this.cpI18n.translate('something_went_wrong');
        this.handleError(message);
      }
    );
  }

  handleError(body) {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body
      })
    );
  }

  onToggleAllAccess(checked) {
    this.isAllAccessEnabled = checked;

    if (checked) {
      this.accountPrivileges = {
        ...accountsToStoreMap(
          this.user.account_mapping[this.schoolId],
          this.user.account_level_privileges
        )
      };

      this.schoolPrivileges = {
        ...this.user.school_level_privileges[this.schoolId]
      };

      return;
    }

    this.schoolPrivileges = {};
    this.accountPrivileges = {};
  }

  ngOnInit() {
    const session = this.session.g;
    this.user = session.get('user');
    this.schoolId = session.get('school').id;

    this.buildHeader();
    this.form = TeamModel.form();
  }
}
