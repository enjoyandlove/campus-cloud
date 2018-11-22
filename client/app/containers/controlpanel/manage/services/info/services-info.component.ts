/*tslint:disable:max-line-length */
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { ServicesService } from '../services.service';
import { CPSession, ISchool } from '../../../../../session';
import { AdminService } from '../../../../../shared/services';
import { ServicesUtilsService } from '../services.utils.service';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
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
    private route: ActivatedRoute,
    private adminService: AdminService,
    private utils: ServicesUtilsService,
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

    const admins$ = this.adminService
      .getAdminByStoreId(search)
      .pipe(map((admins: Array<any>) => admins.filter((admin) => !admin.is_school_level)));

    const stream$ = combineLatest(service$, admins$);
    super.fetchData(stream$).then((res) => {
      this.admins = res.data[1];
      this.service = res.data[0];
      this.storeId = this.service.store_id;
      this.showLocationDetails = res.data[0].latitude !== 0 && res.data[0].longitude !== 0;

      this.utils.buildServiceHeader(this.service);

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

  ngOnInit() {}
}
