import {
  tap,
  map,
  take,
  mapTo,
  repeat,
  mergeMap,
  switchMap,
  takeUntil,
  startWith,
  skipUntil,
  catchError,
  debounceTime,
  withLatestFrom
} from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject, merge, combineLatest, of } from 'rxjs';
import { OnInit, Output, Component, EventEmitter, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash';

import * as fromStore from '../../../store';
import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { GroupType } from '../../../feeds.utils.service';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { ISocialGroup } from '@controlpanel/manage/feeds/model';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { FeedsService } from '@controlpanel/manage/feeds/feeds.service';
import { FeedsAmplitudeService } from '../../../feeds.amplitude.service';
import { UserService, CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { now, last7Days, lastYear, last90Days, last30Days } from '@campus-cloud/shared/components';
@Component({
  selector: 'cp-feed-search',
  templateUrl: './feed-search.component.html',
  styleUrls: ['./feed-search.component.scss']
})
export class FeedSearchComponent implements OnInit {
  @Input() groupId: number;
  @Input() groupType: GroupType;
  @Input() filterParams: HttpParams;
  @Input() hideIntegrations: boolean;

  @Output()
  feedSearch: EventEmitter<string> = new EventEmitter();
  @Output()
  downloading: EventEmitter<boolean> = new EventEmitter();
  maxDate = new Date();
  form = this.fb.group({
    query: ['']
  });

  destroy$ = new Subject();
  downloadThread = new Subject();
  generateZipFile$ = this.downloadThread.pipe(
    mergeMap(() => this.feedsService.generateReport(this.filterParams)),
    catchError(() => of(false))
  );

  downloading$ = merge(
    this.downloadThread.asObservable().pipe(mapTo(true)),
    this.generateZipFile$.pipe(mapTo(false))
  ).pipe(
    startWith(false),
    tap((downloading) => this.downloading.emit(downloading))
  );

  isCampusWallView$: Observable<boolean>;

  eventData = {
    type: CP_TRACK_TO.AMPLITUDE,
    eventName: amplitudeEvents.MANAGE_VIEWED_FEED_INTEGRATION,
    eventProperties: { sub_menu_name: amplitudeEvents.WALL }
  };
  query: BehaviorSubject<string> = new BehaviorSubject('');

  input = new Subject();
  input$ = this.input.asObservable().pipe(
    takeUntil(this.destroy$),
    debounceTime(1000),
    tap((value: string) => this.query.next(value)),
    tap((value) => {
      if (value.length >= 3 || value.length === 0) {
        this.feedSearch.emit(value);
      }
    })
  );

  loadMore = new Subject();
  closeMenu = new Subject();
  channelTerm = new Subject();
  studentTerm = new Subject();
  primaryMenuOpened = new Subject();

  dateMenu$: Observable<any>;
  statusMenu$: Observable<any>;
  primaryMenu$: Observable<any>;
  channelsMenu$: Observable<any>;
  studentsMenu$: Observable<any>;

  hasFiltersActive$: Observable<boolean>;
  presetDates: { [key: string]: number[] };
  viewFilters$: BehaviorSubject<any> = new BehaviorSubject({});
  locale = CPI18nService.getLocale().startsWith('fr') ? 'fr' : 'en';

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private userService: UserService,
    private feedsService: FeedsService,
    private cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>,
    private feedsAmplitudeService: FeedsAmplitudeService
  ) {}

  get state$() {
    return this.viewFilters$.value;
  }

  ngOnInit() {
    this.input$.subscribe();
    const viewFilters$ = this.store
      .pipe(select(fromStore.getViewFilters))
      .pipe(tap((filters) => this.viewFilters$.next(filters)));

    this.studentsMenu$ = combineLatest([
      this.fetchStudents(),
      viewFilters$,
      this.studentTerm.asObservable().pipe(startWith(''))
    ]).pipe(
      map(([students, filters, searchTerm]) => {
        const { users } = filters;
        const selectedUserids = users.map((u) => u.id);
        return {
          students,
          selectedUserids,
          selectedUsers: users,
          canSelect: users.length < 5,
          isSearching: searchTerm !== ''
        };
      })
    );
    this.dateMenu$ = this.getDateMenu();

    this.statusMenu$ = combineLatest([viewFilters$]).pipe(
      map(([filters]) => {
        const { flaggedByModerators, flaggedByUser } = filters;
        return {
          flaggedByUser,
          flaggedByModerators
        };
      })
    );

    this.presetDates = {
      lastWeek: [last7Days(this.session.tz, new Date()), now(this.session.tz)],
      last30Days: [last30Days(this.session.tz, new Date()), now(this.session.tz)],
      last90Days: [last90Days(this.session.tz, new Date()), now(this.session.tz)],
      lastYear: [lastYear(this.session.tz, new Date()), now(this.session.tz)]
    };

    const channels$ = this.store.pipe(select(fromStore.getSocialPostCategories));
    const selectedChannel$ = viewFilters$.pipe(
      map(({ postType }) => (postType ? postType.id : null))
    );
    const selectedHostWall$ = viewFilters$.pipe(map(({ group }) => (group ? group.id : null)));
    const integrtedChannels$ = channels$.pipe(
      map((channels) => channels.filter((c) => c.is_integrated))
    );
    const nonIntegrtedChannels$ = channels$.pipe(
      map((channels) => channels.filter((c) => !c.is_integrated))
    );

    this.channelsMenu$ = combineLatest([
      this.fetchSocialGroups(),
      integrtedChannels$,
      nonIntegrtedChannels$,
      selectedChannel$,
      selectedHostWall$,
      this.channelTerm.asObservable().pipe(startWith(''))
    ]).pipe(
      map(
        ([
          socialGroups,
          integratedChannels,
          nonIntegratedChannels,
          selectedChannel,
          selectedHostWall,
          query
        ]) => {
          const searchByName = (item) =>
            item.name.toLowerCase().startsWith((query as string).toLowerCase().trim());
          return {
            selectedChannel,
            selectedHostWall,
            isSearching: query !== '',
            socialGroups: socialGroups.filter(searchByName),
            integratedChannels: integratedChannels.filter(searchByName),
            allCampusWallChannels: !selectedChannel && !selectedHostWall,
            nonIntegratedChannels: nonIntegratedChannels.filter(searchByName)
          };
        }
      )
    );

    const usersSelected$ = viewFilters$.pipe(map(({ users }) => Boolean(users.length)));
    const datesSelected$ = viewFilters$.pipe(
      map(({ start, end }) => Boolean(start) && Boolean(end))
    );

    const channelsSelected$ = viewFilters$.pipe(
      map(({ group, postType }) => (this.groupId ? false : Boolean(group) || Boolean(postType)))
    );
    const statusSelected$ = viewFilters$.pipe(
      map(({ flaggedByUser, flaggedByModerators }) => flaggedByUser || flaggedByModerators)
    );

    this.hasFiltersActive$ = combineLatest([
      usersSelected$,
      datesSelected$,
      channelsSelected$,
      statusSelected$
    ]).pipe(
      map(
        ([usersSelected, datesSelected, channelsSelected, statusSelected]) =>
          usersSelected || datesSelected || channelsSelected || statusSelected
      )
    );

    this.primaryMenu$ = combineLatest([
      usersSelected$,
      channelsSelected$,
      statusSelected$,
      datesSelected$,
      this.hasFiltersActive$
    ]).pipe(
      map(([usersSelected, channelsSelected, statusSelected, datesSelected, hasFiltersActive]) => {
        return {
          usersSelected,
          channelsSelected,
          statusSelected,
          datesSelected,
          hasFiltersActive
        };
      })
    );

    const userSearch$ = this.feedSearch;
    const primaryMenuClosed$ = this.closeMenu.asObservable();
    const primaryMenuOpened$ = this.primaryMenuOpened.asObservable();
    const filterChanges$ = this.store.pipe(select(fromStore.getViewFilters));

    const menuOpensFiltersChangeAndMenuCloses$ = filterChanges$.pipe(
      skipUntil(primaryMenuOpened$),
      switchMap(() => primaryMenuClosed$),
      take(1),
      repeat()
    );

    const amplitude$ = merge(
      menuOpensFiltersChangeAndMenuCloses$.pipe(mapTo(false)),
      userSearch$.pipe(mapTo(true))
    ).pipe(
      takeUntil(this.destroy$),
      withLatestFrom(this.dateMenu$)
    );

    amplitude$.subscribe(([isSearch, { presetDateSelected }]) => {
      this.feedsAmplitudeService.setFilterLabel(presetDateSelected, this.state$);
      this.wallSearchFilterAmplitude(isSearch);
    });

    this.isCampusWallView$ = viewFilters$.pipe(map(({ group }) => group === null));
  }

  getDateMenu(): Observable<any> {
    const viewFilters$ = this.store.pipe(select(fromStore.getViewFilters));

    const defaultDate$ = viewFilters$.pipe(
      map(({ start, end }) => {
        if (start && end) {
          return [start, end];
        }

        return undefined;
      })
    );

    const presetDateSelected$ = defaultDate$.pipe(
      map((selectedData) => {
        if (!selectedData) {
          return '';
        }

        return Object.keys(this.presetDates).find((key) =>
          isEqual(this.presetDates[key], selectedData)
        );
      })
    );

    return combineLatest([defaultDate$, presetDateSelected$]).pipe(
      map(([defaultDate, presetDateSelected]) => {
        return {
          presetDateSelected,
          defaultDate: defaultDate ? defaultDate.map((d) => new Date(d * 1000)) : undefined
        };
      })
    );
  }

  fetchSocialGroups() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());
    return this.feedsService.getSocialGroups(search) as Observable<ISocialGroup[]>;
  }

  fetchStudents(): Observable<any[]> {
    let cutOff = 15;
    const increaseBy = 15;
    let params = new HttpParams()
      .set('sort_direction', 'asc')
      .set('sort_field', 'username')
      .set('school_id', this.session.school.id.toString())
      .set('is_sandbox', String(this.session.school.is_sandbox))
      .set('client_id', this.session.school.client_id.toString());

    const initialResults$ = this.userService.getAll(params, 1, 15) as Observable<any[]>;

    const loadMore$ = this.loadMore
      .asObservable()
      .pipe(tap((currentLength: number) => (cutOff = currentLength + increaseBy)));

    const userSearch$ = this.studentTerm.asObservable().pipe(
      debounceTime(400),
      tap((term: string) => (params = params.set('search_str', Boolean(term) ? term : null)))
    );

    const reload$ = merge(loadMore$, userSearch$).pipe(
      switchMap(() => this.userService.getAll(params, 1, cutOff) as Observable<any[]>)
    );

    return merge(reload$, initialResults$);
  }

  emitValue() {
    this.feedSearch.emit(this.query.value);
  }

  handleChannel(channel) {
    const { postType } = this.state$;
    this.store.dispatch(fromStore.setGroup({ group: null }));

    if (channel === -1 || (postType && postType.id === channel.id)) {
      channel = null;
    }

    this.store.dispatch(fromStore.setPostType({ postType: channel }));
  }

  handleGroup(selectedGroup) {
    const { group } = this.state$;
    if (group && group.id === selectedGroup.id) {
      selectedGroup = null;
    }
    this.store.dispatch(fromStore.setGroup({ group: selectedGroup }));
    this.store.dispatch(fromStore.setPostType({ postType: null }));
  }

  handleStatus(status: string) {
    const { flaggedByModerators, flaggedByUser } = this.state$;
    if (status === 'archived') {
      this.store.dispatch(fromStore.setFlaggedByUser({ flagged: false }));
      this.store.dispatch(fromStore.setFlaggedByModerator({ flagged: !flaggedByModerators }));
    } else {
      this.store.dispatch(fromStore.setFlaggedByUser({ flagged: !flaggedByUser }));
      this.store.dispatch(fromStore.setFlaggedByModerator({ flagged: false }));
    }
  }

  handleStudent(user: any) {
    this.store.dispatch(fromStore.setFilterUsers({ user }));
  }

  handleClearFilters() {
    this.clearGroup();
    this.store.dispatch(fromStore.clearFilterUsers());
    this.store.dispatch(fromStore.setEndFilter({ end: null }));
    this.store.dispatch(fromStore.setStartFilter({ start: null }));
    this.store.dispatch(fromStore.setPostType({ postType: null }));
    this.store.dispatch(fromStore.setFlaggedByUser({ flagged: false }));
    this.store.dispatch(fromStore.setFlaggedByModerator({ flagged: false }));
  }

  clearGroup() {
    if (!this.groupId) {
      this.store.dispatch(fromStore.setGroup({ group: null }));
    }
  }

  handleDate(date: number[]) {
    const [startDate, endDate] = date;
    const { start, end } = this.state$;

    if (endDate === end && startDate === start) {
      this.store.dispatch(fromStore.setEndFilter({ end: null }));
      this.store.dispatch(fromStore.setStartFilter({ start: null }));
    } else {
      this.store.dispatch(fromStore.setEndFilter({ end: endDate }));
      this.store.dispatch(fromStore.setStartFilter({ start: startDate }));
    }
  }

  parseCalendarDate(date: Date[]) {
    this.handleDate(date.map((d) => CPDate.toEpoch(d, this.session.tz)));
  }

  handleClearSelectedStudents() {
    this.store.dispatch(fromStore.clearFilterUsers());
  }

  wallSearchFilterAmplitude(isSearch) {
    const eventName = !isSearch
      ? amplitudeEvents.WALL_APPLIED_FILTERS
      : amplitudeEvents.WALL_SEARCHED_INFORMATION;

    this.cpTracking.amplitudeEmitEvent(
      eventName,
      this.feedsAmplitudeService.getWallFiltersAmplitude()
    );
  }
}
