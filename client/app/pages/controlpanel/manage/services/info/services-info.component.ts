import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { CPSession, ISchool } from '../../../../../session';
import { ServicesService } from '../services.service';
import { AdminService } from '../../../../../shared/services';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/utils';
import { BaseComponent } from '../../../../../base/base.component';

@Component({
  selector: 'cp-services-info',
  templateUrl: './services-info.component.html',
  styleUrls: ['./services-info.component.scss']
})
export class ServicesInfoComponent extends BaseComponent implements OnInit {
  admins;
  service;
  loading = true;
  school: ISchool;
  serviceId: number;
  mapCenter: BehaviorSubject<any>;

  constructor(
    private session: CPSession,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private serviceService: ServicesService
  ) {
    super();
    this.school = this.session.school;
    super.isLoading().subscribe(res => this.loading = res);
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
  }

  private fetch() {
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', this.school.id.toString());
    search.append('store_id', this.serviceId.toString());
    search.append('privilege_type', CP_PRIVILEGES_MAP.services.toString());

    const service$ = this.serviceService.getServiceById(this.serviceId);

    const admins$ = this
    .adminService
    .getAdminByStoreId(search)
    .map(admins => {
      let _admins = [];
        admins.forEach(admin => {
          if (!admin.is_school_level) {
            _admins.push(admin);
          }
        });
        return _admins;
    });

    const stream$ = Observable.combineLatest(service$, admins$);
    super
      .fetchData(stream$)
      .then(res => {
        this.admins = res.data[1];
        this.service = res.data[0];
        this.buildHeader(res.data[0]);
        this.mapCenter = new BehaviorSubject(
          {
            lat: res.data[0].latitude,
            lng: res.data[0].longitude
          }
        );
      })
      .catch(err => console.error(err));
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
