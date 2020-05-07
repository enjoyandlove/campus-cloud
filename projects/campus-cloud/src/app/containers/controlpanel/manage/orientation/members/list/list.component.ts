import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil, take, filter } from 'rxjs/operators';
import { OverlayRef } from '@angular/cdk/overlay';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { Mixin } from '@campus-cloud/shared/mixins';
import { CPSession } from '@campus-cloud/session';
import { commonParams } from '@campus-cloud/shared/constants';
import { IMember } from '@campus-cloud/libs/members/common/model';
import { RouterParamsUtils } from '@campus-cloud/shared/utils/router';
import { Destroyable } from '@campus-cloud/shared/mixins/destroyable';
import { OrientationMembersEditComponent } from '../edit/edit.component';
import { IPaginationParam, IFilterParam } from '@campus-cloud/shared/types';
import { canSchoolReadResource } from '@campus-cloud/shared/utils/privileges';
import { OrientationMembersCreateComponent } from '../create/create.component';
import { OrientationMembersDeleteComponent } from '../delete/delete.component';
import { CP_PRIVILEGES_MAP, amplitudeEvents } from '@campus-cloud/shared/constants';
import { LibsCommonMembersUtilsService } from '@campus-cloud/libs/members/common/providers';
import { ModalService, CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-orientation-members-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [RouterParamsUtils]
})
@Mixin([Destroyable])
export class OrientationMembersListComponent implements OnInit, OnDestroy {
  groupId: number;
  activeModal: OverlayRef;
  showStudentIds: boolean;
  loading$: Observable<boolean>;
  members$: Observable<IMember[]>;
  filters$: Observable<IFilterParam>;
  pagination$: Observable<IPaginationParam>;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private cpTracking: CPTrackingService,
    private routerUtils: RouterParamsUtils,
    private utils: LibsCommonMembersUtilsService,
    private store: Store<fromStore.IOrientationMembersState>
  ) {}

  doSort(sortField: string) {
    const currentDirection = this.routerUtils.getQueryParamByKeyName(commonParams.sortDirection);
    const sortDirection = this.routerUtils.toggleDirection(currentDirection as string);
    this.routerUtils.appendParamToRoute({
      [commonParams.sortField]: sortField,
      [commonParams.sortDirection]: sortDirection
    });
    this.fetch();
  }

  onPaginationNext(currentPage: number) {
    this.routerUtils.appendParamToRoute({ [commonParams.page]: currentPage });
    this.fetch();
  }

  onPaginationPrevious(currentPage: number) {
    this.routerUtils.appendParamToRoute({ [commonParams.page]: currentPage });
    this.fetch();
  }

  fetch(withGroups = false) {
    if (withGroups) {
      const { orientationId } = this.route.snapshot.parent.parent.params;
      this.store.dispatch(new fromStore.GetSocialGroups({ orientationId }));
    } else {
      this.store
        .select(fromStore.getGroupId)
        .pipe(take(1))
        .subscribe((groupId) => {
          this.store.dispatch(new fromStore.GetMembers({ groupId }));
        });
    }
  }

  trackEditEvent() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.VIEWED_ITEM,
      this.cpTracking.getAmplitudeMenuProperties()
    );
  }

  onSearch(query: string) {
    this.routerUtils.appendParamToRoute({ [commonParams.searchStr]: query });

    this.fetch();
  }

  onDownloadCsvFile() {
    this.members$.pipe(take(1)).subscribe((members) => {
      this.utils.createExcel(members);
      this.trackDownloadedMembers();
    });
  }

  trackDownloadedMembers() {
    const menus = this.cpTracking.getAmplitudeMenuProperties();
    const sub_menu_name = menus['sub_menu_name'];

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_DOWNLOAD_MEMBER_DATA, {
      sub_menu_name
    });
  }

  closeActiveModal() {
    this.modalService.close(this.activeModal);
  }

  onEditClick(member: IMember) {
    this.trackEditEvent();

    this.activeModal = this.modalService.open(
      OrientationMembersEditComponent,
      {},
      {
        data: { member, groupId: this.groupId },
        onClose: this.closeActiveModal.bind(this)
      }
    );
  }

  onLaunchCreateModal() {
    this.activeModal = this.modalService.open(
      OrientationMembersCreateComponent,
      {},
      {
        data: this.groupId,
        onClose: this.closeActiveModal.bind(this)
      }
    );
  }

  onDeleteClick(member: IMember) {
    this.activeModal = this.modalService.open(
      OrientationMembersDeleteComponent,
      {},
      {
        data: { member, groupId: this.groupId },
        onClose: this.closeActiveModal.bind(this)
      }
    );
  }

  ngOnInit() {
    this.members$ = this.store.select(fromStore.getMembers);

    this.store
      .select(fromStore.getGroupId)
      .pipe(
        takeUntil(this.destroy$),
        filter((groupId) => coerceBooleanProperty(groupId))
      )
      .subscribe((groupId) => (this.groupId = groupId));

    this.filters$ = this.store.select(fromStore.getFilters);

    this.pagination$ = this.store.select(fromStore.getPagination);

    this.loading$ = this.store.select(fromStore.getMembersLoading).pipe(takeUntil(this.destroy$));

    // set initial state
    this.routerUtils.appendParamToRoute({
      [commonParams.page]: 1,
      [commonParams.sortField]: 'member_type',
      [commonParams.sortDirection]: commonParams.direction.desc
    });

    this.fetch(true);

    this.showStudentIds =
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.orientation) && this.session.hasSSO;
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
