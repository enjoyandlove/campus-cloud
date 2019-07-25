import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { of, BehaviorSubject, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { CPSession } from '@campus-cloud/session';
import { IItem } from '@campus-cloud/shared/components';
import { ContentUtilsProviders } from '../../providers';
import { IStudioContentResource } from '../../providers';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';
import { StoreService, CPI18nService } from '@campus-cloud/shared/services';
import { ILink } from '@controlpanel/customise/personas/tiles/link.interface';
import { TilesService } from '@controlpanel/customise/personas/tiles/tiles.service';

const placeHolder: IStudioContentResource = { id: null, label: '', meta: null };

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
  @Input() showErrors = false;
  @Input() filterByWebApp = false;
  @Input() filterByLoginStatus = false;

  @Output() valueChanges: EventEmitter<any> = new EventEmitter();

  storesByType = {};
  selectedType = null;
  selectedStore = null;
  subMenuOptions = [placeHolder];
  form: FormGroup = this.buildForm();

  resources = [];
  items = [
    { id: null, label: this.cpI18n.translate('t_shared_loading'), meta: null }
  ] as IStudioContentResource[];
  resetHosts$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private tileService: TilesService,
    private storeService: StoreService,
    private contentUtils: ContentUtilsProviders
  ) {}

  get defaultHeaders(): HttpParams {
    return new HttpParams().set('school_id', String(this.session.school.id));
  }

  buildForm() {
    return this.fb.group({
      link_type: [CampusLink.linkType.inAppLink],
      link_url: [null, Validators.required],
      link_params: [null, Validators.required]
    });
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

  updateStateWith({ link_url, link_type, link_params }) {
    const contentId = linkUrlToIdMap[link_url];
    this.selectedType = this.items.find((i: IStudioContentResource) => i.id === contentId);
    this.subMenuOptions = this.storesByType[contentId];

    this.form.patchValue({
      link_type: link_type,
      link_url: link_url,
      link_params: this.selectedStore ? link_params : null
    });
  }

  isCampusLinkInList() {
    if (!this.campusLink || !this.items.length) {
      return false;
    }
    return ContentUtilsProviders.getResourceItemByLinkUrl(this.items, this.campusLink.link_url);
  }

  getInitialFormValues() {
    if (this.isEdit && this.isCampusLinkInList()) {
      const { link_url, link_type, link_params } = this.campusLink;
      return { link_url, link_type, link_params };
    } else {
      const link_type = this.form.get('link_type').value;
      const { link_url, link_params } = this.items[0].meta;
      return { link_url, link_type, link_params };
    }
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

        this.updateStateWith(this.getInitialFormValues());
      },
      () => {
        this.storesByType = {
          subscribable_calendar: [],
          campus_service: [],
          store: []
        };
      }
    );
    this.form.valueChanges.subscribe(() => {
      const value = this.form.valid ? this.form.value : { ...this.form.value, link_url: null };
      this.valueChanges.emit(value);
    });
  }

  onItemClicked(selection) {
    this.resetHosts$.next(true);
    this.subMenuOptions = this.storesByType[selection.id];
    this.selectedStore = this.subMenuOptions[0];
    const linkUrl = selection.id ? selection.meta.link_url : null;

    this.form.patchValue({
      link_url: linkUrl
    });
  }

  handleError(err: HttpErrorResponse) {
    const label = err.status === 403 ? '---' : this.cpI18n.translate('t_shared_error');
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
    return this.storeService
      .getStores(headers, {
        label: this.cpI18n.translate('t_shared_select_group_and_club'),
        value: null,
        heading: true
      })
      .pipe(
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
