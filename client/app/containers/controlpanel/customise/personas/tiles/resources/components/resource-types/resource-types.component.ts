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
  @Input() editView;

  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() linkUrl: EventEmitter<string> = new EventEmitter();

  resources;
  selectedItem = null;
  resourceSelection = null;

  textInputComponent = ['web_link', 'external_link'];

  typeSearchComponent = ['store', 'campus_service', 'subscribable_calendar'];

  constructor(public cpI18n: CPI18nService) {}

  onUrlChange(url) {
    this.linkUrl.emit(url);
  }

  onResourceSelected(selection) {
    this.resourceSelection = selection.id;

    this.selected.emit(selection);
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

    if (this.editView) {
      this.updateState();
    }
  }

  isTypeUrl(link_url: string) {
    return link_url ? link_url.startsWith('http') : false;
  }

  setUrlType() {
    const urlIds = ['web_link', 'external_link'];

    return this.resources
      .filter((r) => urlIds.includes(r.id))
      .filter((r) => !!r.meta.open_in_browser === this.resource.open_in_browser)
      .map((r) => r.id)[0];
  }

  setGeneralType() {
    return this.resources
      .filter((r) => r.meta.link_url === this.resource.link_url)
      .map((r) => r.id)[0];
  }

  updateResourceType() {
    this.selectedItem = this.resources.filter((r) => r.id === this.resourceSelection)[0];
  }

  updateState() {
    const isTypeUrl = this.isTypeUrl(this.resource.link_url);
    this.resourceSelection = isTypeUrl ? this.setUrlType() : this.setGeneralType();

    this.updateResourceType();
  }

  ngOnInit(): void {
    this.populateDropdowns();
  }
}
