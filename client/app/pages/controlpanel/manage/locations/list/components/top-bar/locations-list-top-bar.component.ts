import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-locations-list-top-bar',
  templateUrl: './locations-list-top-bar.component.html',
  styleUrls: ['./locations-list-top-bar.component.scss']
})
export class LocationsListTopBarComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() launchModal: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  onSearch(query) {
    this.search.emit(query);
  }
}
