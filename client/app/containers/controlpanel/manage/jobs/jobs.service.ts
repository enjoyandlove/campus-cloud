import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { API } from '../../../../config/api';
import { HTTPService } from '../../../../base';
import { CPSession } from '../../../../session';
import { CPI18nService } from '../../../../shared/services';
import { EmployerService } from './employers/employer.service';

@Injectable()
export class JobsService extends HTTPService {
  constructor(
    router: Router,
    http: HttpClient,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public employerService: EmployerService
  ) {
    super(http, router);

    Object.setPrototypeOf(this, JobsService.prototype);
  }

  getEmployers() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    return this.employerService.getEmployers(1, 10000, search).pipe(
      map((employers: any[]) => {
        const _employers = [];

        employers.forEach((employer: any) => {
          const _employer = {
            label: employer.name,
            action: employer.id
          };

          _employers.push(_employer);
        });

        return _employers;
      })
    );
  }

  getJobs(startRage: number, endRage: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.JOB}/${startRage};${endRage}`;

    return super.get(url, search);
  }

  deleteJob(id: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.JOB}/${id}`;

    return super.delete(url, search);
  }

  createJob(body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.JOB}/`;

    return super.post(url, body, search);
  }

  editJob(id: number, body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.JOB}/${id}`;

    return super.update(url, body, search);
  }

  getJobById(id: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.JOB}/${id}`;

    return super.get(url, search);
  }
}
