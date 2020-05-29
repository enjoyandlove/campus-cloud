import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { tap, take, filter, switchMap, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Store, select } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { appStorage } from '@campus-cloud/shared/utils';
import * as fromStore from '@controlpanel/manage/feeds/store';
import { LayoutWidth } from '@campus-cloud/layouts/interfaces';
import { baseActionClass, baseActions } from '@campus-cloud/store/base';
import { FeedsService } from '@controlpanel/manage/feeds/feeds.service';
import { CPI18nService, StoreService, ReadyStore } from '@campus-cloud/shared/services';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';
import { ICampusThread, ISocialGroup, ISocialGroupThread } from '@controlpanel/manage/feeds/model';

@Component({
  selector: 'cp-feeds-info',
  templateUrl: './feeds-info.component.html',
  styleUrls: ['./feeds-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedsInfoComponent extends BaseComponent implements OnInit, OnDestroy {
  error: boolean;
  feedId: number;
  groupId: number;
  loading$: Observable<boolean>;
  layoutWidth = LayoutWidth.third;
  feed$: Observable<ICampusThread | ISocialGroupThread>;
  selectedHost$: Observable<ReadyStore> = this.store.pipe(select(fromStore.getHost));
  isCampusWallView$: BehaviorSubject<any> = new BehaviorSubject({
    type: 1,
    group_id: null
  });

  view$: Observable<{
    loading: boolean;
    host: ReadyStore;
  }>;

  constructor(
    public router: Router,
    private session: CPSession,
    private route: ActivatedRoute,
    private cpI18n: CPI18nService,
    public feedService: FeedsService,
    private storeService: StoreService,
    private store: Store<fromStore.IWallsState>,
    private feedAmplitude: FeedsAmplitudeService
  ) {
    super();
    this.loading$ = super.isLoading();
  }

  fetch() {
    let params = new HttpParams();
    params =
      this.groupId && this.groupId > 0
        ? params.set('group_id', this.groupId.toString())
        : params.set('school_id', this.session.school.id.toString());

    const stream$ = this.groupId
      ? this.feedService.getGroupThreadById(this.feedId, params)
      : this.feedService.getCampusThreadById(this.feedId, params);

    super.fetchData(stream$).then(
      (res) => this.store.dispatch(fromStore.addThread({ thread: res.data })),
      (err) => {
        this.loading$ = of(false);

        if (err.status === 404) {
          this.handleError();
          this.router.navigate(['/manage/feeds']);
        }

        this.error = true;
      }
    );

    this.feed$ = this.store.select(fromStore.getThreads).pipe(map((feed) => feed[0]));
  }

  handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('t_community_post_not_exist')
      })
    );
  }

  loadCategories() {
    const _search = new HttpParams().append(
      'school_id',
      this.session.g.get('school').id.toString()
    );

    this.store
      .select(fromStore.getSocialPostCategories)
      .pipe(
        take(1),
        filter((channels) => !!channels),
        switchMap(() => {
          return this.feedService
            .getChannelsBySchoolId(1, 1000, _search)
            .pipe(
              tap((results: any) =>
                this.store.dispatch(fromStore.setSocialPostCategories({ categories: results }))
              )
            );
        })
      )
      .subscribe();
  }

  loadStores() {
    const params = new HttpParams().set('school_id', this.session.school.id.toString());

    this.store
      .select(fromStore.getSocialGroupIds)
      .pipe(
        take(1),
        filter((socialGroupIds) => !!socialGroupIds),
        switchMap(() => {
          return this.storeService.getStores(params).pipe(
            map((stores) => stores.filter((s) => s.value).map((s) => s.value)),
            tap((stores) => this.store.dispatch(fromStore.setSocialGroupIds({ groupIds: stores })))
          );
        })
      )
      .subscribe();
  }

  loadGroups() {
    if (this.groupId) {
      const search = new HttpParams().set('school_id', this.session.g.get('school').id.toString());
      this.feedService
        .getSocialGroupById(this.groupId, search)
        .pipe(
          take(1),
          tap((group: ISocialGroup) => this.store.dispatch(fromStore.setGroup({ group })))
        )
        .subscribe();
    }
  }

  buildHeader() {
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload: {
          heading: `t_community_post_details`,
          subheading: null,
          em: null,
          crumbs: {
            url: `/manage/feeds`,
            label: `feeds`
          },
          children: []
        }
      });
    });
  }

  ngOnInit() {
    const storedHost = appStorage.get(appStorage.keys.WALLS_DEFAULT_HOST);

    if (storedHost) {
      Promise.resolve().then(() => {
        this.store.dispatch(fromStore.setHost({ host: JSON.parse(storedHost) }));
      });
    }

    this.feedId = this.route.snapshot.params['feedId'];
    this.groupId = this.route.snapshot.queryParams['groupId'];
    const schoolId = this.route.snapshot.queryParams['school'];

    if (schoolId) {
      this.feedAmplitude.trackViewedPostDetail('Daily Summary Email');
    }

    this.isCampusWallView$.next({
      type: this.groupId ? this.groupId : 1,
      group_id: this.groupId
    });

    this.fetch();
    this.loadGroups();
    this.loadStores();
    this.buildHeader();
    this.loadCategories();

    this.view$ = combineLatest([this.loading$, this.selectedHost$]).pipe(
      map(([loading, host]) => ({
        host,
        loading
      }))
    );
  }

  ngOnDestroy() {
    this.store.dispatch(fromStore.resetState());
  }
}
