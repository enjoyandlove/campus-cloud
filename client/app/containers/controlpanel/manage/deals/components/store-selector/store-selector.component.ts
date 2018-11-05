import { Component, Input, OnInit } from '@angular/core';
import { tap, startWith, map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { DealsService } from '../../deals.service';
import { BaseComponent } from '../../../../../../base';
import * as fromDeals from '../../../../../../store/manage';
import { CPI18nService } from '../../../../../../shared/services';

@Component({
  selector: 'cp-store-selector',
  templateUrl: './store-selector.component.html',
  styleUrls: ['./store-selector.component.scss']
})
export class StoreSelectorComponent extends BaseComponent implements OnInit {
  @Input() form: FormGroup;

  stores$;
  selectedStore;

  constructor(
    public cpI18n: CPI18nService,
    public service: DealsService,
    private store: Store<fromDeals.IDealsState>
  ) {
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
    const dropdownLabel = this.cpI18n.translate('t_deals_list_dropdown_label_select_store');
    this.stores$ = this.store
      .select(fromDeals.getDealsStores)
      .pipe(
        startWith([{ label: dropdownLabel }]),
        map((stores) => [{ label: dropdownLabel, action: null }, ...stores]),
        tap((stores) => this.getSelectedStore(stores))
      );
    this.store.select(fromDeals.getDealsLoaded).subscribe((loaded: boolean) => {
      if (!loaded) {
        this.store.dispatch(new fromDeals.LoadStores());
      }
    });
  }
}
