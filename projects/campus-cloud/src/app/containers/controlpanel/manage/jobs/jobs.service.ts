import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ApiService } from '@campus-cloud/base';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { EmployerService } from './employers/employer.service';

@Injectable()
export class JobsService {
  constructor(
    private api: ApiService,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public employerService: EmployerService
  ) {}

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
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.JOB}/${startRage};${endRage}`;

    return this.api.get(url, search);
  }

  deleteJob(id: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.JOB}/${id}`;

    return this.api.delete(url, search);
  }

  createJob(body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.JOB}/`;

    return this.api.post(url, body, search);
  }

  editJob(id: number, body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.JOB}/${id}`;

    return this.api.update(url, body, search);
  }

  getJobById(id: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.JOB}/${id}`;

    return this.api.get(url, search);
  }
}
