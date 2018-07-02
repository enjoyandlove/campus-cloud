import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-tile-form-resource-list',
  templateUrl: './form-resource-list.component.html',
  styleUrls: ['./form-resource-list.component.scss']
})
export class PersonasTileFormResourceListComponent implements OnInit {
  @Output() selected: EventEmitter<any> = new EventEmitter();

  resources;
  resourceSelection = null;
  preventEmit = [
    'store',
    'store_list',
    'campus_service',
    'school_campaign',
    'subscribable_calendar'
  ];

  constructor(public cpI18n: CPI18nService) {}

  onResourceSelected(selection) {
    this.resourceSelection = selection.id;

    if (!this.preventEmit.includes(selection.id)) {
      this.selected.emit(selection);
    }
  }

  populateDropdowns() {
    this.resources = require('./resources.json').map((resource) => {
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
