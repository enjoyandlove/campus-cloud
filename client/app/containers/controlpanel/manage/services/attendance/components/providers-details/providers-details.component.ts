import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { ServicesService } from './../../../services.service';
import { ProvidersService } from '../../../providers.service';
import { CheckInMethod } from '../../../../events/event.status';
import { CPI18nService } from '../../../../../../../shared/services';
import { BaseComponent } from '../../../../../../../base/base.component';
import { SNACKBAR_SHOW } from '../../../../../../../reducers/snackbar.reducer';
import { HEADER_UPDATE, IHeader } from '../../../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-providers-details',
  templateUrl: './providers-details.component.html',
  styleUrls: ['./providers-details.component.scss']
})
export class ServicesProviderDetailsComponent extends BaseComponent implements OnInit {
  @ViewChild('providerAttendees') providerAttendees;

  loading;
  provider;
  eventData;
  serviceId;
  providerId;
  MAX_RATE = 5;
  eventRating;
  serviceName: string;
  updateQrCode = new BehaviorSubject(null);

  constructor(
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    private cpI18n: CPI18nService,
    private serviceService: ServicesService,
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
    this.providerId = this.route.snapshot.params['providerId'];
    this.serviceId = this.route.snapshot.params['serviceId'];
  }

  private fetch() {
    const search = new HttpParams().append('service_id', this.serviceId);

    const service$ = this.serviceService.getServiceById(this.serviceId);
    const providers$ = this.providersService.getProviderByProviderId(this.providerId, search);

    const stream$ = service$.pipe(
      switchMap((service: any) => {
        this.serviceName = service.name;

        return providers$;
      })
    );

    super.fetchData(stream$).then((res) => {
      this.provider = res.data;
      this.updateQrCode.next(this.provider.checkin_verification_methods);
      this.eventRating = (this.provider.avg_rating_percent * this.MAX_RATE / 100).toFixed(1);
      this.buildHeader();
    });
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${this.provider.provider_name}[NOTRANSLATE]`,
        crumbs: {
          url: `services/${this.serviceId}`,
          label: `[NOTRANSLATE]${this.serviceName}[NOTRANSLATE]`
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

  onSearch(query) {
    this.providerAttendees.doSearch(query);
  }

  onAddCheckIn() {
    this.providerAttendees.onCreateCheckIn();
  }

  onDateFilter(dateRange) {
    this.providerAttendees.doDateFilter(dateRange);
  }

  onToggleQr(isEnabled: boolean) {
    const verificationMethods = this.provider.checkin_verification_methods;

    if (!isEnabled && !verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.push(CheckInMethod.app);
    } else if (isEnabled && verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.pop(CheckInMethod.app);
    }

    const data = {
      ...this.provider,
      attend_verification_methods: verificationMethods
    };

    const search = new HttpParams()
      .append('service_id', this.serviceId.toString());

    this.providersService.updateProvider(data, this.providerId, search).subscribe(
      (_) => {
        this.providerAttendees.trackQrCodeEvent();
        this.onSuccessQRCheckInMessage(isEnabled);
        this.updateQrCode.next(verificationMethods);
      },
      (_) => {
        this.onErrorQRCheckInMessage();
      });
  }

  onSuccessQRCheckInMessage(isEnabled: boolean) {
    const message = isEnabled
      ? 't_services_assessment_qr_code_disabled_success_message'
      : 't_services_assessment_qr_code_enable_success_message';

    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: this.cpI18n.translate(message),
        autoClose: true,
        class: 'success'
      }
    });
  }

  onErrorQRCheckInMessage() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        class: 'danger',
        body: this.cpI18n.translate('something_went_wrong'),
        autoClose: true
      }
    });
  }

  ngOnInit() {
    this.fetch();
  }
}
