import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';

import { API } from '../../../config/api';
import { BaseService } from '../../../base/index';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DashboardService extends BaseService {
  eventAssessment = new Subject();
  serviceAssessment = new Subject();

  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, DashboardService.prototype);
  }

  getDownloads(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBORD_USER_ACQUISITION}/`;

    return super
      .get(url, { search })
      .map(data => {
        const jsonData = data.json();

        return {
          series: [jsonData.downloads.series, jsonData.registrations.series],
          labels: jsonData.downloads.labels
        };
      })
  }

  getSocialActivity(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_SOCIAL_ACTIVITY}/`;

    return super
      .get(url, { search })
      .map(data => {
        let res = {
          series: [],
          labels: [],
        };

        const jsonData = data.json();

        res.series.push([jsonData.wall_post_likes]);
        res.series.push([jsonData.campus_posts]);
        res.series.push([jsonData.connections]);
        res.series.push([jsonData.wall_comments]);
        res.series.push([jsonData.messages]);

        res.labels.push('Messages', 'Wall Comments', 'Connections',
                        'Campus Posts', 'Wall Post Likes')
        return res;
      })
  }

  getCampusTile(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_CAMPUS_TILE}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  getAssessment() {
    const eventAssessment$ = this.eventAssessment.asObservable();
    const serviceAssessment$ = this.serviceAssessment.asObservable();

    return Observable.combineLatest(eventAssessment$, serviceAssessment$);
  }

  getIntegrations(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_INTEGRATION_STATUS}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  getTopClubs(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_TOP_CLUBS}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  getGeneralInformation(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_GENERAL_INFORMATION}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  getTopEvents(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_EVENT}/`;

    return super
      .get(url, { search })
      .map(res => {

        const jsonData = res.json();

        const eventAssessment = {
          event_checkins: jsonData.total_attendees,
          event_feedback_rate: jsonData.avg_feedbacks,
          event_total_feedback: jsonData.total_feedbacks
        };

        this.eventAssessment.next(eventAssessment);

        return jsonData;
      });
  }

  getTopServices(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_SERVICE}/`;

    return super
      .get(url, { search })
      .map(res => {
        const jsonData = res.json();

        const serviceAssessment = {
          service_checkins: jsonData.total_attendees,
          service_feedback_rate: jsonData.avg_feedbacks,
          service_total_feedback: jsonData.total_feedbacks
        };

        this.serviceAssessment.next(serviceAssessment)

        return jsonData;
      });
  }
}

