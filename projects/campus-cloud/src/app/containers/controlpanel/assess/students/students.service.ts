import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ApiService } from '@campus-cloud/base/services';
import { PersonaPermission } from './../engagement/engagement.status';
import { IPersona } from './../../customise/personas/persona.interface';
import { PersonasUtilsService } from '@controlpanel/customise/personas/personas.utils.service';

@Injectable()
export class StudentsService {
  constructor(private api: ApiService) {}

  getLists(search: HttpParams, startRange: number, endRange: number) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  postAnnouncements(search: HttpParams, body: any) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ANNOUNCEMENT}/`;

    return this.api.post(url, body, search);
  }

  getStudentById(search: HttpParams, studentId: number) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.STUDENT_PROFILE}`;

    const url = `${common}/${studentId}`;

    return this.api.get(url, search);
  }

  getEngagements(search: HttpParams, studentId: number, startRange: number, endRange: number) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.STUDENT_ENGAGEMENT}`;

    const url = `${common}/${studentId}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }

  getExperiences(search: HttpParams, startRange: number, endRange: number) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PERSONAS}/${startRange};${endRange}`;

    return this.api.get(url, search).pipe(
      map((res: any) => res.filter((p) => p.login_requirement !== PersonaPermission.forbidden)),
      map((personas: IPersona[]) =>
        personas.map((p) => {
          return {
            id: p.id,
            label: PersonasUtilsService.getLocalizedLabel(p.localized_name_map)
          };
        })
      )
    );
  }

  getStudentsByList(search: HttpParams, startRange: number, endRange: number) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.STUDENT_PROFILE}`;

    const url = `${common}/${startRange};${endRange}`;

    return this.api.get(url, search);
  }
}
