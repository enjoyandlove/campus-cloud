import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CPI18nService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-resource-stores-list',
  templateUrl: './resource-stores-list.component.html',
  styleUrls: ['./resource-stores-list.component.scss']
})
export class PersonasResourceStoresListComponent implements OnInit {
  @Input() category: number;

  @Output() storeListChange = new EventEmitter();

  storeLists;
  selectedItem;

  constructor(public cpI18n: CPI18nService) {}

  populateDropdowns() {
    this.storeLists = require('./stores-list.json').map((resource) => {
      return {
        ...resource,
        label: this.cpI18n.translate(resource.label)
      };
    });

    if (this.category) {
      this.updateState();
    }
  }

  updateState() {
    this.selectedItem = this.storeLists.filter((s) => s.id).filter((s) => {
      const categoryIds = s.meta.link_params.category_ids;

      return categoryIds.includes(this.category[0]) ? s : null;
    })[0];
  }

  ngOnInit(): void {
    this.populateDropdowns();
  }
}
