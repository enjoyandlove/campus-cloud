import { Component, OnInit, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ProvidersService } from '../../../providers.service';
import { BaseComponent } from '../../../../../../../base/base.component';
import { createSpreadSheet } from './../../../../../../../shared/utils/csv/parser';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

interface IState {
  search_text: string;
  providers: Array<any>;
}

const state: IState = {
  providers: [],
  search_text: null
};

@Component({
  selector: 'cp-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss']
})
export class ServicesProvidersListComponent extends BaseComponent implements OnInit {
  @Input() serviceId: number;
  @Input() query: Observable<string>;
  @Input() reload: Observable<boolean>;
  @Input() download: Observable<boolean>;
  @Input() serviceWithFeedback: Observable<boolean>;
  @Output() providersLength$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  loading;
  deleteProvider = '';
  state: IState = state;
  displayRatingColumn = true;

  constructor(
    private cpI18n: CPI18nService,
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('search_text', this.state.search_text );
    search.append('service_id', this.serviceId.toString());

    super
      .fetchData(this.providersService.getProviders(this.startRange, this.endRange, search))
      .then(res => {
        this.state = Object.assign({}, this.state, { providers: res.data });
        this.providersLength$.next(res.data.length > 0);
      })
      .catch(_ => {});
  }

  onDeleted(providerId) {
    this.state = Object.assign(
      {},
      this.state,
      { providers: this.state.providers.filter(provider => provider.id !== providerId) }
    );
  }

  ngOnInit() {
    this.serviceWithFeedback.subscribe(withRating => this.displayRatingColumn = withRating);

    this.query.subscribe(search_text => {
      this.state = Object.assign({}, this.state, { search_text });
      this.fetch();
    });

    this.reload.subscribe(reload => {
      if (reload) {
        this.fetch();
      }
    });

    this.download.subscribe(download => {
      if (download) {
        const search = new URLSearchParams();
        search.append('service_id', this.serviceId.toString());
        search.append('all', '1');

        const stream$ = this.providersService.getProviders(this.startRange, this.endRange, search);

        stream$.toPromise().then(providers => {
          const columns = [
            this.cpI18n.translate('service_provider'),
            this.cpI18n.translate('email'),
            this.cpI18n.translate('average_rating'),
            this.cpI18n.translate('total_ratings'),
            this.cpI18n.translate('services_total_visits'),
            this.cpI18n.translate('student_id')
          ];

          providers = providers.map(data => {
            return {
              [this.cpI18n.translate('service_provider')]: data.provider_name,

              [this.cpI18n.translate('email')]: data.email,

              [this.cpI18n.translate('average_rating')]:
                ((data.avg_rating_percent * 5) / 100).toFixed(1),

              [this.cpI18n.translate('total_ratings')]: data.num_ratings,

              [this.cpI18n.translate('services_total_visits')]: data.total_visits,

              [this.cpI18n.translate('student_id')]: data.student_identifier
            }
          })

          createSpreadSheet(providers, columns, 'providers_data');
        });
      }
    });

    this.fetch();
  }
}
