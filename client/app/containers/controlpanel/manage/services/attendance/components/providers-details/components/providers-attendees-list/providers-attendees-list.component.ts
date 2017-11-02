import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ProvidersService } from '../../../../../providers.service';
import { FORMAT } from '../../../../../../../../../shared/pipes/date';
import { BaseComponent } from '../../../../../../../../../base/base.component';
import { createSpreadSheet } from './../../../../../../../../../shared/utils/csv/parser';

import { unix } from 'moment';

interface IState {
  search_text: string;
}

const state: IState = {
  search_text: null
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

  constructor(
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  fetch() {
    let search = new URLSearchParams();
    search.append('search_text', this.state.search_text);
    search.append('service_id', this.serviceId.toString());
    search.append('service_provider_id', this.providerId.toString());

    const stream$ = this
      .providersService
      .getProviderAssessments(this.startRange, this.endRange, search);

    super
      .fetchData(stream$)
      .then(res => {
        this.assessments = res.data;
      })
      .catch(err => { throw new Error(err) });
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

    const stream$ = this
      .providersService
      .getProviderAssessments(this.startRange, this.endRange, search);

    return stream$.toPromise()
  }

  ngOnInit() {
    this.download.subscribe(download => {
      if (download && this.assessments.length) {
        this
          .fetchAllRecords()
          .then(assessments => {
            const columns = [
              'Attendee Name',
              'Email',
              'Average Rating',
              'Feedback',
              'Checked-in Method',
              'Checked-in Time',
            ];

            const check_in_method = {
              1: 'Web check-in',
              3: 'App check-in'
            };

            assessments = assessments.map(item => {
              return {
                'Attendee Name': `${item.firstname} ${item.lastname}`,

                'Email': item.email,

                'Average Rating': item.feedback_rating === -1 ?
                  'N/A' :
                  ((item.feedback_rating / 100) * 5),

                'Feedback': item.feedback_text,

                'Checked-in Method': check_in_method[item.check_in_method],

                'Checked-in Time': unix(item.check_in_time).format('MMMM Do YYYY - h:mm a')
              }
            })

            createSpreadSheet(assessments, columns)
          })
          .catch(_ => console.log('no data'));
        ;
      }
    });

    this.query.subscribe(search_text => {
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
