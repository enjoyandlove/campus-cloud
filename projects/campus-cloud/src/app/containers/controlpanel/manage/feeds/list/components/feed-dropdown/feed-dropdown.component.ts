import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { mergeMap, startWith, takeUntil, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { get as _get } from 'lodash';

import * as fromStore from '../../../store';

import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { User } from '@campus-cloud/shared/models';
import { baseActionClass } from '@campus-cloud/store/base';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { canSchoolReadResource } from '@campus-cloud/shared/utils';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { CPI18nService, UserService } from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-dropdown',
  templateUrl: './feed-dropdown.component.html',
  styleUrls: ['./feed-dropdown.component.scss']
})
export class FeedDropdownComponent implements OnInit, OnDestroy {
  @Input() feed;
  @Input() isComment: boolean;
  @Input() requiresApproval: Observable<boolean>;
  @Input() isCampusWallView: Observable<number>;
  @Output() selected: EventEmitter<number> = new EventEmitter();

  options;
  _isCampusWallView;
  _requiresApproval;
  isBanned$: Observable<boolean>;
  bannedEmails$ = this.store.pipe(select(fromStore.getBannedEmails));

  destroy$ = new Subject<null>();

  emitDestroy() {}

  constructor(
    private session: CPSession,
    public cpI18n: CPI18nService,
    private userService: UserService,
    private store: Store<fromStore.IWallsState | ISnackbar>
  ) {}

  ngOnInit() {
    if (!this.requiresApproval) {
      return this.requiresApproval.pipe(startWith(false));
    }

    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });

    this.requiresApproval.pipe(takeUntil(this.destroy$)).subscribe((requiresApproval) => {
      this._requiresApproval = requiresApproval;

      if (!requiresApproval && this.options) {
        this.removeApproveOption();
      }
    });

    let items = [
      {
        action: 3,
        isPostOnly: false,
        label: this.cpI18n.translate(this.isComment ? 'feeds_delete_comment' : 'feeds_delete_post')
      }
    ];

    if (this._isCampusWallView) {
      const approveMenu = {
        action: 2,
        label: this.cpI18n.translate('feeds_move_post'),
        isPostOnly: true
      };

      items = [approveMenu, ...items];
    }

    if (this.showMuteOption()) {
      items = [
        ...items,
        {
          action: 4,
          isPostOnly: false,
          label: this.cpI18n.translate('t_shared_student_mute')
        }
      ];
    }

    if (this._requiresApproval) {
      const flaggedMenu = {
        action: 1,
        isPostOnly: false,
        label: this.cpI18n.translate(
          this.isComment ? 'feeds_approve_comment' : 'feeds_approve_post'
        )
      };

      items = [flaggedMenu, ...items];
    }

    this.options = this.isComment ? items.filter((item) => !item.isPostOnly) : items;

    if (this.showMuteOption()) {
      this.bannedEmails$.pipe(takeUntil(this.destroy$)).subscribe((emails: string[]) => {
        const muted = emails.includes(this.getFeedEmail());
        const phraseAppKey = muted ? 't_walls_unmute_student' : 't_walls_mute_student';
        this.options.find((o) => o.action === 4).label = this.cpI18n.translate(phraseAppKey);
      });
    }
  }

  ngOnDestroy() {
    this.emitDestroy();
  }

  onOptionClicked(action) {
    if (action === 4) {
      this.muteUser();
    } else {
      this.selected.emit(action);
    }
  }

  removeApproveOption() {
    this.options = this.options.filter((option) => option.action !== 1);
  }

  muteUser() {
    const { user_id } = this.feed;
    const email = this.getFeedEmail();

    this.bannedEmails$
      .pipe(
        take(1),
        mergeMap((emails: string[]) => {
          return this.userService.updateById(user_id, {
            social_restriction: !emails.includes(this.getFeedEmail())
          });
        })
      )
      .subscribe(
        ({ social_restriction }: any) => {
          if (social_restriction) {
            this.store.dispatch(fromStore.banEmail({ email }));
          } else {
            this.store.dispatch(fromStore.unBanEmail({ email }));
          }
        },
        () => this.handleError()
      );
  }

  private showMuteOption() {
    const hasAppUserManagementPrivileges = canSchoolReadResource(
      this.session.g,
      CP_PRIVILEGES_MAP.app_user_management
    );
    return (
      this.isByAppUser() && hasAppUserManagementPrivileges && User.isActive(this.feed.user_status)
    );
  }

  private getFeedEmail(): string {
    return _get(this.feed, 'email', '');
  }

  private isByAppUser() {
    const email = this.getFeedEmail();
    return Boolean(email.length);
  }

  private handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }
}
