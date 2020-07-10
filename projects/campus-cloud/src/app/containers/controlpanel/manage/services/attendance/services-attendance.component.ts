import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { ServicesService } from '../services.service';
import { IDateRange } from '@campus-cloud/shared/components';
import { CPI18nService } from '@campus-cloud/shared/services';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { ServicesUtilsService } from '../services.utils.service';
import { IFilterState, ProvidersUtilsService } from '../providers.utils.service';
import { IStudentFilter } from '../../../assess/engagement/engagement.utils.service';
import { ServicesProvidersListComponent } from './components/providers-list/providers-list.component';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';

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
  isContactTrace;
  isProviderAdd;
  serviceId: number;

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
      if (this.utils.hasPrivilege(this.service.store_id, CP_PRIVILEGES_MAP.contact_tracing)) {
        this.isContactTrace = this.service.is_contact_trace;
      }

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

    this.serviceService
      .getServiceAttendanceSummary(this.serviceId, search)
      .subscribe((res: any) => {
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
        $('#createProvider').modal({ keyboard: true, focus: true });
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

  onImportLocations() {
    this.providersList.importProvidersFromLocations();
  }

  onDownload() {
    this.providersList.downloadProvidersCSV();
  }

  onUpdateStats() {
    this.fetch();
  }

  ngOnInit() {}
}
