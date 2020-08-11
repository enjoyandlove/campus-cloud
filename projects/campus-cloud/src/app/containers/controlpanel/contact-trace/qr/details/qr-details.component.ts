import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { IDateRange } from '@campus-cloud/shared/components';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { baseActions, IHeader } from '@campus-cloud/store/base';
import { BaseComponent } from '@campus-cloud/base/base.component';
import IServiceProvider from '@campus-cloud/containers/controlpanel/manage/services/providers.interface';
import { ServicesService } from '@campus-cloud/containers/controlpanel/manage/services/services.service';
import { ProvidersService } from '@campus-cloud/containers/controlpanel/manage/services/providers.service';
import { CheckInMethod } from '@campus-cloud/containers/controlpanel/manage/events/event.status';
import {
  IFilterState,
  ProvidersUtilsService
} from '@campus-cloud/containers/controlpanel/manage/services/providers.utils.service';
import { IStudentFilter } from '@campus-cloud/containers/controlpanel/assess/engagement/engagement.utils.service';

@Component({
  selector: 'cp-qr-details',
  templateUrl: './qr-details.component.html',
  styleUrls: ['./qr-details.component.scss']
})
export class QrDetailsComponent extends BaseComponent implements OnInit {
  @ViewChild('providerAttendees') providerAttendees;

  loading;
  service;
  provider;
  eventData;
  serviceId;
  providerId;
  eventRating;
  updateQrCode = new BehaviorSubject(null);

  state: IFilterState = {
    dateRange: null,
    searchText: null,
    studentFilter: null
  };

  constructor(
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    private cpI18n: CPI18nService,
    public serviceService: ServicesService,
    public providersService: ProvidersService,
    private providerUtils: ProvidersUtilsService,
    private session: CPSession
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
    this.providerId = this.route.snapshot.params['providerId'];
    this.serviceId = this.session.g.get('school').ct_service_id;
  }

  private fetch() {
    const stream$ = this.getProvider();

    super.fetchData(stream$).then((res) => {
      this.provider = res.data;
      this.updateQrCode.next(this.provider.checkin_verification_methods);
      this.buildHeader();
    });
  }

  private getProvider(dateRange?: IDateRange) {
    let search = new HttpParams().append('service_id', this.serviceId);
    const start = dateRange ? dateRange.start : null;
    const end = dateRange ? dateRange.end : null;
    if (start && end) {
      search = search.append('start', start.toString()).append('end', end.toString());
    }

    const service$ = this.serviceService.getServiceById(this.serviceId);
    const providers$ = this.providersService.getProviderByProviderId(this.providerId, search);

    return service$.pipe(
      switchMap((service: any) => {
        this.service = service;

        return providers$;
      })
    );
  }

  updateAssessment() {
    if (!this.state.searchText) {
      this.fetchProvider();
    }
  }

  fetchProvider() {
    let search = new HttpParams().append('service_id', this.serviceId);

    search = this.providerUtils.addSearchParams(search, this.state);

    this.providersService
      .getProviderByProviderId(this.providerId, search)
      .subscribe((res: IServiceProvider) => {
        this.provider = res;
      });
  }

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${this.provider.provider_name}[NOTRANSLATE]`,
        crumbs: {
          url: 'qr',
          label: 'qr_code'
        },
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  onDownload() {
    this.providerAttendees.downloadProvidersCSV();
  }

  onAddCheckIn() {
    this.providerAttendees.onCreateCheckIn();
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

  onToggleQr(isEnabled: boolean) {
    const verificationMethods = this.provider.checkin_verification_methods;

    if (!isEnabled && !verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.push(CheckInMethod.app);
    } else if (isEnabled && verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.pop(CheckInMethod.app);
    }

    const data = {
      attend_verification_methods: verificationMethods
    };

    const search = new HttpParams().append('service_id', this.serviceId.toString());

    this.providersService.updateProvider(data, this.providerId, search).subscribe(
      (_) => {
        this.providerAttendees.trackQrCodeEvent();
        this.onSuccessQRCheckInMessage(isEnabled);
        this.updateQrCode.next(verificationMethods);
      },
      (_) => {
        this.onErrorQRCheckInMessage();
      }
    );
  }

  onSuccessQRCheckInMessage(isEnabled: boolean) {
    const message = isEnabled
      ? 't_services_assessment_qr_code_disabled_success_message'
      : 't_services_assessment_qr_code_enable_success_message';

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body: this.cpI18n.translate(message),
        autoClose: true,
        class: 'success'
      }
    });
  }

  onErrorQRCheckInMessage() {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        class: 'danger',
        body: this.cpI18n.translate('something_went_wrong'),
        autoClose: true
      }
    });
  }

  onAddRemoveAttendee(updatedProvider: IServiceProvider) {
    this.provider = updatedProvider;
  }

  ngOnInit() {
    this.fetch();
  }
}
