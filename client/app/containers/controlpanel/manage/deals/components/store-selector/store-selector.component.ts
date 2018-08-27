import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DealsService } from '../../deals.service';
import { BaseComponent } from '../../../../../../base';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'cp-store-selector',
  templateUrl: './store-selector.component.html',
  styleUrls: ['./store-selector.component.scss']
})
export class StoreSelectorComponent extends BaseComponent implements OnInit {
  @Input() form: FormGroup;

  stores$;
  selectedStore;

  constructor(public service: DealsService) {
    super();
  }

  onSelectedStore(store_id) {
    this.form.controls['store_id'].setValue(store_id);
  }

  getSelectedStore(stores) {
    const store_id = this.form.controls['store_id'].value;
    if (store_id) {
      this.selectedStore = stores.filter((store) => store.action === store_id)[0];
    }
  }

  ngOnInit() {
    this.stores$ = this.service.getDealStores('select').pipe(
      tap((stores) => this.getSelectedStore(stores))
    );
  }
}
