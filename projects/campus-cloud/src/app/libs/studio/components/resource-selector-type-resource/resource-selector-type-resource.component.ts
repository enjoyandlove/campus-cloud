import { Input, Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { get as _get, isEmpty, isEqual } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { IIntegrationData } from '../../models';
import { ContentUtilsProviders } from '../../providers';
import { CustomValidators } from '@campus-cloud/shared/validators';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';
import { ILink } from '@controlpanel/customise/personas/tiles/link.interface';
import { IntegrationDataService, IStudioContentResource } from './../../providers';

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

    this.form.valueChanges.subscribe(() => {
      const value = this.form.valid ? this.form.value : { link_url: null };
      this.valueChanges.emit(value);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initResources(integrationData = null) {
    const filters = [
      this.filterByWebApp ? ContentUtilsProviders.isWebAppContent : null,
      this.filterByLoginStatus ? ContentUtilsProviders.isPublicContent : null,
      integrationData
        ? ContentUtilsProviders.isIntegration(integrationData, this.filterByLoginStatus)
        : null
    ].filter((f) => f);

    this.resources = ContentUtilsProviders.getResourcesForType(
      ContentUtilsProviders.contentTypes.list,
      filters
    );

    this.items = this.contentUtils.resourcesToIItem(this.resources);

    this.updateStateWith(this.getInitialFormValues());
  }

  isCampusLinkInList() {
    if (!this.campusLink || !this.items.length) {
      return false;
    }

    return this.items.map((i) => i.meta.link_url).includes(this.campusLink.link_url);
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
    /**
     * check all available resources, if link_params is
     * not empty, then ensure both link_url and link_params match
     * (Athletics and Clubs have the same link_url but different link_params)
     * else just check the link url matches
     */
    this.selectedItem = this.items
      .filter((item: IStudioContentResource) => item.meta)
      .find((item: IStudioContentResource) =>
        isEmpty(item.meta.link_params)
          ? item.meta.link_url === link_url
          : item.meta.link_url === link_url && isEqual(item.meta.link_params, link_params)
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
