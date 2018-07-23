import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { sortBy } from 'lodash';
import { CPI18nService } from '../../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-resource-types',
  templateUrl: './resource-types.component.html',
  styleUrls: ['./resource-types.component.scss']
})
export class PersonasResourceTypesComponent implements OnInit {
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() linkUrl: EventEmitter<string> = new EventEmitter();

  resources;
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
  }

  ngOnInit(): void {
    this.populateDropdowns();
  }
}
