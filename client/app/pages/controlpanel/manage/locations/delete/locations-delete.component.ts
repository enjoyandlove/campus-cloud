import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
  selector: 'cp-locations-delete',
  templateUrl: './locations-delete.component.html',
  styleUrls: ['./locations-delete.component.scss']
})
export class LocationsDeleteComponent implements OnInit {
  @Input() location: any;
  @Output() locationDeleted: EventEmitter<number> = new EventEmitter();
  constructor() { }

  onDelete() {
    this.locationDeleted.emit(this.location.id);
    $('#locationsDelete').modal('hide');
  }

  ngOnInit() { }
}
