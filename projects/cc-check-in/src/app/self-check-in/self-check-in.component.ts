import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { baseActions, ISnackbar } from '@campus-cloud/store';
import { CheckinUtilsService } from '@campus-cloud/containers/callback/checkin/checkin.utils.service';
import { BaseComponent } from '@campus-cloud/base';
import { SelfCheckInService } from '@projects/cc-check-in/src/app/self-check-in/services/self-check-in.service';
import { CheckInFormStatus } from '@projects/cc-check-in/src/app/self-check-in/self-check-in.models';
import { SelfCheckInUtils } from '@projects/cc-check-in/src/app/self-check-in/services/self-check-in-utils';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { DeviceDetectorService } from '@projects/cc-check-in/src/app/self-check-in/services/device-detector.service';

enum AttendanceDataType {
  Event,
  UserEvent,
  ServiceProvider,
  None,
}
interface IState {
  attendanceEntity: Array<any>;
}

const state: IState = {
  attendanceEntity: []
};


@Component({
  selector: 'check-self-check-in',
  templateUrl: './self-check-in.component.html',
  styleUrls: ['./self-check-in.component.scss']
})
export class SelfCheckInComponent extends BaseComponent implements OnInit {
  loading;
  attendanceDataType: AttendanceDataType;
  attendanceDataId: string;
  deep_link_url: string;
  timeZone: string;
  search: HttpParams;
  checkInSource: string;
  state: IState = state;
  eventId: string;
  isEvent: boolean;
  isOrientation: boolean;
  isService: boolean;

  client: any;
  clientConfig: any;
  campusLink: any;

  checkInFormStatus: CheckInFormStatus = CheckInFormStatus.QR_Email;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public cpI18n: CPI18nPipe,
    public store: Store<ISnackbar>,
    public utils: CheckinUtilsService,
    private selfCheckInService: SelfCheckInService,
    private deviceDetectorService: DeviceDetectorService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
    const fullUrl = window.location.toString();
    const portString = window.location.port === '' ? '' : ':' + window.location.port;
    const fullHostName = window.location.hostname + portString;
    const domainRelativeUrlComponents = fullUrl.split(fullHostName);
    domainRelativeUrlComponents.splice(0, 1);
  }

  onSubmit(data: any) {
    const formSubmission = {
      ...data,
      attend_verification_method: 6,
      attend_verification_data: this.campusLink.link_params.attend_verification_data
    };
    let dataSubmitter = null;
    if (this.attendanceDataType === AttendanceDataType.Event) {
      dataSubmitter = this.selfCheckInService.doEventCheckin(this.attendanceDataId, formSubmission, null);
    } else if (this.attendanceDataType === AttendanceDataType.UserEvent) {
      dataSubmitter = this.selfCheckInService.doUserEventCheckin(this.attendanceDataId, formSubmission, null);
    } else if (this.attendanceDataType === AttendanceDataType.ServiceProvider) {
      dataSubmitter = this.selfCheckInService.doServiceProviderCheckin(this.attendanceDataId, formSubmission, null);
    }
    if (dataSubmitter != null) {
      dataSubmitter.subscribe(
        (_) => {
          this.checkInFormStatus = CheckInFormStatus.SubmittedSuccess;
        },
        (err) => {
          this.handleError(err.status);
        }
      );
    }
  }

  handleError(status = null) {
    const body = status
      ? this.utils.getErrorMessage(status)
      : this.cpI18n.transform('t_external_checkin_already_checked_in');

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body,
        sticky: true,
        autoClose: true,
        class: 'danger'
      }
    });
  }

  fetch() {
    let dataFetcher = null;
    if (this.campusLink.link_url === 'in_app://check_in_campus_event') {
      this.attendanceDataType = AttendanceDataType.Event;
      this.attendanceDataId = this.campusLink.link_params.id;
      this.eventId = this.attendanceDataId;
      this.isEvent = true;
      this.isOrientation = false;
      this.isService = false;
      dataFetcher = this.selfCheckInService.getEventDetails(this.attendanceDataId, null, true);
    } else if (this.campusLink.link_url === 'in_app://check_in_user_event') {
      this.attendanceDataType = AttendanceDataType.UserEvent;
      this.attendanceDataId = this.campusLink.link_params.id;
      this.eventId = this.attendanceDataId;
      this.isEvent = true;
      this.isOrientation = true;
      this.isService = false;
      dataFetcher = this.selfCheckInService.getUserEventDetails(this.attendanceDataId, null, true);
    } else if (this.campusLink.link_url === 'in_app://check_in_service_provider') {
      this.attendanceDataType = AttendanceDataType.ServiceProvider;
      this.attendanceDataId = this.campusLink.link_params.id;
      this.eventId = null;
      this.isEvent = false;
      this.isOrientation = false;
      this.isService = true;
      dataFetcher = this.selfCheckInService.getServiceProviderDetails(this.attendanceDataId, null, true);
    }
    /*TODO handle data fetcher null (campus link not recognized)*/
    super
      .fetchData(dataFetcher)
      .then((res) => {
        this.timeZone = res.data.tz_zoneinfo_str;
        this.state = {
          ...this.state,
          attendanceEntity: res.data
        };

        this.checkInFormStatus = SelfCheckInUtils.calculateCheckInFormStatus(
          this.isService ? res.data.checkin_verification_methods :
          res.data.attend_verification_methods);
      })
      .catch((_) => {
        console.log(_);
      });
  }

  ngOnInit() {
    const campusLinkParams = new HttpParams().append('deep_link_path', this.getDeepLinkDomainRelativePath());
    this.selfCheckInService.getCampusLinksNoSession(campusLinkParams).subscribe(res => {
      this.campusLink = res;
      this.search = new HttpParams().append('event_id', this.campusLink.link_params.id);
      this.fetch();
    }, error => {
      console.log(error);
      if (error.status === 404) {
        this.checkInFormStatus = CheckInFormStatus.LinkNotAvailable;
      }
    });
    const httpParams = new HttpParams().append('deep_link_url', window.location.hostname);
    this.selfCheckInService.getClient(httpParams, true).subscribe(res => {
      this.client = res;
      this.getClientConfig();
    }, error => {
      console.log(error);
    });
  }

  private getClientConfig() {
    this.selfCheckInService.getClientConfig(new HttpParams().append('client_id', this.client.id), true)
      .subscribe(res => {
        this.clientConfig = res;
      }, error1 => {
        console.log(error1);
      });
  }

  private getDeepLinkDomainRelativePath() {
    const fullUrl = window.location.toString();
    const portString = window.location.port === '' ? '' : ':' + window.location.port;
    const fullHostName = window.location.hostname + portString;
    const domainRelativeUrlComponents = fullUrl.split(fullHostName);
    domainRelativeUrlComponents.splice(0, 1);
    return domainRelativeUrlComponents.join(fullHostName);
  }

  private redirectToAndroidApp() {
    if (!this.deviceDetectorService.isAndroid()) {
      return;
    }

    const appPackage = this.clientConfig.app_id_android;
    const appScheme = this.client.deep_link_scheme;
    // tslint:disable-next-line:max-line-length
    const appUrl = `intent://${appScheme}${this.getDeepLinkDomainRelativePath()}#Intent;scheme=${appScheme};package=${appPackage};S.browser_fallback_url=https%3A%2F%2Fplay.google.com/store/apps/details?id=${appPackage};end`;
    try {
      window.location.href = appUrl;
    } catch (e) {
    }
  }
}
