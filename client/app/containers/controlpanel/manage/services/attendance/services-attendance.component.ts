/*tslint:disable:max-line-length */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ServicesService } from '../services.service';
import { CPI18nService } from '../../../../../shared/services';
import { ServicesUtilsService } from '../services.utils.service';
import { BaseComponent } from '../../../../../base/base.component';
import { STAR_SIZE } from '../../../../../shared/components/cp-stars';
import { ServicesProvidersListComponent } from './components/providers-list/providers-list.component';

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
  noProviders;
  isProviderAdd;
  serviceId: number;
  detailStarSize = STAR_SIZE.LARGE;
  listStarSize = STAR_SIZE.DEFAULT;

  constructor(
    private router: Router,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private utils: ServicesUtilsService,
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

      if (!this.service.service_attendance) {
        this.redirectOnDisabledAttendance();

        return;
      }

      this.utils.buildServiceProviderHeader(this.service);
    });
  }

  redirectOnDisabledAttendance() {
    this.router.navigate(['/manage/services/' + this.serviceId + '/info']);
  }

  onProviderAdded() {
    this.providersList.fetch();
    this.isProviderAdd = false;
    this.providersList.hasRecords = true;
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

  onSearch(query) {
    this.providersList.doSearch(query);
  }

  onDateFilter(dateRange) {
    this.providersList.doDateFilter(dateRange);
  }

  onProvidersResult(data) {
    this.noProviders = !data;
  }

  onDownload() {
    this.providersList.downloadProvidersCSV();
  }

  ngOnInit() {}
}
