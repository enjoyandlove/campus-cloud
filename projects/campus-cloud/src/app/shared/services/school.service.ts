import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { ApiService } from '@campus-cloud/base/services';
import { CPSession, ISchool, ISchoolBranding } from '@campus-cloud/session';

@Injectable()
export class SchoolService {
  constructor(private session: CPSession, private api: ApiService) {}

  getSchools(startRange = 1, endRange = 100) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.SCHOOL}/${startRange};${endRange}`;

    return this.api.get(url).pipe(map((res) => res));
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
