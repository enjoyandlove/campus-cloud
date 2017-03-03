import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, URLSearchParams } from '@angular/http';

// import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';


@Injectable()
export class ServicesService extends BaseService {
  constructor(http: Http) {
    super(http);

    Object.setPrototypeOf(this, ServicesService.prototype);
  }

  // getServices(search?: URLSearchParams) {
  //   const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}`;
  //   return super.get(url, { search }).map(res => res.json());
  // }
  getServices(search?: URLSearchParams) {
    if (search) { console.log(search); }

    const promise = new Promise(resolve => {
      const services = require('./mock.json');
      resolve(services);
    });

    return Observable.fromPromise(promise).map(res => res);
  }

  setModalServices(services: any[]): void {
    console.log(services);
    // this.store.dispatch({
    //   type: EVENTS_MODAL_SET,
    //   payload: services
    // });
  }
}
