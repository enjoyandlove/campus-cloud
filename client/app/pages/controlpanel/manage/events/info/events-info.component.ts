import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes/date.pipe';
import { BaseComponent } from '../../../../../base/base.component';

@Component({
  selector: 'cp-events-info',
  templateUrl: './events-info.component.html',
  styleUrls: ['./events-info.component.scss']
})
export class EventsInfoComponent extends BaseComponent implements OnInit {
  event;
  dateFormat;
  mapCenter;
  loading = true;
  eventId: number;

  constructor(
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private service: EventsService
  ) {
    super();
    this.dateFormat = FORMAT.DATETIME;
    this.eventId = this.route.snapshot.params['eventId'];

    this.fetch();
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(this.service.getEventById(this.eventId))
      .then(res => {
        this.event = res;
        this.buildHeader(res);
        console.log(res);
        this.mapCenter = { lat: res.latitude, lng: res.longitude };
      })
      .catch(err => console.error(err));
  }

  private buildHeader(res) {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': res.title,
        'subheading': '',
        'children': [
          {
            'label': 'Attendance',
            'url': `/manage/events/${this.eventId}`
          },
          {
            'label': 'Info',
            'url': `/manage/events/${this.eventId}/info`
          }
        ]
      }
    });
  }

  ngOnInit() { }
}
