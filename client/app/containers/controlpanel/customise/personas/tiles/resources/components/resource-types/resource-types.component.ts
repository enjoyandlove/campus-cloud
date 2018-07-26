import { ILink } from './../../../../../../manage/links/link.interface';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { sortBy } from 'lodash';
import { CPI18nService } from '../../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-resource-types',
  templateUrl: './resource-types.component.html',
  styleUrls: ['./resource-types.component.scss']
})
export class PersonasResourceTypesComponent implements OnInit {
  @Input() resource;

  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() linkUrl: EventEmitter<string> = new EventEmitter();

  resources;
  selectedItem = null;
  resourceSelection = null;
  preventEmit = [
    'store',
    'store_list',
    'campus_service',
    'subscribable_calendar',
    'service_by_category_id'
  ];

  textInputComponent = ['web_link', 'external_link'];

  typeSearchComponent = ['store', 'campus_service', 'subscribable_calendar'];

  constructor(public cpI18n: CPI18nService) {}

  onUrlChange(url) {
    this.linkUrl.emit(url);
  }

  onResourceSelected(selection) {
    this.resourceSelection = selection.id;

    if (!this.preventEmit.includes(selection.id)) {
      this.selected.emit(selection);
    }
  }

  // isUrlType(resource: ILink) {
  //   return resource.link_url ==
  // }

  populateDropdowns() {
    const resources = require('./resources.json');
    const sortedResources = sortBy(resources.slice(1, resources.length), (r: any) => r.id);
    const updatedResources = [resources[0], ...sortedResources];

    this.resources = updatedResources.map((resource) => {
      return {
        ...resource,
        label: this.cpI18n.translate(resource.label)
      };
    });
    console.log(this.resource);
    if (this.resource.link_url) {
      const isURLType = Object.keys(this.resource.link_params).length === 0;

      if (isURLType) {
        this.selectedItem = this.resources.filter((r) => {
          if (this.resource.open_in_browser) {
            return r.id === 'external_link';
          }

          return r.id === 'web_link';
        })[0];
      } else {
        this.selectedItem = this.resources.filter(
          (r) => r.meta.link_url === this.resource.link_url
        )[0];
      }
      this.resourceSelection = this.selectedItem.id;
    }
  }

  ngOnInit(): void {
    this.populateDropdowns();
  }
}
