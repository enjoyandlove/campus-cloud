import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalService } from '@ready-education/ready-ui/overlays/modal/modal.service';
import { Observable, Subject, of, combineLatest, BehaviorSubject } from 'rxjs';
import { map, tap, take, mergeMap, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { get as _get, isEqual } from 'lodash';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../../store';

import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { User, IUser } from '@campus-cloud/shared/models';
import { baseActionClass } from '@campus-cloud/store/base';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { canSchoolReadResource } from '@campus-cloud/shared/utils';
import { CPUnsavedChangesModalComponent } from '@campus-cloud/shared/components';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';
import { UserService, CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-dropdown',
  templateUrl: './feed-dropdown.component.html',
  styleUrls: ['./feed-dropdown.component.scss'],
  providers: [ModalService]
})
export class FeedDropdownComponent implements OnInit, OnDestroy {
  _readOnlyMode: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @Input() feed;
  @Input() isComment: boolean;
  @Input() isCampusWallView: Observable<number>;
  @Output() selected: EventEmitter<number> = new EventEmitter();

  @Input()
  set readOnlyMode(readOnlyMode: boolean) {
    this._readOnlyMode.next(readOnlyMode);
  }

  view$: Observable<{
    deleted: boolean;
    options: Array<any>;
  }>;

  unsavedChangesModal;
  filters$ = this.store.pipe(select(fromStore.getViewFilters));
  bannedEmails$ = this.store.pipe(select(fromStore.getBannedEmails));

  destroy$ = new Subject<null>();

  emitDestroy() {}

  constructor(
    private router: Router,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private utils: FeedsUtilsService,
    private userService: UserService,
    private modalService: ModalService,
    private cpTracking: CPTrackingService,
    private feedsAmplitudeService: FeedsAmplitudeService,
    private store: Store<fromStore.IWallsState | ISnackbar>
  ) {}

  canEdit(): Observable<boolean> {
    return 'extern_poster_id' in this.feed
      ? combineLatest([
          this._readOnlyMode,
          this.store.pipe(select(fromStore.getSocialGroupIds)),
          this.filters$
        ]).pipe(
          map(([readOnly, socialGroupIds, { flaggedByModerators, searchTerm }]) => {
            if (readOnly) {
              return false;
            }
            const { name } = this.route.routeConfig.component;
            const notSearching = searchTerm === '' || name === 'FeedsInfoComponent';
            const notDeleted = !flaggedByModerators;
            const hostHasAccessToSocialGroup = socialGroupIds.includes(this.feed.extern_poster_id);
            return notSearching && notDeleted && hostHasAccessToSocialGroup;
          })
        )
      : of(false);
  }

  isCampusWall(): Observable<boolean> {
    return this.filters$.pipe(map(({ group }) => !group));
  }

  isMuted(): Observable<boolean> {
    return this.bannedEmails$
      .pipe(takeUntil(this.destroy$))
      .pipe(map((emails) => emails.includes(this.getFeedEmail())));
  }

  getItems() {
    return combineLatest([this.canEdit(), this.isCampusWall(), this.isMuted()]).pipe(
      map(([canEdit, isCampusWall, isMuted]) => {
        const items = [];
        const requiresApproval = this.feed.dislikes > 0 && this.feed.flag !== 2;

        const flaggedMenu = {
          action: 1,
          isPostOnly: false,
          label: this.cpI18n.translate('t_feeds_approve')
        };

        const approveMenu = {
          action: 2,
          label: this.cpI18n.translate('t_feeds_move'),
          isPostOnly: true
        };

        const deleteMenu = {
          action: 3,
          isPostOnly: false,
          label: this.cpI18n.translate('t_feeds_delete')
        };

        const muteMenu = {
          action: 4,
          isPostOnly: false,
          label: isMuted
            ? this.cpI18n.translate('t_walls_unmute_student')
            : this.cpI18n.translate('t_shared_student_mute')
        };

        const editMenu = {
          action: 5,
          isPostOnly: false,
          label: this.cpI18n.translate('t_feeds_edit')
        };

        const permalinkMenu = {
          action: 6,
          isPostOnly: true,
          label: this.cpI18n.translate('t_shared_permalink')
        };

        items.push(deleteMenu);

        if (requiresApproval) {
          items.push(flaggedMenu);
        }

        if (isCampusWall) {
          items.push(approveMenu);
        }

        if (this.showMuteOption()) {
          items.push(muteMenu);
        }

        if (canEdit) {
          items.push(editMenu);
        }

        if (!this.utils.isPostDetailPage()) {
          items.push(permalinkMenu);
        }

        return this.isComment ? items.filter((item) => !item.isPostOnly) : items;
      })
    );
  }

  ngOnInit() {
    this.view$ = combineLatest([this.filters$, this.getItems()]).pipe(
      map(([{ flaggedByModerators }, options]) => ({
        options,
        deleted: Boolean(flaggedByModerators)
      }))
    );
  }

  ngOnDestroy() {
    this.emitDestroy();
  }

  cancelHandler() {
    this.unsavedChangesModal.dispose();
  }

  discardHandler(editing) {
    this.store.dispatch(fromStore.setEdit({ editing }));
    this.unsavedChangesModal.dispose();
  }

  onOptionClicked(action) {
    if (action === 4) {
      this.muteUser();
    }
    if (action === 5) {
      const payload = {
        id: this.feed.id,
        type: this.isComment ? 'COMMENT' : 'THREAD'
      };
      this.store
        .pipe(select(fromStore.getEditing))
        .pipe(take(1))
        .subscribe((editing) => {
          if (editing && editing.id !== this.feed.id) {
            this.unsavedChangesModal = this.modalService.open(CPUnsavedChangesModalComponent, {
              cancel: this.cancelHandler.bind(this),
              discard: () => this.discardHandler.call(this, payload)
            });
            return;
          }
          const toggle = isEqual(editing, payload);
          this.store.dispatch(fromStore.setEdit({ editing: toggle ? null : payload }));
        });
    }
    if (action === 6) {
      this.feedsAmplitudeService.trackViewedPostDetail();
      this.router.navigate([`/manage/feeds/${this.feed.id}/info`], {
        queryParams: { groupId: this.feed.group_id }
      });
    } else {
      this.selected.emit(action);
    }
  }

  muteUser() {
    const { user_id } = this.feed;
    const email = this.getFeedEmail();

    this.bannedEmails$
      .pipe(
        take(1),
        mergeMap((emails: string[]) => {
          return this.userService
            .updateById(user_id, {
              school_id: this.session.school.id,
              social_restriction: !emails.includes(this.getFeedEmail())
            })
            .pipe(tap((res) => this.trackMuteUser(res)));
        })
      )
      .subscribe(
        (user: IUser) => {
          if (User.isMutedInSchool(user, this.session.school.id)) {
            this.store.dispatch(fromStore.banEmail({ email }));
          } else {
            this.store.dispatch(fromStore.unBanEmail({ email }));
          }
        },
        () => this.handleError()
      );
  }

  trackMuteUser(user) {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MUTED_USER,
      this.feedsAmplitudeService.getWallMutedUserAmplitude(user)
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
