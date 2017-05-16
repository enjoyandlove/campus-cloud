import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
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
  @Input() storeId: number;
  stores;
  loading;
  reload$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private session: CPSession,
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
    const school = this.session.school;
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());

    const stores$ = this.storeService.getStores(search).map(res => {
      const stores = [
        {
          'label': 'All Hosts',
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
        'heading': 'Import Events from Facebook',
        'subheading': '',
        'children': []
      }
    });
  }

  ngOnInit() { }
}
