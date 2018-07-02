import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CPSession } from './../../../../../../../session';
import { TilesService } from './../../tiles.service';
import { StoreService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-forms-type-search',
  templateUrl: './forms-type-search.component.html',
  styleUrls: ['./forms-type-search.component.scss']
})
export class PersonasTileFormTypeSearchComponent implements OnInit {
  @Input()
  set resourceId(resourceId) {
    this.doReset();
    this.loadItemsByResourceId(resourceId);
    this.dropdown = resourceId !== 'service_by_category_id';
  }

  @Output() selected: EventEmitter<any> = new EventEmitter();

  items$;
  dropdown = true;

  constructor(
    public storeService: StoreService,
    public session: CPSession,
    public tileService: TilesService
  ) {}

  onMultiSelect(selection) {
    this.selected.emit({
      meta: {
        is_system: 1,
        link_params: {
          category_ids: [...selection]
        },
        open_in_browser: 0,
        link_url: 'oohlala://campus_service_list'
      }
    });
  }

  doReset() {
    this.items$ = of([{ label: '---' }]);
  }

  loadItemsByResourceId(resourceId) {
    if (resourceId === 'school_campaign') {
      this.loadCampaigns();
    } else if (resourceId === 'campus_service') {
      this.loadServices();
    } else if (resourceId === 'subscribable_calendar') {
      this.loadCalendars();
    } else if (resourceId === 'service_by_category_id') {
      this.loadCategories();
    } else {
      this.loadStores();
    }
  }

  handleError() {
    return (this.items$ = of([{ label: 'ERROR' }]));
  }

  loadCategories() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.tileService.getServiceCategories(headers);
  }

  loadServices() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.tileService.getSchoolServices(headers).pipe(
      map((services) => {
        return services.map((service: any) => {
          return service.value
            ? {
                ...service,
                meta: {
                  is_system: 1,
                  link_params: {
                    id: service.value
                  },
                  open_in_browser: 0,
                  link_url: 'oohlala://campus_service'
                }
              }
            : service;
        });
      }),
      catchError(() => this.handleError())
    );
  }

  loadCampaigns() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.tileService.getSchoolCampaigns(headers).pipe(
      map((campaigns) => {
        return campaigns.map((campaign: any) => {
          return campaign.value
            ? {
                ...campaign,
                meta: {
                  is_system: 1,
                  link_params: {
                    id: campaign.value
                  },
                  open_in_browser: 0,
                  link_url: 'oohlala://school_campaign'
                }
              }
            : campaign;
        });
      }),
      catchError(() => this.handleError())
    );
  }

  loadCalendars() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.tileService.getSchoolCalendars(headers).pipe(
      map((calendars) => {
        return calendars.map((calendar: any) => {
          return calendar.value
            ? {
                ...calendar,
                meta: {
                  is_system: 1,
                  link_params: {
                    id: calendar.value
                  },
                  open_in_browser: 0,
                  link_url: 'oohlala://subscribable_calendar'
                }
              }
            : calendar;
        });
      }),
      catchError(() => this.handleError())
    );
  }

  loadStores() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.storeService.getStores(headers).pipe(
      map((stores) => {
        return stores.map((store: any) => {
          return store.value
            ? {
                ...store,
                meta: {
                  is_system: 1,
                  link_params: {
                    id: store.value
                  },
                  open_in_browser: 0,
                  link_url: 'oohlala://store'
                }
              }
            : store;
        });
      })
    );
  }

  ngOnInit(): void {}
}
