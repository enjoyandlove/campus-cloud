import { URLSearchParams, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';

@Injectable()
export class OrientationService extends BaseService {
  dummy;
  mockJson = require('./mock.json');

  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, OrientationService.prototype);
  }

  getOrientationPrograms(startRage: number, endRage: number, search: URLSearchParams) {
    this.dummy = [startRage, endRage, search];

    return Observable.of(this.mockJson).delay(300);
  }

  getOrientationProgramById(programId: number, search: URLSearchParams) {
    this.dummy = [ search];

    const program = this.mockJson.filter((item) => item.id.toString() === programId);

    return Observable.of(program).delay(300);
  }

  createOrientationProgram(body: any, search: URLSearchParams) {
    this.dummy = [ search];

    return Observable.of(body).delay(300);
  }

  editOrientationProgram(programId: number, body: any, search: URLSearchParams) {
    this.dummy = [programId, body, search];

    return Observable.of(this.mockJson).delay(300);
  }

  deleteOrientationProgram(programId: number, search: URLSearchParams) {
    this.dummy = [programId, search];

    return Observable.of(this.mockJson).delay(300);
  }

  duplicateOrientationProgram(programId: number, body: any, search: URLSearchParams) {
    this.dummy = [programId, body, search];

    return Observable.of(body).delay(300);
  }
}
