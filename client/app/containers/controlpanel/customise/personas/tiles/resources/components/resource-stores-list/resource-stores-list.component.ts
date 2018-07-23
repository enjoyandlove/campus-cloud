import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CPI18nService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-resource-stores-list',
  templateUrl: './resource-stores-list.component.html',
  styleUrls: ['./resource-stores-list.component.scss']
})
export class PersonasResourceStoresListComponent implements OnInit {
  @Output() storeListChange = new EventEmitter();

  storeLists;

  constructor(public cpI18n: CPI18nService) {}

  populateDropdowns() {
    this.storeLists = require('./stores-list.json').map((resource) => {
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
