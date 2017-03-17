import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, URLSearchParams } from '@angular/http';

// import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

const mockClubs = require('./mock.json');

@Injectable()
export class ClubsService extends BaseService {
  constructor(http: Http) {
    super(http);

    Object.setPrototypeOf(this, ClubsService.prototype);
  }

  getClubs(search?: URLSearchParams) {
    if (search) { console.log(search); }

    const promise = new Promise(resolve => {
      resolve(mockClubs);
    });

    return Observable.fromPromise(promise).map(res => res);
  }

  getClubById(serviceId) {
    const promise = new Promise(resolve => {
      resolve(mockClubs.filter(service => {
        if (service.id === +serviceId) {
          return service;
        }
      }));
    });

    return Observable.fromPromise(promise).map(res => res[0]);
  }
}
