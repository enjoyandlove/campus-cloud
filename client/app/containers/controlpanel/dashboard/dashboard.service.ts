import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { HTTPService } from '../../../base/index';

@Injectable()
export class DashboardService extends HTTPService {
  eventAssessment = new Subject();
  serviceAssessment = new Subject();

  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, DashboardService.prototype);
  }

  getDownloads(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBORD_USER_ACQUISITION}/`;

    return super.get(url, search).pipe(
      map((data: any) => {
        return {
          series: [data.downloads.series, data.registrations.series],
          labels: data.downloads.labels
        };
      })
    );
  }

  getSocialActivity(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_SOCIAL_ACTIVITY}/`;

    return super.get(url, search).pipe(
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
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_CAMPUS_TILE}/`;

    return super.get(url, search);
  }

  getAssessment() {
    const eventAssessment$ = this.eventAssessment.asObservable();
    const serviceAssessment$ = this.serviceAssessment.asObservable();

    return combineLatest(eventAssessment$, serviceAssessment$);
  }

  getIntegrations(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_INTEGRATION_STATUS}/`;

    return super.get(url, search);
  }

  getTopClubs(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_TOP_CLUBS}/`;

    return super.get(url, search);
  }

  getGeneralInformation(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_GENERAL_INFORMATION}/`;

    return super.get(url, search);
  }

  getTopEvents(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_EVENT}/`;

    return super.get(url, search).pipe(
      map((res: any) => {
        const eventAssessment = {
          event_checkins: res.total_attendees,
          event_feedback_rate: res.avg_feedbacks,
          event_total_feedback: res.total_feedbacks
        };

        this.eventAssessment.next(eventAssessment);

        return res;
      })
    );
  }

  getTopServices(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_SERVICE}/`;

    return super.get(url, search).pipe(
      map((res: any) => {
        const serviceAssessment = {
          service_checkins: res.total_attendees,
          service_feedback_rate: res.avg_feedbacks,
          service_total_feedback: res.total_feedbacks
        };

        this.serviceAssessment.next(serviceAssessment);

        return res;
      })
    );
  }

  getTopOrientation(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_ORIENTATION_EVENT}/`;

    return super.get(url, search);
  }
}
