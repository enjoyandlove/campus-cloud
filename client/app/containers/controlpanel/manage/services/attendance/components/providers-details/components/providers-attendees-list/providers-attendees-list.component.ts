import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { CPSession } from './../../../../../../../../../session';
import { ProvidersService } from '../../../../../providers.service';
import { FORMAT } from '../../../../../../../../../shared/pipes/date';
import { CPDate } from './../../../../../../../../../shared/utils/date/date';
import { BaseComponent } from '../../../../../../../../../base/base.component';
import { createSpreadSheet } from './../../../../../../../../../shared/utils/csv/parser';
import { CPI18nService } from './../../../../../../../../../shared/services/i18n.service';

interface IState {
  search_text: string;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  search_text: null,
  sort_field: 'check_in_time',
  sort_direction: 'desc'
};

@Component({
  selector: 'cp-providers-attendees-list',
  templateUrl: './providers-attendees-list.component.html',
  styleUrls: ['./providers-attendees-list.component.scss']
})
export class ServicesProvidersAttendeesListComponent extends BaseComponent implements OnInit {
  @Input() serviceId: number;
  @Input() providerId: number;
  @Input() query: Observable<string>;
  @Input() download: Observable<boolean>;

  loading;
  assessments;
  checkinMethods;
  state: IState = state;
  dateFormat = FORMAT.DATETIME;
  defaultImage = require('public/default/user.png');

  constructor(
    public session: CPSession,
    private cpI18n: CPI18nService,
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('search_text', this.state.search_text);
    search.append('service_id', this.serviceId.toString());
    search.append('service_provider_id', this.providerId.toString());
    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);

    const stream$ = this.providersService.getProviderAssessments(
      this.startRange,
      this.endRange,
      search
    );

    super.fetchData(stream$).then((res) => {
      this.assessments = res.data;
    });
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  fetchAllRecords(): Promise<any> {
    const search = new URLSearchParams();
    search.append('all', '1');
    search.append('service_id', this.serviceId.toString());
    search.append('service_provider_id', this.providerId.toString());

    const stream$ = this.providersService.getProviderAssessments(
      this.startRange,
      this.endRange,
      search
    );

    return stream$.toPromise();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  ngOnInit() {
    this.download.subscribe((download) => {
      if (download && this.assessments.length) {
        this.fetchAllRecords().then((assessments) => {
          const columns = [
            this.cpI18n.translate('services_label_attendee_name'),
            this.cpI18n.translate('email'),
            this.cpI18n.translate('average_rating'),
            this.cpI18n.translate('feedback'),
            this.cpI18n.translate('services_label_checked_in_method'),
            this.cpI18n.translate('services_label_checked_in_time'),
            this.cpI18n.translate('student_id')
          ];

          const check_in_method = {
            1: 'Web check-in',
            3: 'App check-in'
          };

          assessments = assessments.map((item) => {
            return {
              [this.cpI18n.translate('services_label_attendee_name')]: `${item.firstname} ${
                item.lastname
              }`,

              [this.cpI18n.translate('email')]: item.email,

              [this.cpI18n.translate('average_rating')]:
                item.feedback_rating === -1 ? 'N/A' : item.feedback_rating / 100 * 5,

              [this.cpI18n.translate('feedback')]: item.feedback_text,

              [this.cpI18n.translate('services_label_checked_in_method')]: check_in_method[
                item.check_in_method
              ],

              [this.cpI18n.translate('services_label_checked_in_time')]: CPDate.fromEpoch(
                item.check_in_time,
                this.session.tz
              ).format('MMMM Do YYYY - h:mm a'),

              [this.cpI18n.translate('student_id')]: item.student_identifier
            };
          });

          createSpreadSheet(assessments, columns);
        });
      }
    });

    this.query.subscribe((search_text) => {
      this.state = Object.assign({}, this.state, { search_text });
      this.fetch();
    });

    this.checkinMethods = {
      '1': {
        label: 'Web check-in'
      },
      '2': {
        label: 'Web Based QR scan'
      },
      '3': {
        label: 'App check-in'
      }
    };
  }
}
