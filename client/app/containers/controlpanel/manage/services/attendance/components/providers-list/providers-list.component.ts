import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { createSpreadSheet } from './../../../../../../../shared/utils/csv/parser';
import { BaseComponent } from '../../../../../../../base/base.component';
import { ProvidersService } from '../../../providers.service';

interface IState {
  search_text: string;
  providers: Array<any>;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  providers: [],
  search_text: null,
  sort_direction: 'asc',
  sort_field: 'provider_name'
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
  sortingLabels;
  deleteProvider = '';
  state: IState = state;
  displayRatingColumn = true;

  constructor(private cpI18n: CPI18nService, private providersService: ProvidersService) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };
    this.fetch();
  }

  private fetch() {
    const search = new HttpParams()
      .append('search_text', this.state.search_text)
      .append('service_id', this.serviceId.toString())
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction);

    super
      .fetchData(this.providersService.getProviders(this.startRange, this.endRange, search))
      .then((res) => {
        this.state = Object.assign({}, this.state, { providers: res.data });
        this.providersLength$.next(res.data.length > 0);
      })
      .catch((_) => {});
  }

  onDeleted(providerId) {
    this.state = Object.assign({}, this.state, {
      providers: this.state.providers.filter((provider) => provider.id !== providerId)
    });
  }

  ngOnInit() {
    this.serviceWithFeedback.subscribe((withRating) => (this.displayRatingColumn = withRating));

    this.query.subscribe((search_text) => {
      this.state = Object.assign({}, this.state, { search_text });
      this.fetch();
    });

    this.reload.subscribe((reload) => {
      if (reload) {
        this.fetch();
      }
    });

    this.download.subscribe((download) => {
      if (download) {
        const search = new HttpParams()
          .append('service_id', this.serviceId.toString())
          .append('all', '1');

        const stream$ = this.providersService.getProviders(this.startRange, this.endRange, search);

        stream$.toPromise().then((providers: any) => {
          const columns = [
            this.cpI18n.translate('service_provider'),
            this.cpI18n.translate('email'),
            this.cpI18n.translate('average_rating'),
            this.cpI18n.translate('total_ratings'),
            this.cpI18n.translate('services_total_visits')
          ];

          providers = providers.map((data) => {
            return {
              [this.cpI18n.translate('service_provider')]: data.provider_name,

              [this.cpI18n.translate('email')]: data.email,

              [this.cpI18n.translate('average_rating')]: (
                data.avg_rating_percent *
                5 /
                100
              ).toFixed(1),

              [this.cpI18n.translate('total_ratings')]: data.num_ratings,

              [this.cpI18n.translate('services_total_visits')]: data.total_visits
            };
          });

          createSpreadSheet(providers, columns, 'providers_data');
        });
      }
    });

    this.fetch();

    this.sortingLabels = {
      rating: this.cpI18n.translate('rating'),
      provider_name: this.cpI18n.translate('service_provider')
    };
  }
}
