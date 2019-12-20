import { Input, Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { get as _get, isEmpty, flatten } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { IIntegrationData } from '../../models';
import { CPSession } from '@campus-cloud/session';
import { ContentUtilsProviders } from '../../providers';
import { CustomValidators } from '@campus-cloud/shared/validators';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';
import { ExtraDataType } from './../../models/integration-data.interface';
import { ILink } from '@controlpanel/customise/personas/tiles/link.interface';
import { IntegrationDataService, IStudioContentResource } from './../../providers';
import { TilesUtilsService } from '@controlpanel/customise/personas/tiles/tiles.utils.service';

@Component({
  selector: 'cp-resource-selector-type-resource',
  templateUrl: './resource-selector-type-resource.component.html',
  styleUrls: ['./resource-selector-type-resource.component.scss'],
  providers: [ContentUtilsProviders]
})
export class ResourceSelectorTypeResourceComponent implements OnInit, OnDestroy {
  @Input() isEdit = false;
  @Input() campusLink: ILink;
  @Input() showErrors = false;
  @Input() filterByWebApp = false;
  @Input() filterByLoginStatus = false;

  @Output() valueChanges: EventEmitter<any> = new EventEmitter();

  resources = [];
  form: FormGroup;
  selectedItem = null;
  destroy$ = new Subject();
  isServiceByCategory = false;
  resourcesWithLinkParamsRequired = [CampusLink.storeList];
  items: IStudioContentResource[] = [{ id: null, label: '---' }];

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private contentUtils: ContentUtilsProviders,
    private integrationDataService: IntegrationDataService
  ) {}

  ngOnInit() {
    this.buildForm();

    this.integrationDataService
      .getIntegrationData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (integrationData: IIntegrationData[]) => this.initResources(integrationData),
        () => this.initResources()
      );

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const value = this.form.valid ? this.form.value : { link_url: null };
      this.valueChanges.emit(value);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSchoolIntegrationConfigByIntegrationData(integrationData: any[]) {
    if (!integrationData || !integrationData.length) {
      return {};
    }

    const extraDataTypeConfig: any[] = flatten(integrationData.map((data) => data.extra_data))
      // filter by school id or school id = 0 (all campuses)
      .filter(({ school_id }) => school_id === this.session.school.id || school_id === 0)
      .filter(({ config_data }) => !isEmpty(config_data));

    const result = {};

    extraDataTypeConfig.forEach(({ extra_data_type, config_data }) => {
      result[extra_data_type] = {
        ...config_data
      };
    });

    return result;
  }

  initResources(integrationData = null) {
    let legacyIntegrations = integrationData
      ? integrationData.filter(({ client_int }) => client_int.length)
      : [];
    const schoolIntegrationData = this.getSchoolIntegrationConfigByIntegrationData(integrationData);

    if (legacyIntegrations) {
      legacyIntegrations = legacyIntegrations.map(({ id, integration_name }) => {
        return {
          id,
          meta: {
            link_params: { id },
            link_url: CampusLink.integration
          },
          label: `[NOTRANSLATE]${integration_name}[NOTRANSLATE]`
        };
      });
    }

    const filters = [
      this.filterByWebApp ? ContentUtilsProviders.isWebAppContent : null,
      this.filterByLoginStatus ? ContentUtilsProviders.isPublicContent : null,
      /**
       * Function to filter integrated tiles
       * based on the school's integration_extra_data
       */
      (item: IStudioContentResource) => {
        const extraDataType = _get(item, ['meta', 'extra_data_type'], null);

        if (!extraDataType) {
          return true;
        }

        /**
         * Directory's visibility is controlled
         * by the school's config
         */
        if (extraDataType === ExtraDataType.DIRECTORY && extraDataType in schoolIntegrationData) {
          const loginRequired = _get(
            schoolIntegrationData,
            [ExtraDataType.DIRECTORY, 'client_int', 0, 'request', 'cookies', 'rea.auth'],
            undefined
          );

          return loginRequired ? !this.filterByLoginStatus : true;
        }

        return extraDataType in schoolIntegrationData;
      }
    ].filter((f) => f);

    this.resources = ContentUtilsProviders.getResourcesForType(
      ContentUtilsProviders.contentTypes.list,
      filters
    );

    if (!this.filterByLoginStatus && !this.filterByWebApp && legacyIntegrations) {
      this.resources = [...this.resources, ...legacyIntegrations];
    }
    this.items = this.contentUtils.resourcesToIItem(this.resources);

    this.updateStateWith(this.getInitialFormValues());
  }

  isCampusLinkInList() {
    let linkParamsMatch = true;
    if (!this.campusLink || !this.items.length) {
      return false;
    }

    if (TilesUtilsService.isIntegrationLink(this.campusLink.link_url)) {
      linkParamsMatch = this.items
        .map((i) => _get(i, ['meta', 'link_params', 'id'], null))
        .includes(this.campusLink.link_params.id);
    }

    return (
      this.items.map((i) => i.meta.link_url).includes(this.campusLink.link_url) && linkParamsMatch
    );
  }

  getInitialFormValues() {
    if (this.isEdit && this.isCampusLinkInList()) {
      const { link_url, link_type, link_params } = this.campusLink;

      return {
        link_url,
        link_type,
        link_params
      };
    } else {
      const link_type = this.form.get('link_type').value;
      const { link_url, link_params } = this.items[0].meta;
      return {
        link_url,
        link_type,
        link_params
      };
    }
  }

  updateStateWith({ link_url, link_type, link_params }) {
    this.selectedItem = ContentUtilsProviders.getResourceType(
      { link_url, link_params },
      this.items
    );

    this.isServiceByCategory = link_url === CampusLink.campusServiceList;
    this.form.patchValue({ link_type, link_url, link_params });
  }

  buildForm() {
    this.form = this.fb.group(
      {
        link_url: [
          null,
          Validators.compose([Validators.required, CustomValidators.requiredNonEmpty])
        ],
        link_type: [CampusLink.linkType.inAppLink],
        link_params: [{}]
      },
      { validators: this.customLinkParamsValidator.bind(this) }
    );
  }

  customLinkParamsValidator(control: FormControl) {
    const linkUrl = control.get('link_url').value;
    const linkParams = control.get('link_params').value;

    if (this.resourcesWithLinkParamsRequired.includes(linkUrl)) {
      return isEmpty(linkParams) ? { required: true } : null;
    }

    return null;
  }

  onService({ link_params }) {
    this.form.patchValue({ link_params });
  }

  onSelected(selection) {
    const linkUrl = _get(selection, ['meta', 'link_url'], '');
    this.isServiceByCategory = linkUrl === CampusLink.campusServiceList;

    if (!selection.id) {
      this.form.patchValue({
        link_url: '',
        link_params: {}
      });
    } else {
      this.form.patchValue({
        link_url: selection.meta.link_url,
        link_params: selection.meta.link_params
      });
    }
  }
}
