import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { ILocation } from '@libs/locations/common/model';

declare var $: any;

@Component({
  selector: 'cp-locations-delete',
  templateUrl: './locations-delete.component.html',
  styleUrls: ['./locations-delete.component.scss']
})
export class LocationsDeleteComponent implements OnInit {
  @Input() location: ILocation;

  constructor(
    public session: CPSession,
    public store: Store<fromStore.ILocationsState | fromRoot.IHeader>
  ) {}

  onDelete() {
    const locationId = this.location.id;
    const categoryId = this.location.category_id;
    const school_id =  this.session.g.get('school').id;
    const params = new HttpParams().set('school_id', school_id);

    const payload = {
      params,
      locationId,
      categoryId
    };

    this.store.dispatch(new fromStore.DeleteLocation(payload));
    $('#locationsDelete').modal('hide');
  }

  ngOnInit() {}
}
