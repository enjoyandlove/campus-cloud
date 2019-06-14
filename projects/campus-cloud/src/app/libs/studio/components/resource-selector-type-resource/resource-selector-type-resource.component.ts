import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { get as _get, isEmpty } from 'lodash';

import { IIntegrationData } from '../../models';
import { CustomValidators } from '@shared/validators';
import { ContentUtilsProviders } from '../../providers';
import { CampusLink } from '@controlpanel/manage/links/tile';
import { ILink } from '@controlpanel/manage/links/link.interface';
import { IntegrationDataService, IStudioContentResource } from './../../providers';

@Component({
  selector: 'cp-resource-selector-type-resource',
  templateUrl: './resource-selector-type-resource.component.html',
  styleUrls: ['./resource-selector-type-resource.component.scss'],
  providers: [ContentUtilsProviders]
})
export class ResourceSelectorTypeResourceComponent implements OnInit {
  @Input() isEdit = false;
  @Input() campusLink: ILink;
  @Input() filterByWebApp = false;
  @Input() filterByLoginStatus = false;

  @Output() valueChanges: EventEmitter<any> = new EventEmitter();

  resources = [];
  form: FormGroup;
  selectedItem = null;
  isServiceByCategory = false;
  resourcesWithLinkParamsRequired = [CampusLink.storeList];
  items: IStudioContentResource[] = [{ id: null, label: '---' }];

  constructor(
    private fb: FormBuilder,
    private contentUtils: ContentUtilsProviders,
    private integrationDataService: IntegrationDataService
  ) {}

  ngOnInit() {
    this.integrationDataService.getIntegrationData().subscribe(
      (integrationData: IIntegrationData[]) => {
        this.initResources(integrationData);
      },
      () => {
        this.initResources();
      }
    );

    this.buildForm();
    this.form.valueChanges.subscribe(() => {
      const value = this.form.valid ? this.form.value : { link_url: null };
      this.valueChanges.emit(value);
    });

    if (this.isEdit) {
      this.updateState();
    }
  }

  initResources(integrationData = null) {
    const filters = [
      this.filterByWebApp ? ContentUtilsProviders.isWebAppContent : null,
      this.filterByLoginStatus ? ContentUtilsProviders.isLoginRequired : null,
      integrationData
        ? ContentUtilsProviders.isIntegration(integrationData, this.filterByLoginStatus)
        : null
    ].filter((f) => f);

    this.resources = ContentUtilsProviders.getResourcesForType(
      ContentUtilsProviders.contentTypes.list,
      filters
    );

    this.items = this.contentUtils.resourcesToIItem(this.resources);
  }

  updateState() {
    this.selectedItem = this.items
      .filter((item: IStudioContentResource) => item.meta)
      .find((item: IStudioContentResource) => item.meta.link_url === this.campusLink.link_url);

    const { link_url, link_params } = this.campusLink;
    this.isServiceByCategory = link_url === CampusLink.campusServiceList;

    this.form.patchValue({ link_url, link_params });
  }

  buildForm() {
    this.form = this.fb.group(
      {
        link_url: [
          null,
          Validators.compose([Validators.required, CustomValidators.requiredNonEmpty])
        ],
        link_type: [3],
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
