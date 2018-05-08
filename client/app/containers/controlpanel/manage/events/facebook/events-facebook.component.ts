import { EventUtilService } from './../events.utils.service';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { StoreService } from '../../../../../shared/services/store.service';

import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-events-facebook',
  templateUrl: './events-facebook.component.html',
  styleUrls: ['./events-facebook.component.scss']
})
export class EventsFacebookComponent extends BaseComponent implements OnInit {
  @Input() storeId: number;
  @Input() serviceId: number;
  @Input() isAthletic: number;
  @Input() clubId: number;

  stores;
  loading;
  reload$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private session: CPSession,
    private store: Store<IHeader>,
    private utils: EventUtilService,
    private storeService: StoreService
  ) {
    super();

    super.isLoading().subscribe((res) => (this.loading = res));
  }

  onCreated() {
    this.reload$.next(true);
  }

  private fetch() {
    const school = this.session.g.get('school');
    const search: HttpParams = new HttpParams();
    search.append('school_id', school.id.toString());

    const stores$ = this.storeService.getStores(search);

    super.fetchData(stores$).then((res) => (this.stores = res.data));
  }

  private buildHeader() {
    const backToEvents = this.utils.buildUrlPrefix(this.clubId, this.serviceId, this.isAthletic);

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: 'events_facebook_heading',
        crumbs: {
          url: backToEvents,
          label: 'events'
        },
        subheading: '',
        children: []
      }
    });
  }

  ngOnInit() {
    this.buildHeader();

    const isClubService = this.storeId || this.clubId;

    return isClubService ? (this.loading = false) : this.fetch();
  }
}
