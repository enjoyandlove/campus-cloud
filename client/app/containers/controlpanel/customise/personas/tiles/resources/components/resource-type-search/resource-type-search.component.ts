import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ISnackbar, SNACKBAR_SHOW } from './../../../../../../../../reducers/snackbar.reducer';
import { TilesService } from './../../../tiles.service';
import { CPSession } from './../../../../../../../../session';
import { StoreService } from '../../../../../../../../shared/services';
import { CPI18nService } from './../../../../../../../../shared/services/i18n.service';

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
  dropdown = true;
  selectedItem = null;
  emptySelection = {
    label: null,
    value: null,
    meta: {
      link_url: null,
      link_params: {}
    }
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public tileService: TilesService,
    public storeService: StoreService
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
    this.items$ = this.tileService
      .getSchoolServices(headers)
      .pipe(
        map((stores) => this.updateValues(stores, 'oohlala://campus_service')),
        catchError(() => this.handleError())
      );
  }

  handleMissingResource() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        autoClose: true,
        class: 'warning',
        body: this.cpI18n.translate('t_personas_edit_missing_resource')
      }
    });

    this.selected.emit(this.emptySelection);
  }

  loadCalendars() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.tileService
      .getSchoolCalendars(headers)
      .pipe(
        map((stores) => this.updateValues(stores, 'oohlala://subscribable_calendar')),
        catchError(() => this.handleError())
      );
  }

  updateValues(items, link_url) {
    const resourceId = this.resource.link_params.id;

    return items.map((item: any) => {
      if (item.value) {
        item = {
          ...item,
          meta: {
            is_system: 1,
            link_params: {
              id: item.value
            },
            open_in_browser: 0,
            link_url
          }
        };

        if (item.value === resourceId) {
          this.selectedItem = item;
        }
      }

      return item;
    });
  }

  loadStores() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.storeService
      .getStores(headers)
      .pipe(
        map((stores) => this.updateValues(stores, 'oohlala://store')),
        catchError(() => this.handleError())
      );
  }

  ngOnInit(): void {}
}
