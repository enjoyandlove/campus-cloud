import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { ILocation } from '@libs/locations/common/model';

declare var $: any;

@Component({
  selector: 'cp-locations-delete',
  templateUrl: './locations-delete.component.html',
  styleUrls: ['./locations-delete.component.scss']
})
export class LocationsDeleteComponent implements OnInit {
  @Input() location: ILocation;

  constructor(public store: Store<fromStore.ILocationsState | fromRoot.IHeader>) {}

  onDelete() {
    this.store.dispatch(new fromStore.DeleteLocation(this.location));
    $('#locationsDelete').modal('hide');
  }

  ngOnInit() {}
}
