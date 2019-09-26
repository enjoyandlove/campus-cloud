import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { isEqual, pick } from 'lodash';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { accountsToStoreMap } from '@campus-cloud/shared/utils';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { TeamModel } from '@controlpanel/settings/team/model/team.model';
import { baseActionClass, baseActions, IHeader } from '@campus-cloud/store/base';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { AdminService, CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.scss']
})
export class TeamEditComponent extends BaseComponent implements OnInit, OnDestroy {
  user;
  adminId;
  loading;
  schoolId;
  editingUser;
  isProfileView;
  isCurrentUser;
  form: FormGroup;
  schoolPrivileges;
  accountPrivileges;
  isAllAccessEnabled;
  currentUserCanManage;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public adminService: AdminService,
    private cpTracking: CPTrackingService,
    private store: Store<IHeader | ISnackbar>
  ) {
    super();
    super
      .isLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.loading = res));
    this.adminId = this.route.snapshot.params['adminId'];
    this.isProfileView = this.route.snapshot.queryParams['profile'];
  }

  fetch() {
    const admin$ = this.adminService.getAdminById(this.adminId);

    super.fetchData(admin$).then((user) => {
      this.editingUser = user.data;

      this.isCurrentUser = this.editingUser.id === this.session.g.get('user').id;

      this.buildHeader(`${this.editingUser.firstname} ${this.editingUser.lastname}`);

      this.buildForm(this.editingUser);

      this.schoolPrivileges = {
        ...this.schoolPrivileges,
        ...this.editingUser.school_level_privileges[this.schoolId]
      };

      // pick only current school account privileges
      this.accountPrivileges = pick(
        this.editingUser.account_level_privileges,
        this.editingUser.account_mapping[this.schoolId]
      );

      this.isAllAccessEnabled =
        isEqual(this.schoolPrivileges, this.user.school_level_privileges[this.schoolId]) &&
        isEqual(this.accountPrivileges, this.user.account_level_privileges);
    });
  }

  private buildHeader(name) {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${name}[NOTRANSLATE]`,
        crumbs: {
          url: this.isProfileView ? null : '/settings/team',
          label: this.isProfileView ? null : 'team_settings'
        },
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  private buildForm(profile) {
    this.form = TeamModel.form(profile);
  }

  onSubmit(data) {
    this.adminService.updateAdmin(this.adminId, data).subscribe(
      () => {
        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPDATED_TEAM_MEMBER);
        this.router.navigate([this.currentUserCanManage ? '/settings/team' : '/dashboard']);
      },
      (err) => {
        if (err.status === 403) {
          $('#teamUnauthorziedModal').modal({ keyboard: true, focus: true });

          return;
        }

        if (err.status === 409) {
          const message = this.cpI18n.translate('duplicate_entry');
          this.handleError(message);

          return;
        }

        const message = this.cpI18n.translate('all_fields_are_required');
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

  onToggleAllAccess(checked: boolean) {
    this.isAllAccessEnabled = checked;

    if (checked) {
      this.accountPrivileges = {
        ...accountsToStoreMap(
          this.user.account_mapping[this.schoolId],
          this.user.account_level_privileges
        )
      };

      this.schoolPrivileges = {
        ...this.schoolPrivileges,
        ...this.user.school_level_privileges[this.schoolId]
      };

      return;
    }

    this.schoolPrivileges = {};
    this.accountPrivileges = {};
  }

  ngOnInit() {
    this.user = this.session.g.get('user');
    this.schoolId = this.session.g.get('school').id;

    const schoolPrivileges = this.user.school_level_privileges[this.schoolId] || {};

    this.currentUserCanManage =
      CP_PRIVILEGES_MAP.manage_admin in schoolPrivileges
        ? schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin].w
        : false;

    this.fetch();
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
