import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { BaseService } from '../../../base/index';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DashboardService extends BaseService {
  eventAssessment = new Subject();
  serviceAssessment = new Subject();

  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, DashboardService.prototype);
  }

  getDownloads(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBORD_USER_ACQUISITION}/`;

    return super.get(url, search).map((data) => {
      const jsonData = data.json();

      return {
        series: [jsonData.downloads.series, jsonData.registrations.series],
        labels: jsonData.downloads.labels
      };
    });
  }

  getSocialActivity(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_SOCIAL_ACTIVITY}/`;

    return super.get(url, search).map((data) => {
      const res = {
        series: [],
        labels: []
      };

      const jsonData = data.json();

      res.series.push([jsonData.wall_post_likes]);
      res.series.push([jsonData.campus_posts]);
      res.series.push([jsonData.connections]);
      res.series.push([jsonData.wall_comments]);
      res.series.push([jsonData.messages]);

      res.labels.push('Messages', 'Comments', 'Connections', 'Wall Posts', 'Likes');

      return res;
    });
  }

  getCampusTile(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_CAMPUS_TILE}/`;

    return super.get(url, search);
  }

  getAssessment() {
    const eventAssessment$ = this.eventAssessment.asObservable();
    const serviceAssessment$ = this.serviceAssessment.asObservable();

    return Observable.combineLatest(eventAssessment$, serviceAssessment$);
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

    return super.get(url, search).map((res) => {
      const eventAssessment = {
        event_checkins: res.total_attendees,
        event_feedback_rate: res.avg_feedbacks,
        event_total_feedback: res.total_feedbacks
      };

      this.eventAssessment.next(eventAssessment);

      return res;
    });
  }

  getTopServices(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_SERVICE}/`;

    return super.get(url, search).map((res) => {
      const serviceAssessment = {
        service_checkins: res.total_attendees,
        service_feedback_rate: res.avg_feedbacks,
        service_total_feedback: res.total_feedbacks
      };

      this.serviceAssessment.next(serviceAssessment);

      return res;
    });
  }
}
