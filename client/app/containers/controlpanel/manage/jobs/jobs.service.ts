import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';

@Injectable()
export class JobsService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, JobsService.prototype);
  }

  getJobs(startRage: number, endRage: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.JOB}/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  deleteJob(id: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.JOB}/${id}`;

    return super.delete(url, { search }).map((res) => res.json());
  }

  createJob(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.JOB}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  editJob(id: number, body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.JOB}/${id}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }

  getJobById(id: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.JOB}/${id}`;

    return super.get(url, { search }).map((res) => res.json());
  }
}
