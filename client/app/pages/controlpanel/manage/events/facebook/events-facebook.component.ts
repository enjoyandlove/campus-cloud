import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from '../../../../../base/base.component';
import { StoreService } from '../../../../../shared/services/store.service';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-events-facebook',
  templateUrl: './events-facebook.component.html',
  styleUrls: ['./events-facebook.component.scss']
})
export class EventsFacebookComponent extends BaseComponent implements OnInit {
  stores;
  loading;
  reload$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private store: Store<IHeader>,
    private storeService: StoreService
  ) {
    super();
    this.buildHeader();

    super.isLoading().subscribe(res => this.loading = res);
    this.fetch();
  }

  onCreated() {
    this.reload$.next(true);
  }
  private fetch() {
    const stores$ = this.storeService.getStores().map(res => {
      const stores = [
        {
          'label': 'All Host',
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
      .then(res => {
        this.stores = res.data;
      })
      .catch(err => console.log(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Import Facebook Events',
        'subheading': '',
        'children': []
      }
    });
  }

  ngOnInit() { }
}
