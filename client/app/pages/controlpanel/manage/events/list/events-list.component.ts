import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { BaseComponent } from '../../../../../base/base.component';
import { BUTTON_ALIGN } from '../../../../../shared/components/cp-button-dropdown';

@Component({
  selector: 'cp-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent extends BaseComponent implements OnInit {
  events;
  query;
  buttonDropdown;
  loading = true;
  deleteEvent = '';
  dateFormat = FORMAT.LONG;
  BUTTON_ALIGN = BUTTON_ALIGN.RIGHT;

  constructor(
    private store: Store<IHeader>,
    private service: EventsService
  ) {
    super();
    this.fetch();
    this.buttonDropdown = require('./button-dropdown.json');
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(this.service.getEvents())
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

  ngOnInit() { }
}
