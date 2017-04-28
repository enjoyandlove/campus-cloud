import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { ServicesService } from '../services.service';
import { BaseComponent } from '../../../../../base/base.component';
import { STAR_SIZE } from '../../../../../shared/components/cp-stars';


@Component({
  selector: 'cp-services-attendance',
  templateUrl: './services-attendance.component.html',
  styleUrls: ['./services-attendance.component.scss']
})
export class ServicesAttendanceComponent extends BaseComponent implements OnInit {
  loading;
  service;
  serviceId: number;
  detailStarSize = STAR_SIZE.LARGE;
  listStarSize = STAR_SIZE.DEFAULT;
  reload$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  download$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  search_text$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    private serviceService: ServicesService
  ) {
    super();
    this.serviceId = this.route.snapshot.params['serviceId'];
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  onCreatedProvider(provider) {
    console.log(provider);
  }

  private fetch() {
    super
      .fetchData(this.serviceService.getServiceById(this.serviceId))
      .then(res => {
        this.service = res.data;
        this.buildHeader(this.service);
      })
      .catch(err => console.error(err));
  }

  onSearch(search_text) {
    this.search_text$.next(search_text);
  }

  private buildHeader(res) {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': res.name,
        'subheading': '',
        'children': [
          {
            'label': 'Attendance',
            'url': `/manage/services/${this.serviceId}`
          },
          {
            'label': 'Events',
            'url': `/manage/services/${this.serviceId}/events`
          },
          {
            'label': 'Info',
            'url': `/manage/services/${this.serviceId}/info`
          }
        ]
      }
    });
  }

  ngOnInit() { }
}

