import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { ServicesService } from '@controlpanel/manage/services/services.service';
import { IDateRange } from '@campus-cloud/shared/components';
import { CPI18nService } from '@campus-cloud/shared/services';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';
import {
  IFilterState,
  ProvidersUtilsService
} from '@controlpanel/manage/services/providers.utils.service';
import { IStudentFilter } from '@controlpanel/assess/engagement/engagement.utils.service';
import { QrListComponent } from './list/qr-list.component';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { ContactTraceHeaderService } from '@controlpanel/contact-trace/utils';
import { CPSession } from '@campus-cloud/session';
@Component({
  selector: 'cp-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent extends BaseComponent implements OnInit {
  @ViewChild('providersList') providersList: QrListComponent;

  loading;
  service;
  listLoading: boolean;
  storeId;
  noProviders;
  allowLocationsImport;
  allowServiceProvidersImport;
  isProviderAdd;
  serviceId: number;

  state: IFilterState = {
    dateRange: null,
    searchText: null,
    studentFilter: null
  };

  filterExistance = () => {
    return this.state.dateRange || this.state.searchText || this.state.studentFilter;
  };

  constructor(
    public cpI18n: CPI18nService,
    private utils: ServicesUtilsService,
    public serviceService: ServicesService,
    private providerUtils: ProvidersUtilsService,
    private headerService: ContactTraceHeaderService,
    private cdr: ChangeDetectorRef,
    private session: CPSession
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  private fetch() {
    this.serviceId = this.session.g.get('school').ct_service_id;

    super.fetchData(this.serviceService.getServiceById(this.serviceId)).then((res) => {
      this.service = res.data;
      this.allowLocationsImport = this.utils.hasSchoolWritePrivilege(
        CP_PRIVILEGES_MAP.contact_trace_qr
      );
      this.allowServiceProvidersImport = this.utils.hasSchoolWritePrivilege(
        CP_PRIVILEGES_MAP.services
      );
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

  onProviderAdded() {
    this.providersList.fetch();
    this.isProviderAdd = false;
    this.providersList.hasRecords = true;
  }

  onListLoading($_childLoading) {
    this.listLoading = $_childLoading;
    this.cdr.detectChanges();
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

  onDownloadAllQR() {
    this.providersList.downloadAllQR();
  }

  onDownload() {
    this.providersList.downloadProvidersCSV();
  }

  ngOnInit() {
    this.headerService.updateHeader();
    this.fetch();
  }
}
