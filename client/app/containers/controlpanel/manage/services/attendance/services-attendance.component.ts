import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';

import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from './../../../../../shared/utils/privileges';

import { ServicesService } from '../services.service';
import { CPSession } from './../../../../../session/index';
import { BaseComponent } from '../../../../../base/base.component';
import { STAR_SIZE } from '../../../../../shared/components/cp-stars';
import { CP_PRIVILEGES_MAP } from './../../../../../shared/constants';

const FEEDBACK_ENABLED = 1;

@Component({
  selector: 'cp-services-attendance',
  templateUrl: './services-attendance.component.html',
  styleUrls: ['./services-attendance.component.scss']
})
export class ServicesAttendanceComponent extends BaseComponent implements OnInit {
  loading;
  service;
  storeId;
  noProviders;
  serviceId: number;
  isProviderAdd;
  detailStarSize = STAR_SIZE.LARGE;
  listStarSize = STAR_SIZE.DEFAULT;
  reload$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  download$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  search_text$: BehaviorSubject<string> = new BehaviorSubject(null);
  enableFeedback$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private session: CPSession,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private serviceService: ServicesService
  ) {
    super();
    this.serviceId = this.route.snapshot.params['serviceId'];
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.serviceService.getServiceById(this.serviceId))
      .then(res => {
        this.service = res.data;
        this.storeId = this.service.store_id;

        if ('enable_feedback' in this.service) {
          this.enableFeedback$.next(this.service.enable_feedback === FEEDBACK_ENABLED)
        } else {
          this.enableFeedback$.next(true);
        }

        if (!('enable_feedback' in this.service)) {
          this.setDefaultFeedback();
        }

        if (!this.service.service_attendance) {
          this.redirectOnDisabledAttendance();
          return;
        }
        this.buildHeader();
      })
      .catch(err => { throw new Error(err) });
  }

  setDefaultFeedback() {
    this.service = Object.assign({}, this.service, { 'enable_feedback': 0 } );
  }

  redirectOnDisabledAttendance() {
    this.router.navigate(['/manage/services/' + this.serviceId + '/info']);
  }

  onProviderAdded() {
    this.reload$.next(true);
    this.isProviderAdd = false;
  }

  onLaunchProviderAdd() {
    this.isProviderAdd = true;
  }

  onSearch(search_text) {
    this.search_text$.next(search_text);
  }

  private buildHeader() {
    let children = [
      {
        'label': 'Info',
        'url': `/manage/services/${this.serviceId}/info`
      }
    ];
    const eventsSchoolLevel = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events);
    const eventsAccountLevel = canStoreReadAndWriteResource(this.session.g,
      this.storeId, CP_PRIVILEGES_MAP.events);

    if (eventsSchoolLevel || eventsAccountLevel) {
      const events = {
        'label': 'Events',
        'url': `/manage/services/${this.serviceId}/events`
      }

      children = [...children, events];
    }

    if (this.service.service_attendance) {
      let attendance = {
        'label': 'Assessment',
        'url': `/manage/services/${this.serviceId}`
      };

      children = [...children, attendance];
    }

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': this.service.name,
        'subheading': '',
        'crumbs': {
          'url': 'services',
          'label': 'Services'
        },
        'children': [...children]
      }
    });
  }

  onProvidersResult(data) {
    this.noProviders = !data;
  }

  ngOnInit() { }
}

