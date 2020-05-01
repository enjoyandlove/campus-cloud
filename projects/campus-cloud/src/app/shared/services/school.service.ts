import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { ApiService } from '@campus-cloud/base/services';
import { CPSession, ISchool, ISchoolBranding } from '@campus-cloud/session';

@Injectable()
export class SchoolService {
  constructor(private session: CPSession, private api: ApiService) {}

  getSchools(startRange = 1, endRange = 100) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SCHOOL}/${startRange};${endRange}`;

    return this.api.get(url);
  }

  getSchoolConfig(params: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SCHOOL_CONFIG}/`;
    return this.api.get(url, params, true);
  }

  updateSchoolBranding(schoolId: number, school: ISchoolBranding) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SCHOOL}/${schoolId}`;

    return this.api.update(url, school).pipe(
      tap((updatedSchool: ISchool) => {
        this.session.school = updatedSchool;
      })
    );
  }
}
