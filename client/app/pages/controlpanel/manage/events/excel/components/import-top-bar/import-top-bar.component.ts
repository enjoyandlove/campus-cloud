import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { StoreService } from '../../../../../../../shared/services';
import { BaseComponent } from '../../../../../../../base/base.component';

@Component({
  selector: 'cp-import-top-bar',
  templateUrl: './import-top-bar.component.html',
  styleUrls: ['./import-top-bar.component.scss']
})
export class EventsImportTopBarComponent extends BaseComponent implements OnInit {
  @Output() bulkChange: EventEmitter<any> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() checkAll: EventEmitter<boolean> = new EventEmitter();
  @Output() hostChange: EventEmitter<number> = new EventEmitter();
  @Output() imageChange: EventEmitter<string> = new EventEmitter();

  stores;
  loading = true;

  constructor(
    private storeService: StoreService
  ) {
    super();
    this.fetch();
  }

  // onCheckBoxToggle(checked) {
  //   this.checkAll.emit(checked);
  // }

  // onHostChange(host) {
  //   this.hostChange.emit(host.action);
  // }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    const stores$ = this.storeService.getStores().map(res => {
      const stores = [
        {
          'label': 'Host Name',
          'action': null
        }
      ];

      res.forEach(store => {
        stores.push({
          'label': store.name,
          'action': store.id
        });
      });
      return stores;
    });

    super
      .fetchData(stores$)
      .then(res => this.stores = res)
      .catch(err => console.error(err));
  }

  // onBulkAction(actions) {
  //   this.bulkChange.emit(actions);
  // }

  ngOnInit() { }
}
