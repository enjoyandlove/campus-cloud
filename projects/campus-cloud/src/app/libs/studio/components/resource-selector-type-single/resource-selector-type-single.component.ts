import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { of, BehaviorSubject, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import { CPSession } from '@campus-cloud/session';
import { IItem } from '@campus-cloud/shared/components';
import { ContentUtilsProviders } from '../../providers';
import { IStudioContentResource } from '../../providers';
import { CampusLink } from '@controlpanel/manage/links/tile';
import { StoreService } from '@campus-cloud/shared/services';
import { ILink } from '@controlpanel/manage/links/link.interface';
import { TilesService } from '@controlpanel/customise/personas/tiles/tiles.service';

const placeHolder: IStudioContentResource = { id: null, label: '---', meta: null };

const linkUrlToIdMap = {
  [CampusLink.store]: 'store',
  [CampusLink.campusService]: 'campus_service',
  [CampusLink.subscribableCalendar]: 'subscribable_calendar'
};

@Component({
  selector: 'cp-resource-selector-type-single',
  templateUrl: './resource-selector-type-single.component.html',
  styleUrls: ['./resource-selector-type-single.component.scss'],
  providers: [ContentUtilsProviders, TilesService]
})
export class ResourceSelectorTypeSingleComponent implements OnInit {
  @Input() isEdit = false;
  @Input() campusLink: ILink;
  @Input() filterByWebApp = false;
  @Input() filterByLoginStatus = false;

  @Output() valueChanges: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  storesByType = {};
  selectedType = null;
  selectedStore = null;
  currentlyViewing = null;

  resources = [];
  items = [placeHolder];
  resetHosts$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private tileService: TilesService,
    private storeService: StoreService,
    private contentUtils: ContentUtilsProviders
  ) {}

  get defaultHeaders(): HttpParams {
    return new HttpParams().set('school_id', String(this.session.school.id));
  }

  buildForm() {
    this.form = this.fb.group({
      link_type: [3],
      link_url: [null, Validators.required],
      link_params: [null, Validators.required]
    });
  }

  getStoresBySelection() {
    if (!this.currentlyViewing || !this.storesByType || isEmpty(this.storesByType)) {
      return [placeHolder];
    }
    return this.storesByType[this.currentlyViewing];
  }

  onHostSelected(selection) {
    if (!selection.meta) {
      this.form.patchValue({
        link_url: null,
        link_params: null
      });
    } else {
      const { link_url, link_params } = selection.meta;

      this.form.patchValue({
        link_url,
        link_params
      });
    }
  }

  updateState() {
    const contentId = linkUrlToIdMap[this.campusLink.link_url];
    this.selectedType = this.items.find((i: IStudioContentResource) => i.id === contentId);
    this.currentlyViewing = contentId;
  }

  ngOnInit() {
    const filters = [
      this.filterByWebApp ? ContentUtilsProviders.isWebAppContent : null,
      this.filterByLoginStatus ? ContentUtilsProviders.isPublicContent : null
    ].filter((f) => f);

    forkJoin([this.loadCalendars(), this.loadServices(), this.loadStores()]).subscribe(
      ([calendars, services, stores]) => {
        this.storesByType['subscribable_calendar'] = calendars;
        this.storesByType['campus_service'] = services;
        this.storesByType['store'] = stores;

        this.resources = ContentUtilsProviders.getResourcesForType(
          ContentUtilsProviders.contentTypes.single,
          filters
        );

        this.items = this.contentUtils.resourcesToIItem(this.resources);

        if (this.isEdit) {
          this.updateState();
        }
      },
      () => {
        this.storesByType = {
          subscribable_calendar: [],
          campus_service: [],
          store: []
        };
      }
    );

    this.buildForm();
    this.form.valueChanges.subscribe(() => {
      const value = this.form.valid ? this.form.value : { link_url: null };
      this.valueChanges.emit(value);
    });
  }

  onItemClicked(selection) {
    this.resetHosts$.next(true);
    this.currentlyViewing = selection.id;

    this.currentlyViewing = selection.id;
    const linkUrl = selection.id ? selection.meta.link_url : null;

    this.form.patchValue({
      link_url: linkUrl
    });
  }

  handleError(err: HttpErrorResponse) {
    const label = err.status === 403 ? '---' : 'Error';
    return of([{ ...placeHolder, label }]);
  }

  loadServices() {
    const headers = this.defaultHeaders;
    return this.tileService.getSchoolServices(headers).pipe(
      map((stores) => this.updateValues(stores, CampusLink.campusService)),
      catchError((err) => this.handleError(err))
    );
  }

  loadCalendars() {
    const headers = this.defaultHeaders;
    return this.tileService.getSchoolCalendars(headers).pipe(
      map((stores) => this.updateValues(stores, CampusLink.subscribableCalendar)),
      catchError((err) => this.handleError(err))
    );
  }

  loadStores() {
    const headers = this.defaultHeaders;
    return this.storeService.getStores(headers).pipe(
      map((stores) =>
        stores.map((s) => {
          return s.value
            ? {
                ...s,
                action: s.value
              }
            : s;
        })
      ),
      map((stores) => this.updateValues(stores, CampusLink.store)),
      catchError((err) => this.handleError(err))
    );
  }

  updateValues(items, link_url) {
    const resourceId = this.isEdit ? this.campusLink.link_params.id : null;

    if (!items.length) {
      return [placeHolder];
    }

    let _item = {};

    return items.map((item: IItem) => {
      _item = {
        ...item
      };

      if (item.action) {
        _item = {
          ...item,
          meta: {
            link_params: {
              id: item.action
            },
            link_url
          }
        };

        if (item.action === resourceId) {
          this.selectedStore = _item;
        }
      }

      return _item;
    });
  }
}
