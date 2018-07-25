import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CPSession } from './../../../../../../../../session';
import { TilesService } from './../../../tiles.service';
import { StoreService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-resource-type-search',
  templateUrl: './resource-type-search.component.html',
  styleUrls: ['./resource-type-search.component.scss']
})
export class PersonasResourceTypeSearchComponent implements OnInit {
  @Input() resource;

  @Input()
  set resourceId(resourceId) {
    this.doReset();
    this.loadItemsByResourceId(resourceId);
  }

  @Output() selected: EventEmitter<any> = new EventEmitter();

  items$;
  selectedItem;
  dropdown = true;

  constructor(
    public storeService: StoreService,
    public session: CPSession,
    public tileService: TilesService
  ) {}

  doReset() {
    this.items$ = of([{ label: '---' }]);
  }

  loadItemsByResourceId(resourceId) {
    if (resourceId === 'campus_service') {
      this.loadServices();
    } else if (resourceId === 'subscribable_calendar') {
      this.loadCalendars();
    } else {
      this.loadStores();
    }
  }

  handleError() {
    return (this.items$ = of([{ label: 'ERROR' }]));
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
      map(this.updateSelectedItem.bind(this)),
      catchError(() => this.handleError())
    );
  }

  updateSelectedItem(items) {
    if (this.resource) {
      const resourceId = this.resource.link_params.id;
      this.selectedItem = items.filter((c) => c.value === resourceId)[0];
    }

    return items;
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
      map(this.updateSelectedItem.bind(this)),
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
      }),
      map(this.updateSelectedItem.bind(this)),
      catchError(() => this.handleError())
    );
  }

  ngOnInit(): void {}
}
