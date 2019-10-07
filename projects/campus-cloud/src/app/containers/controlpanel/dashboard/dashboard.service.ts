import { Subject, combineLatest, Observable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sortBy } from 'lodash';

import { ApiService } from '@campus-cloud/base';
import { CPI18nService } from '@campus-cloud/shared/services';
import { IPersona } from '../customise/personas/persona.interface';

@Injectable()
export class DashboardService {
  eventAssessment = new Subject();
  serviceAssessment = new Subject();

  constructor(private api: ApiService, public cpI18n: CPI18nService) {}

  getDownloads(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DASHBORD_USER_ACQUISITION}/`;

    return this.api.get(url, search, true).pipe(
      map((data: any) => {
        return {
          series: [data.downloads.series, data.registrations.series],
          labels: data.downloads.labels
        };
      })
    );
  }

  getExperiences(
    search: HttpParams
  ): Observable<Array<{ label: string; action: number; heading?: boolean }>> {
    const defaultValue = { label: '---', action: null, heading: true };
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.PERSONAS}/1;1000`;

    return this.api.get(url, search, true).pipe(
      startWith([defaultValue]),
      map((data: IPersona[]) => {
        const parsePersona = (persona: IPersona) => {
          return {
            label: persona.localized_name_map.en,
            action: persona.id
          };
        };

        const parsedExperience = data.filter((experience) => experience.id).map(parsePersona);
        const sortedExperiences = sortBy(
          parsedExperience,
          (experience: { label: string; action: number }) => experience.label.toLowerCase()
        );

        return [defaultValue, ...sortedExperiences];
      }),
      catchError(() => of([defaultValue]))
    );
  }

  getUserAcquisition(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.USER_ACQUISITION}/`;

    return this.api.get(url, search, true);
  }

  getSocialActivity(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DASHBOARD_SOCIAL_ACTIVITY}/`;

    return this.api.get(url, search).pipe(
      map((data: any) => {
        const res = {
          series: [],
          labels: []
        };

        res.series.push([data.wall_post_likes]);
        res.series.push([data.campus_posts]);
        res.series.push([data.connections]);
        res.series.push([data.wall_comments]);
        res.series.push([data.messages]);

        res.labels.push('Messages', 'Comments', 'Connections', 'Wall Posts', 'Likes');

        return res;
      })
    );
  }

  getCampusTile(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DASHBOARD_CAMPUS_TILE}/`;

    return this.api.get(url, search);
  }

  getAssessment() {
    const eventAssessment$ = this.eventAssessment.asObservable();
    const serviceAssessment$ = this.serviceAssessment.asObservable();

    return combineLatest([eventAssessment$, serviceAssessment$]);
  }

  getIntegrations(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DASHBOARD_INTEGRATION_STATUS}/`;

    return this.api.get(url, search);
  }

  getTopClubs(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DASHBOARD_TOP_CLUBS}/`;

    return this.api.get(url, search);
  }

  getGeneralInformation(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.DASHBOARD_GENERAL_INFORMATION}/`;

    return this.api.get(url, search);
  }

  getTopEvents(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ASSESS_EVENT}/`;

    return this.api.get(url, search, true).pipe(
      map((res: any) => {
        const eventAssessment = {
          event_checkins: res.total_attendees,
          event_feedback_rate: res.avg_feedbacks,
          event_total_feedback: res.total_feedbacks
        };

        this.eventAssessment.next(eventAssessment);

        return res;
      }),
      catchError(() => of([]))
    );
  }

  getTopServices(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ASSESS_SERVICE}/`;

    return this.api.get(url, search, true).pipe(
      map((res: any) => {
        const serviceAssessment = {
          service_checkins: res.total_attendees,
          service_feedback_rate: res.avg_feedbacks,
          service_total_feedback: res.total_feedbacks
        };

        this.serviceAssessment.next(serviceAssessment);

        return res;
      }),
      catchError(() => of([]))
    );
  }

  getTopOrientation(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ASSESS_ORIENTATION_EVENT}/`;

    return this.api.get(url, search, true).pipe(catchError(() => of([])));
  }
}
