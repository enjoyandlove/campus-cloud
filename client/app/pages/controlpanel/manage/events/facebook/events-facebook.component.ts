import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from '../../../../../base/base.component';
import { StoreService } from '../../../../../shared/services/store.service';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
// import { EventsService } from '../events.service';

@Component({
  selector: 'cp-events-facebook',
  templateUrl: './events-facebook.component.html',
  styleUrls: ['./events-facebook.component.scss']
})
export class EventsFacebookComponent extends BaseComponent implements OnInit {
  stores;
  loading;

  constructor(
    private store: Store<IHeader>,
    private storeService: StoreService
  ) {
    super();
    this.buildHeader();

    super.isLoading().subscribe(res => this.loading = res);
    this.fetch();
  }

  // buildForm() {
  //   this.formPost = this.fb.group({
  //     'url': ['', Validators.required],
  //     'store_id': ['', Validators.required]
  //   });

  //   this.formUpdate = this.fb.group({
  //     'links': this.fb.array([
  //       this.createLinkControl()
  //     ])
  //   });


  //   console.log(this);
  // }

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

  // createLinkControl() {
  //   return this.fb.group({
  //     'url': [null, Validators.required],
  //     'store_id': [null, Validators.required]
  //   });
  // }

  // addLinkControl() {
  //   const control = <FormArray>this.formUpdate.controls['links'];
  //   control.push(this.createLinkControl());
  // }

  // removeService(index) {
  //   const control = <FormArray>this.formUpdate.controls['links'];
  //   console.log(this.formUpdate.controls);
  //   control.removeAt(index);
  // }

  // onDeleteControl(index) {
  //   this.removeService(index);
  // }

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
