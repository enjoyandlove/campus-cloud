import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '@campus-cloud/base/services';
import { baseActions } from '@campus-cloud/store';
import { Store } from '@ngrx/store';

@Injectable()
export class ProvidersService {
  constructor(private api: ApiService, private store: Store<any>) {}

  addOrientationCheckIn() {
    // overriding this method in event service DO NOT delete
  }

  updateOrientationCheckIn() {
    // overriding this method in event service DO NOT delete
  }

  deleteOrientationCheckInById() {
    // overriding this method in event service DO NOT delete
  }

  getProviders(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICE_PROVIDER}`;
    const url = `${common}/${startRange};${endRange}`;
    return this.api.get(url, search);
  }

  createProvider(data: any, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICE_PROVIDER}/`;

    return this.api.post(url, data, search);
  }

  importProvidersFromLocations(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICE_PROVIDER}/`;

    return this.api.update(url, { import_from_locations: true }, search);
  }

  updateProvider(data: any, providerId: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICE_PROVIDER}/${providerId}`;

    return this.api.update(url, data, search);
  }

  deleteProvider(providerId: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICE_PROVIDER}/${providerId}`;

    return this.api.delete(url, search);
  }

  getProviderByProviderId(providerId: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICE_PROVIDER}/${providerId}`;

    return this.api.get(url, search);
  }

  getProviderAssessments(startRange: number, endRange: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICE_ASSESSMENT}`;
    const url = startRange && endRange ? `${common}/${startRange};${endRange}` : `${common}/`;

    return this.api.get(url, search);
  }

  addCheckIn(body: any, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICE_ASSESSMENT}/`;

    return this.api.post(url, body, search);
  }

  updateCheckIn(body: any, attendeeId: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICE_ASSESSMENT}`;
    const url = `${common}/${attendeeId}`;

    return this.api.update(url, body, search);
  }

  deleteCheckInById(attendeeId: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SERVICE_ASSESSMENT}`;
    const url = `${common}/${attendeeId}`;

    return this.api.delete(url, search);
  }

  setModalProviders(providers: any[]): void {
    this.store.dispatch({
      type: baseActions.PROVIDERS_MODAL_SET,
      payload: providers
    });
  }
}
