/*tslint:disable:max-line-length */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { CPI18nService } from '@shared/services';
import { ServicesService } from '../services.service';
import { STAR_SIZE } from '@shared/components/cp-stars';
import { BaseComponent } from '@app/base/base.component';
import { IDateRange } from './components/providers-action-box';
import { ServicesUtilsService } from '../services.utils.service';
import { IFilterState, ProvidersUtilsService } from '../providers.utils.service';
import { IStudentFilter } from '../../../assess/engagement/engagement.utils.service';
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

  state: IFilterState = {
    dateRange: null,
    searchText: null,
    studentFilter: null
  };

  constructor(
    private router: Router,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private utils: ServicesUtilsService,
    public serviceService: ServicesService,
    private providerUtils: ProvidersUtilsService
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

      this.utils.buildServiceHeader(this.service);
    });
  }

  updateAssessment() {
    if (!this.state.searchText) {
      this.fetchAttendanceSummary();
    }
  }

  fetchAttendanceSummary() {
    let search = new HttpParams();

    search = this.providerUtils.addSearchParams(search, this.state);

    this.serviceService.getServiceAttendanceSummary(this.serviceId, search).subscribe((res) => {
      this.service = { ...this.service, ...res };
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

  onSearch(searchText) {
    this.state = { ...this.state, searchText };
    this.updateAssessment();
  }

  onStudentFilter(studentFilter: IStudentFilter) {
    this.state = { ...this.state, studentFilter };
    this.updateAssessment();
  }

  onDateFilter(dateRange: IDateRange) {
    this.state = { ...this.state, dateRange };
    this.updateAssessment();
  }

  onProvidersResult(data) {
    this.noProviders = !data;
  }

  onDownload() {
    this.providersList.downloadProvidersCSV();
  }

  ngOnInit() {}
}
