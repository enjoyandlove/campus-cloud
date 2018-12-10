import { OnInit, Output, Component, EventEmitter } from '@angular/core';

import { ITEMS_INTEGRATION } from '@client/app/shared/constants';

@Component({
  selector: 'cp-calendars-details-action-box',
  templateUrl: './calendars-details-action-box.component.html',
  styleUrls: ['./calendars-details-action-box.component.scss']
})
export class CalendarsDetailsActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();

  featureName = ITEMS_INTEGRATION;

  constructor() {}

  onSearch(query) {
    this.search.emit(query);
  }

  launchModal() {
    $('#calendarsItemsImport').modal();
  }

  ngOnInit() {}
}
