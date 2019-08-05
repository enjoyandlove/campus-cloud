import { Component, OnInit } from '@angular/core';

import { mockAPIData } from '../tests';
import { BaseComponent } from '@campus-cloud/base';
import { FORMAT } from '@campus-cloud/shared/pipes';

@Component({
  selector: 'cp-api-list',
  templateUrl: './api-list.component.html',
  styleUrls: ['./api-list.component.scss']
})
export class ApiListComponent extends BaseComponent implements OnInit {
  items = mockAPIData;
  dateFormat = FORMAT.SHORT;

  constructor() {
    super();
  }

  onPaginationNext() {
    super.goToNext();
  }

  onPaginationPrevious() {
    super.goToPrevious();
  }

  trackByFn(_, item) {
    return item.id;
  }

  ngOnInit() {}
}
