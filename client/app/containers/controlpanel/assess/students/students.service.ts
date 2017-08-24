import { Observable } from 'rxjs/Observable';
import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class StudentsService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, StudentsService.prototype);
  }

  getLists(search: URLSearchParams, startRange: number, endRange: number) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  postAnnouncements(search: URLSearchParams, body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ANNOUNCEMENT}/`;

    return super.post(url, body, { search }).map(res => res.json());
  }

  getEngagements(search: URLSearchParams, startRange: number, endRange: number) {
    console.log(search, startRange, endRange);

    return Observable.of(
      [
        {
          epoch_time: 1503251662,
          is_event: true,
          title: 'Title 1',
          avg_rating_percent: 86,
          rating_scale_maximum: 5,
          feedback_text: 'More Text here'
        },
        {
          epoch_time: 1503251962,
          is_event: false,
          title: 'Title 2',
          avg_rating_percent: 30,
          rating_scale_maximum: 5,
          feedback_text: 'More Text here'
        },
        {
          epoch_time: 1503337756,
          is_event: false,
          title: 'Title 3',
          avg_rating_percent: 80,
          rating_scale_maximum: 5,
          feedback_text: 'pretty good watermelon'
        },
        {
          epoch_time: 1503582197,
          is_event: false,
          title: 'Title 5',
          avg_rating_percent: 73,
          rating_scale_maximum: 5,
          feedback_text: 'More Text here'
        },
        {
          epoch_time: 1503587197,
          is_event: true,
          title: 'Title 6',
          avg_rating_percent: 55,
          rating_scale_maximum: 5,
          feedback_text: 'More Text here'
        },
        {
          epoch_time: 1503587297,
          is_event: true,
          title: 'Title 7',
          avg_rating_percent: 100,
          rating_scale_maximum: 5,
          feedback_text: 'More Text here'
        }
      ]
    ).delay(1000);
  }

  getStudentsByList(search: URLSearchParams, startRange: number, endRange: number) {
    console.log(search, startRange, endRange);

    return Observable.of([
      {
        id: 16776,
        first_name: 'Andres',
        last_name: 'Roget',
        last_seven_days: {
          events: 8,
          services: 12
        },
        last_engagement: 1503083192
      },
      {
        id: 16776,
        first_name: 'Anas',
        last_name: 'Al-Khatib',
        last_seven_days: {
          events: 3,
          services: 0
        },
        last_engagement: 1503083268
      }
    ])
      .delay(1200);
  }
}
