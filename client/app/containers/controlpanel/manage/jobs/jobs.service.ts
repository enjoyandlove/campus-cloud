import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';
import { CPSession } from '../../../../session';
import { CPI18nService } from '../../../../shared/services';
import { EmployerService } from './employers/employer.service';

@Injectable()
export class JobsService extends BaseService {
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

  getEmployers(label) {
    const key = label === 'new' ? 'employers_new_employer' : 'employer_all_employers';
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    return this.employerService
      .getEmployers(1, 10000, search)
      .startWith([{ label: this.cpI18n.translate(key) }])
      .map((employers) => {
        const _employers = [
          {
            label: this.cpI18n.translate(key),
            action: null
          }
        ];

        employers.forEach((employer) => {
          const _employer = {
            label: employer.name,
            action: employer.id
          };

          _employers.push(_employer);
        });

        return _employers;
      });
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
