import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { get as _get } from 'lodash';

import { CustomValidators } from '@shared/validators';
import { ContentUtilsProviders } from '../../providers';
import { CampusLink } from '@controlpanel/manage/links/tile';
import { ILink } from '@controlpanel/manage/links/link.interface';
import { IStudioContentResource } from './../../providers/content.utils.providers';

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
  items: IStudioContentResource[] = [{ id: null, label: '---' }];

  constructor(private contentUtils: ContentUtilsProviders, private fb: FormBuilder) {}

  ngOnInit() {
    const filters = [
      this.filterByWebApp ? ContentUtilsProviders.isWebAppContent : null,
      this.filterByLoginStatus ? ContentUtilsProviders.isLoginRequired : null
    ].filter((f) => f);

    this.resources = ContentUtilsProviders.getResourcesForType(
      ContentUtilsProviders.contentTypes.list,
      filters
    );

    this.items = this.contentUtils.resourcesToIItem(this.resources);

    this.buildForm();
    this.form.valueChanges.subscribe(() => {
      this.valueChanges.emit(this.form.value);
    });

    if (this.isEdit) {
      this.updateState();
    }
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
    this.form = this.fb.group({
      link_url: [
        null,
        Validators.compose([Validators.required, CustomValidators.requiredNonEmpty])
      ],
      link_params: [{}]
    });
  }

  validateLinkParams() {
    const requiresLinkParams = [CampusLink.storeList];

    return this.items
      .filter((i) => i.id)
      .map((i: any) => i.meta)
      .filter((i) => requiresLinkParams.includes(i.link_url));
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
