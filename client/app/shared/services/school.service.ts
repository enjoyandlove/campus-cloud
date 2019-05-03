import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { API } from '../../config/api';
import { HTTPService } from '../../base/http.service';
import { CPSession, ISchool, ISchoolBranding } from '@app/session';

@Injectable()
export class SchoolService extends HTTPService {
  constructor(http: HttpClient, router: Router, private session: CPSession) {
    super(http, router);

    Object.setPrototypeOf(this, SchoolService.prototype);
  }

  getSchools(startRange = 1, endRange = 100) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.SCHOOL
    }/${startRange};${endRange}`;

    return super.get(url).pipe(map((res) => res));
  }

  updateSchoolBranding(schoolId: number, school: ISchoolBranding) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SCHOOL}/${schoolId}`;

    return super.update(url, school).pipe(
      tap((updatedSchool: ISchool) => {
        this.session.school = updatedSchool;
      })
    );
  }
}
