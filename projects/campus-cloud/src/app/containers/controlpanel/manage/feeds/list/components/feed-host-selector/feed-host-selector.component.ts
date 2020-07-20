import {
  map,
  startWith,
  catchError,
  switchMap,
  debounceTime,
  share,
  distinctUntilChanged,
  merge
} from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../store';
import { ISocialGroup } from './../../../model';
import { CPSession } from '@campus-cloud/session';
import { appStorage } from '@campus-cloud/shared/utils';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { ReadyStore, StoreService, StoreCategory } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-feed-host-selector',
  templateUrl: './feed-host-selector.component.html',
  styleUrls: ['./feed-host-selector.component.scss']
})
export class FeedHostSelectorComponent implements OnInit {
  defaultImage = `${environment.root}assets/default/user.png`;
  _host: BehaviorSubject<ReadyStore> = new BehaviorSubject(null);
  _socialGroup: BehaviorSubject<ISocialGroup> = new BehaviorSubject(null);
  storeCategory = StoreCategory;

  searchTerm: string;
  searchTermStream = new Subject<string>();
  pageStream = new Subject<number>();
  hasMorePages = false;

  pageCounter = 1;
  paginationCountPerPage = 20;
  results: ReadyStore[] = [];

  @Input()
  set socialGroup(socialGroup: ISocialGroup) {
    this._socialGroup.next(socialGroup);
  }

  @Input()
  set host(host: ReadyStore) {
    this._host.next(host);
  }

  view$: Observable<{
    canOpenMenu: boolean;
    host: ReadyStore | ISocialGroup;
  }>;

  constructor(
    public stores: StoreService,
    private session: CPSession,
    private store: Store<fromStore.IWallsState>
  ) {}

  ngOnInit(): void {
    const selectedHost$ = this._host.asObservable();
    const socialGroup$ = this._socialGroup.asObservable();

    this.view$ = combineLatest([selectedHost$, socialGroup$]).pipe(
      map(([host, socialGroup]) => {
        return {
          canOpenMenu: !socialGroup,
          host: socialGroup ? this.socialGroupToReadyStore(socialGroup) : host
        };
      })
    );

    const searchSource = this.searchTermStream.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((searchTerm) => {
        this.searchTerm = searchTerm;
        this.pageCounter = 1;
        return { searchTerm: searchTerm, page: this.pageCounter };
      })
    );

    const pageSource = this.pageStream.pipe(
      map((pageNumber) => {
        this.pageCounter = pageNumber;
        return { searchTerm: this.searchTerm, page: pageNumber };
      })
    );

    const combinedSource: Observable<any[]> = pageSource.pipe(
      merge(searchSource),
      startWith({ searchTerm: this.searchTerm, page: this.pageCounter }),
      switchMap((args: { searchTerm: string; page: number }) => {
        return this.fetch(args.page, this.paginationCountPerPage);
      }),
      share()
    );

    combinedSource.subscribe((data) => this.handleDataLoad(data));
  }

  fetch(pageNumber: number, paginationCountPerPage: number): Observable<ReadyStore[]> {
    let startRecordCount = paginationCountPerPage * (pageNumber - 1) + 1;
    // Get an extra record so that we know if there are more records left to fetch
    let endRecordCount = paginationCountPerPage * pageNumber + 1;
    const hostCategories = [StoreCategory.services, StoreCategory.clubs, StoreCategory.athletics];
    const params = new HttpParams()
      .set('search_str', this.searchTerm === '' ? null : this.searchTerm)
      .set('school_id', this.session.school.id.toString())
      .set('category_ids', hostCategories.map((c) => c.toString()).join(','));
    return this.stores.getRanged(startRecordCount, endRecordCount, params).pipe(
      map((stores: ReadyStore[]) => {
        if (stores && stores.length > this.paginationCountPerPage) {
          this.hasMorePages = true;
          // Remove the extra record that we fetched to check if we have more records to fetch.
          stores = stores.splice(0, this.paginationCountPerPage);
        } else {
          this.hasMorePages = false;
        }
        const requiredCategories = ({ category_id }: ReadyStore) =>
          hostCategories.includes(category_id);

        return stores.filter(requiredCategories);
      }),
      catchError(() => {
        this.hasMorePages = false;
        return of([]);
      })
    );
  }

  private handleDataLoad(data: ReadyStore[]) {
    if (this.pageCounter === 1) {
      this.results = data;
    } else {
      this.results = this.results.concat(data);
    }
  }

  sectionSorting(obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
    // default `keyvalue` sorting, by section name ascending
    return obj1.key > obj2.key;
  }

  hostClickHandler(host: ReadyStore) {
    this.store.dispatch(fromStore.setHost({ host }));
    appStorage.set(appStorage.keys.WALLS_DEFAULT_HOST, JSON.stringify(host));
  }

  searchTermChangeHandler(searchTerm: string): void {
    this.searchTermStream.next(searchTerm);
  }

  loadMoreClickHandler(): void {
    this.pageCounter++;
    this.pageStream.next(this.pageCounter);
  }

  private socialGroupToReadyStore(socialGroup: ISocialGroup) {
    const { name, image_url } = socialGroup;
    return {
      name,
      logo_url: image_url
    } as ReadyStore;
  }
}
