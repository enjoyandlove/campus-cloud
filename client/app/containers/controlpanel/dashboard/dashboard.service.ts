import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';

import { API } from '../../../config/api';
import { BaseService } from '../../../base/index';

@Injectable()
export class DashboardService extends BaseService {
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

        res.series.push([jsonData.messages]);
        res.series.push([jsonData.wall_comments]);
        res.series.push([jsonData.connections]);
        res.series.push([jsonData.campus_posts]);
        res.series.push([jsonData.wall_post_likes]);
        res.labels.push('Messages', 'Wall Comments', 'Connections',
                        'Campus Posts', 'Wall Post Likes')
        return res;
      })
  }

  getCampusTile(search: URLSearchParams) {
    console.log(search);
    return Observable.of(mockCampuTile()).delay(400);
  }

  getAssessment(search: URLSearchParams) {
    console.log(search);
    return Observable.of([]).delay(560);
  }

  getIntegrations(search: URLSearchParams) {
    console.log(search);
    return Observable.of([]).delay(560);
  }

  getTopClubs(search: URLSearchParams) {
    console.log(search);
    return Observable.of(mockTopClubsTile()).delay(400);
  }

  getGeneralInformation(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.DASHBOARD_GENERAL_INFORMATION}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  getTopEvents(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_EVENT}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  getTopServices(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ASSESS_SERVICE}/`;

    return super.get(url, { search }).map(res => res.json());
  }
}

const mockCampuTile = () => {
  let res = [];
  let counter = 0;

  while (counter < 15) {
    res.push(
      {
        'id': counter + 1,
        'title': `Title ${counter}`,
        'avatar': '',
        'clicks': (Math.random() * (1000 - 32) + 32).toFixed(),
        'average': (Math.random() * (1000 - 32) + 32).toFixed()
      }
    )
    counter++;
  }
  return res;
}

const mockTopClubsTile = () => {
  let res = [];
  let counter = 0;

  while (counter < 5) {
    res.push(
      {
        'id': counter + 1,
        'title': `Title ${counter}`,
        'avatar': '',
        'members': (Math.random() * (1000 - 32) + 32).toFixed(),
      }
    )
    counter++;
  }
  return res;
}

