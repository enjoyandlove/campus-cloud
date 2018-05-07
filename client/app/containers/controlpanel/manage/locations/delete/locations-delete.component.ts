import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CPSession } from './../../../../../session';
import { LocationsService } from '../locations.service';

declare var $: any;

@Component({
  selector: 'cp-locations-delete',
  templateUrl: './locations-delete.component.html',
  styleUrls: ['./locations-delete.component.scss'],
})
export class LocationsDeleteComponent implements OnInit {
  @Input() location: any;
  @Output() locationDeleted: EventEmitter<number> = new EventEmitter();

  constructor(public service: LocationsService, public session: CPSession) {}

  onDelete() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);
    this.service.deleteLocationById(this.location.id, search).subscribe((_) => {
      this.locationDeleted.emit(this.location.id);
      $('#locationsDelete').modal('hide');
    });
  }

  ngOnInit() {}
}
