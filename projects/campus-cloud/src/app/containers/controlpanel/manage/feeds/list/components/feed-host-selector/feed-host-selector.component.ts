import { map, startWith, catchError, switchMap, debounceTime, share } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { groupBy, mapKeys } from 'lodash';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../store';
import { CPSession } from '@campus-cloud/session';
import { appStorage } from '@campus-cloud/shared/utils';
import { ReadyStore, StoreService, StoreCategory } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-feed-host-selector',
  templateUrl: './feed-host-selector.component.html',
  styleUrls: ['./feed-host-selector.component.scss']
})
export class FeedHostSelectorComponent implements OnInit {
  _host: BehaviorSubject<ReadyStore> = new BehaviorSubject(undefined);

  @Input()
  set host(host: ReadyStore) {
    this._host.next(host);
  }

  search = new Subject<string>();
  search$ = this.search.asObservable().pipe(startWith(''));

  view$: Observable<{
    search: string;
    host: ReadyStore;
    sections: { [key: string]: ReadyStore[] };
  }>;

  constructor(
    public stores: StoreService,
    private session: CPSession,
    private store: Store<fromStore.IWallsState>
  ) {}

  ngOnInit(): void {
    const request$ = this.fetch().pipe(share());
    const stores$ = request$.pipe(startWith({}));
    const selectedHost$ = this._host.asObservable();

    this.view$ = combineLatest([stores$, this.search$, selectedHost$]).pipe(
      map(([sections, search, host]) => ({ sections, search, host }))
    );
  }

  hostClickHandler(host: ReadyStore) {
    this.store.dispatch(fromStore.setHost({ host }));
    appStorage.set(appStorage.keys.WALLS_DEFAULT_HOST, JSON.stringify(host));
  }

  fetch(): Observable<{ [key: string]: ReadyStore[] }> {
    return this.search$.pipe(
      debounceTime(500),
      switchMap((search) => {
        const hostCategories = [
          StoreCategory.clubs,
          StoreCategory.services,
          StoreCategory.athletics
        ];
        const params = new HttpParams()
          .set('search_str', search === '' ? null : search)
          .set('school_id', this.session.school.id.toString())
          .set('category_ids', hostCategories.map((c) => c.toString()).join(','));
        return this.stores.getRanged(1, 5000, params).pipe(
          map((stores: ReadyStore[]) => {
            const requiredCategories = ({ category_id }: ReadyStore) =>
              hostCategories.includes(category_id);

            const groupedStores = mapKeys(
              groupBy(stores.filter(requiredCategories), 'category_id'),
              (_, key) => StoreCategory[key]
            );

            return groupedStores;
          }),
          catchError(() => of({}))
        );
      })
    );
  }
}
