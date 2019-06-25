import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { IPersona } from './../../customise/personas/persona.interface';
import { PersonasUtilsService } from './../../customise/personas/personas.utils.service';
import { PersonaPermission } from './../engagement/engagement.status';
import { HTTPService } from '../../../../base/http.service';
import { API } from '../../../../config/api';

@Injectable()
export class StudentsService extends HTTPService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, StudentsService.prototype);
  }

  getLists(search: HttpParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  postAnnouncements(search: HttpParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}/`;

    return super.post(url, body, search);
  }

  getStudentById(search: HttpParams, studentId: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STUDENT_PROFILE}`;

    const url = `${common}/${studentId}`;

    return super.get(url, search);
  }

  getEngagements(search: HttpParams, studentId: number, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STUDENT_ENGAGEMENT}`;

    const url = `${common}/${studentId}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getExperiences(search: HttpParams, startRange: number, endRange: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.PERSONAS
    }/${startRange};${endRange}`;

    return super.get(url, search).pipe(
      map((res: any) => res.filter((p) => p.login_requirement !== PersonaPermission.forbidden)),
      map((personas: IPersona[]) =>
        personas.map((p) => {
          return {
            id: p.id,
            label: PersonasUtilsService.localizedPersonaName(p)
          };
        })
      )
    );
  }

  getStudentsByList(search: HttpParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STUDENT_PROFILE}`;

    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }
}