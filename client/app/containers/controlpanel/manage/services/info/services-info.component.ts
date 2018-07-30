/*tslint:disable:max-line-length */
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from './../../../../../shared/utils/privileges';
import { ServicesService } from '../services.service';
import { CPSession, ISchool } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { AdminService, CPTrackingService, RouteLevel } from '../../../../../shared/services';
import { IResourceBanner } from '../../../../../shared/components/cp-resource-banner/cp-resource.interface';

@Component({
  selector: 'cp-services-info',
  templateUrl: './services-info.component.html',
  styleUrls: ['./services-info.component.scss']
})
export class ServicesInfoComponent extends BaseComponent implements OnInit {
  @Input() resourceBanner: IResourceBanner;

  admins;
  service;
  storeId;
  loading = true;
  school: ISchool;
  serviceId: number;
  draggable = false;
  hasMetaData = false;
  showLocationDetails = true;
  mapCenter: BehaviorSubject<any>;

  constructor(
    private session: CPSession,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private cpTracking: CPTrackingService,
    private serviceService: ServicesService
  ) {
    super();
    this.school = this.session.g.get('school');
    super.isLoading().subscribe((res) => (this.loading = res));
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
  }

  private fetch() {
    const search: HttpParams = new HttpParams()
      .append('school_id', this.school.id.toString())
      .append('store_id', this.serviceId.toString())
      .append('privilege_type', CP_PRIVILEGES_MAP.services.toString());

    const service$ = this.serviceService.getServiceById(this.serviceId);

    const admins$ = this.adminService.getAdminByStoreId(search).pipe(
      map((admins: Array<any>) => {
        const _admins = [];
        admins.forEach((admin) => {
          if (!admin.is_school_level) {
            _admins.push(admin);
          }
        });

        return _admins;
      })
    );

    const stream$ = combineLatest(service$, admins$);
    super.fetchData(stream$).then((res) => {
      this.admins = res.data[1];
      this.service = res.data[0];
      this.storeId = this.service.store_id;
      this.showLocationDetails = res.data[0].latitude !== 0 && res.data[0].longitude !== 0;

      this.buildHeader();

      this.mapCenter = new BehaviorSubject({
        lat: res.data[0].latitude,
        lng: res.data[0].longitude
      });

      this.resourceBanner = {
        image: this.service.logo_url,
        heading: this.service.name
      };

      this.hasMetaData =
        !!this.service.contactphone ||
        !!this.service.email ||
        !!this.service.website ||
        !!this.service.address;
    });
  }

  private buildHeader() {
    let children = [
      {
        label: 'info',
        isSubMenuItem: true,
        amplitude: amplitudeEvents.INFO,
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
        isSubMenuItem: true,
        amplitude: amplitudeEvents.EVENTS,
        url: `/manage/services/${this.serviceId}/events`
      };

      children = [...children, events];
    }

    if (this.service.service_attendance) {
      const attendance = {
        label: 'assessment',
        isSubMenuItem: true,
        amplitude: amplitudeEvents.ASSESSMENT,
        url: `/manage/services/${this.serviceId}`
      };

      children = [...children, attendance];
    }

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${this.service.name}[NOTRANSLATE]`,
        crumbs: {
          url: 'services',
          label: 'services'
        },
        subheading: '',
        children: [...children]
      }
    });
  }

  trackChangeEvent() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth)
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CHANGE_BUTTON,
      eventProperties
    };
  }

  ngOnInit() {}
}
