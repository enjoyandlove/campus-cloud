import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes';
import { StoreService } from '../../../../../shared/services';
import { BUTTON_DROPDOWN, DATE_FILTER } from './events-filters';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { BUTTON_ALIGN, BUTTON_THEME } from '../../../../../shared/components/cp-button-dropdown';

declare var $: any;

@Component({
  selector: 'cp-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent extends BaseComponent implements OnInit, OnDestroy {
  events;
  query;
  hosts = [];
  eventFilter;
  dateFilterOpts;
  buttonDropdown;
  loading = true;
  deleteEvent = '';
  buttonDropdownOptions;
  dateFormat = FORMAT.LONG;

  constructor(
    private router: Router,
    private store: Store<IHeader>,
    private service: EventsService,
    private storeService: StoreService
  ) {
    super();
    this.buildActionComponent();
    this.buttonDropdown = BUTTON_DROPDOWN;
    this.eventFilter = DATE_FILTER;
    this.dateFilterOpts = {
      utc: true,
      inline: true,
      mode: 'range',
      minDate: new Date,
      maxDate: null
    };
  }

  onFilterByEvent(action) {
    switch (action) {
      case 'past':
        this.dateFilterOpts = Object.assign({},
          this.dateFilterOpts, {
            maxDate: new Date(),
            minDate: null
          });
        break;
      case 'upcoming':
        this.dateFilterOpts = Object.assign({},
          this.dateFilterOpts, {
            minDate: new Date(),
            maxDate: null
          });
    }
  }

  onFilterByHost(host) {
    if (host) {
      this.fetch(this.service.getEventsByHostId(host));
      return;
    }
    this.fetch(this.service.getEvents());
  }

  buildActionComponent() {
    const stores$ = this.storeService.getStores().map(res => {
      const stores = [
        {
          'label': 'All Host',
          'action': null
        }
      ];
      res.forEach(store => {
        stores.push({
          'label': store.name,
          'action': store.id
        });
      });
      return stores;
    });

    super
      .fetchData(stores$)
      .then(res => {
        this.hosts = res;
        this.fetch(this.service.getEvents());
      })
      .catch(err => console.error(err));
  }

  onButtonDropdown(event) {
    switch (event) {
      case 'facebook':
        this.router.navigate(['/manage/events/import/facebook']);
        break;
      case 'excel':
        // TODO Avoid this...
        $('#excelModal').modal();
        break;
    }
  }

  private fetch(stream$) {
    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(stream$)
      .then(res => {
        this.events = res;
        this.buildHeader();
      })
      .catch(err => console.error(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../../manage.header.json')
    });
  }

  shouldBeFilled(rating: number, index: number) {
    return rating > index ? true : false;
  }

  buildStars(event) {
    const stars = [];
    const MAX_RATING = event.rating_scale_maximum;
    const AVG_RATING = event.avg_rating_percent;
    const rating = AVG_RATING / MAX_RATING;

    for (let i = 0; i < MAX_RATING; i++) {
      stars.push({
        'filled': this.shouldBeFilled(rating, i)
      });
    }
    return stars;
  }

  ngOnDestroy() {
    // console.log('destroy');

  }

  ngOnInit() {
    this.buttonDropdownOptions = {
      align: BUTTON_ALIGN.RIGHT,
      theme: BUTTON_THEME.PRIMARY
    };
  }
}
