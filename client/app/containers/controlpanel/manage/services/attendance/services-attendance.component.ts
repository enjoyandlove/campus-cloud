/*tslint:disable:max-line-length */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { CPSession } from './../../../../../session';
import { ServicesService } from '../services.service';
import { CP_PRIVILEGES_MAP } from './../../../../../shared/constants';
import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from './../../../../../shared/utils/privileges';
import { ServicesProvidersListComponent } from './components/providers-list/providers-list.component';
import { BaseComponent } from '../../../../../base/base.component';
import { STAR_SIZE } from '../../../../../shared/components/cp-stars';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { CPTrackingService, CPI18nService } from '../../../../../shared/services';

const FEEDBACK_ENABLED = 1;

@Component({
  selector: 'cp-services-attendance',
  templateUrl: './services-attendance.component.html',
  styleUrls: ['./services-attendance.component.scss']
})
export class ServicesAttendanceComponent extends BaseComponent implements OnInit {
  @ViewChild('providersList') providersList: ServicesProvidersListComponent;

  loading;
  service;
  storeId;
  eventData;
  noProviders;
  isProviderAdd;
  serviceId: number;
  detailStarSize = STAR_SIZE.LARGE;
  listStarSize = STAR_SIZE.DEFAULT;
  download$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  enableFeedback$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private cpTracking: CPTrackingService,
    private serviceService: ServicesService
  ) {
    super();
    this.serviceId = this.route.snapshot.params['serviceId'];
    super.isLoading().subscribe((res) => (this.loading = res));

    this.fetch();
  }

  private fetch() {
    super.fetchData(this.serviceService.getServiceById(this.serviceId)).then((res) => {
      this.service = res.data;
      this.storeId = this.service.store_id;

      if ('enable_feedback' in this.service) {
        this.enableFeedback$.next(this.service.enable_feedback === FEEDBACK_ENABLED);
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
    });
  }

  setDefaultFeedback() {
    this.service = Object.assign({}, this.service, { enable_feedback: 0 });
  }

  redirectOnDisabledAttendance() {
    this.router.navigate(['/manage/services/' + this.serviceId + '/info']);
  }

  onProviderAdded() {
    this.providersList.fetch();
    this.isProviderAdd = false;
  }

  onLaunchProviderAdd() {
    this.isProviderAdd = true;

    setTimeout(
      () => {
        $('#createProvider').modal();
      },

      1
    );
  }

  onSearch(search_text) {
    this.providersList.state = {
      ...this.providersList.state,
      search_text
    };

    this.providersList.fetch();
  }

  private buildHeader() {
    let children = [
      {
        label: 'info',
        url: `/manage/services/${this.serviceId}/info`
      }
    ];

    const eventsSchoolLevel = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events);
    const eventsAccountLevel = canStoreReadAndWriteResource(
      this.session.g,
      this.storeId,
      CP_PRIVILEGES_MAP.events
    );

    if (eventsSchoolLevel || eventsAccountLevel) {
      const events = {
        label: 'events',
        url: `/manage/services/${this.serviceId}/events`
      };

      children = [...children, events];
    }

    if (this.service.service_attendance) {
      const attendance = {
        label: 'assessment',
        url: `/manage/services/${this.serviceId}`
      };

      children = [...children, attendance];
    }

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${this.service.name}[NOTRANSLATE]`,
        subheading: '',
        crumbs: {
          url: 'services',
          label: 'services'
        },
        children: [...children]
      }
    });
  }

  onProvidersResult(data) {
    this.noProviders = !data;
  }

  ngOnInit() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.ASSESSMENT
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CHANGE_BUTTON,
      eventProperties
    };
  }
}
