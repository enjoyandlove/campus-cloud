import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { SelfCheckInCallbackService } from '@projects/cc-check-in/src/app/self-check-in/services/self-check-in-callback.service';

@Injectable({
  providedIn: 'root'
})
export class SelfCheckInService {

  constructor(public api: SelfCheckInCallbackService) { }

  getClientConfig(search: HttpParams, silent) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.SELF_CHECK_IN_ENDPOINTS.NO_SESSION_CLIENT_CONFIG}/`;

    return this.api.get(url, search, silent);
  }

  getClient(search: HttpParams, silent) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.SELF_CHECK_IN_ENDPOINTS.NO_SESSION_CLIENT}/`;

    return this.api.get(url, search, silent);
  }

  getCampusLinksNoSession(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.SELF_CHECK_IN_ENDPOINTS.NO_SESSION_LINKS}/`;
    return this.api.get(url, search, true);
  }

  getEventDetails(id: string, search?: HttpParams, silent?: boolean) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.SELF_CHECK_IN_ENDPOINTS.NO_SESSION_EVENT}/${id}`;
    return this.api.get(url, search, silent);
  }

  doEventCheckin(id: string, data: any, search: HttpParams, silent = true) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.SELF_CHECK_IN_ENDPOINTS.NO_SESSION_EVENT}/`;
    return this.api.update(url, data, search, silent);
  }

  getUserEventDetails(id: string, search?: HttpParams, silent?: boolean) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.SELF_CHECK_IN_ENDPOINTS.NO_SESSION_USER_EVENT}/${id}`;
    return this.api.get(url, search, silent).pipe(
      map((res: any) => {
        res['poster_thumb_url'] = res['image_url'];
        return res;
      })
    );
  }

  doUserEventCheckin(id: string, data: any, search: HttpParams, silent = true) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.SELF_CHECK_IN_ENDPOINTS.NO_SESSION_USER_EVENT}/`;
    return this.api.update(url, data, search, silent);
  }

  getServiceProviderDetails(id: string, search?: HttpParams, silent?: boolean) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.SELF_CHECK_IN_ENDPOINTS.NO_SESSION_CAMPUS_SERVICE_PROVIDER}/${id}`;
    return this.api.get(url, search, silent).pipe(
      map((res: any) => {
        res['service_name'] = res['campus_service_name'];
        res['logo_url'] = res['campus_service_logo_url'];
        return res;
      })
    );
  }

  doServiceProviderCheckin(id: string, data: any, search: HttpParams, silent = true) {
    const body = {
      'email': data.email,
      'firstname': data.firstname,
      'lastname': data.lastname,
      'checkin_verification_method': data.attend_verification_method,
      'checkin_verification_data': data.attend_verification_data
    };
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.SELF_CHECK_IN_ENDPOINTS.NO_SESSION_CAMPUS_SERVICE_PROVIDER}/`;
    return this.api.update(url, body, search, silent);
  }
}
