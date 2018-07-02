import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CP_TRACK_TO } from './../../../../../../../shared/directives/tracking/tracking.directive';
import { ServicesService } from './../../../services.service';
import { BaseComponent } from '../../../../../../../base/base.component';
import { HEADER_UPDATE, IHeader } from '../../../../../../../reducers/header.reducer';
import { STAR_SIZE } from '../../../../../../../shared/components/cp-stars';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { ProvidersService } from '../../../providers.service';

@Component({
  selector: 'cp-providers-details',
  templateUrl: './providers-details.component.html',
  styleUrls: ['./providers-details.component.scss']
})
export class ServicesProviderDetailsComponent extends BaseComponent implements OnInit {
  loading;
  provider;
  serviceId;
  providerId;
  MAX_RATE = 5;
  eventRating;
  serviceName: string;
  starSize = STAR_SIZE.LARGE;
  query$: BehaviorSubject<string> = new BehaviorSubject(null);
  download$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    private serviceService: ServicesService,
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
    this.providerId = this.route.snapshot.params['providerId'];
    this.serviceId = this.route.snapshot.params['serviceId'];
  }

  private fetch() {
    const search = new HttpParams().append('service_id', this.serviceId);

    const service$ = this.serviceService.getServiceById(this.serviceId);
    const providers$ = this.providersService.getProviderByProviderId(this.providerId, search);

    const stream$ = service$.pipe(
      switchMap((service: any) => {
        this.serviceName = service.name;

        return providers$;
      })
    );

    super.fetchData(stream$).then((res) => {
      this.provider = res.data;
      this.eventRating = (this.provider.avg_rating_percent * this.MAX_RATE / 100).toFixed(1);

      this.buildHeader();
    });
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${this.provider.provider_name}[NOTRANSLATE]`,
        crumbs: {
          url: `services/${this.serviceId}`,
          label: `[NOTRANSLATE]${this.serviceName}[NOTRANSLATE]`
        },
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  trackCheckinEvent(service_id) {
    const eventProperties = {
      service_id,
      source_page: amplitudeEvents.SERVICE
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.MANAGE_CLICKED_CHECKIN,
      eventProperties
    };
  }

  ngOnInit() {
    this.fetch();
  }
}
