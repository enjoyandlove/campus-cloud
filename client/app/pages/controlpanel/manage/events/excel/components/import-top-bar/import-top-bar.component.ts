import { Component, OnInit } from '@angular/core';

import { StoreService } from '../../../../../../../shared/services';
import { BaseComponent }  from '../../../../../../../base/base.component';

@Component({
  selector: 'cp-import-top-bar',
  templateUrl: './import-top-bar.component.html',
  styleUrls: ['./import-top-bar.component.scss']
})
export class EventsImportTopBarComponent extends BaseComponent implements OnInit {
  stores;
  loading = true;

  constructor(
    private storeService: StoreService
  ) {
    super();
    this.fetch();
  }

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
      .then(res => this.stores = res )
      .catch(err => console.error(err));
  }

  ngOnInit() { }
}
